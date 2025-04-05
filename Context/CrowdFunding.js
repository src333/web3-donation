import React, {useState, useEffect} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";

// interanl import 
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

// fetching smart contract 

const fetchContract = (singerOrProvider) => 
    new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, singerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({children}) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount , setCurrentAccount] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);


    /* remove if this doesnt work ----------------------------------------------------------
    const adminWallets = [
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", // Replace with actual admin wallets
      ];
    */ //to here -------------------------------------------------------------------------------

    const checkAdminStatus = async (account) => {
        if (!account) return;
        try {
          const provider = new ethers.JsonRpcProvider(); // or use BrowserProvider if needed
          const contract = fetchContract(provider);
          const result = await contract.isAdmin(account);
          setIsAdmin(result);
        } catch (error) {
          console.error("Failed to check admin status:", error);
          setIsAdmin(false);
        }
    };
      

    const createCampaign = async (campaign) => {
        const {title , description , amount , deadline} = campaign; 
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        //const provider = new ethers.provider.Web3Provider(connection);
        const provider = new ethers.BrowserProvider(connection);
        //const signer = provider.getSigner();
        const signer = await provider.getSigner();
        const contract= fetchContract(signer);
        
        console.log(currentAccount);
        try{
            const transaction = await contract.createCampaign(
                //currentAccount ,
                title , 
                description,
                //ethers.utils.parseUnits(amount, 18), 
                ethers.parseUnits(amount, 18),
                new Date(deadline).getTime()
                //Math.floor(new Date(deadline).getTime() / 1000) // ai gave me this solution 
            );
            await transaction.wait();
            location.reload();
            console.log("contracy call success", transaction);
        } catch (error) {
            console.log("contract call failure", error);
        }
    };


    const getCampaigns = async ()=> {
        //const provider = new ethers.providers.JsonRpcProvider();
        const provider = new ethers.JsonRpcProvider();

        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign,i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            //target: ethers.utils.formatEther(campaign.target.toString()),
            target: ethers.formatEther(campaign.target),
            //deadline: campaign.deadline.toNumber(),
            deadline: Number(campaign.deadline),
            //amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            amountCollected: ethers.formatEther(campaign.amountCollected), 
            pId: i,
        }));

        return parsedCampaigns;
    };

    const getUserCampaigns = async () => {
        //const provider = new ethers.providers.JsonRpcProvider();
        const provider = new ethers.JsonRpcProvider();
        const contract = fetchContract(provider); 
        const allCampaigns = await contract.getCampaigns();
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        const currentUser = accounts[0];
        const filteredCampaigns = allCampaigns.filter(
            (campaign) => 
                campaign.owner?.toLowerCase() === currentUser?.toLowerCase()
            
               // campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // make it dynamic later 
        );
        /*const filteredCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner.toLowerCase() === currentAccount.toLowerCase()
        );*/
        
        const userData = filteredCampaigns.map((campaign,i ) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            //target: ethers.utils.formatEther(campaign.target.toString()),
            //amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            target: ethers.formatEther(campaign.target), 
            amountCollected: ethers.formatEther(campaign.amountCollected),
            pId: i, 
        }));

        return userData;
    };

    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        //const provider = new ethers.providers.Web3Provider(connection);
        const provider = new ethers.BrowserProvider(connection);
        //const signer = provider.getSigner();
        const signer = await provider.getSigner();
        const contract = fetchContract(signer);

        const campaignData = await contract.donateToCampaign(pId , {
            //value: ethers.utils.parseEther(amount),
            value: ethers.parseEther(amount),
        });

        await campaignData.wait();
        location.reload();

        return campaignData;
    };


    const getDonations = async (pId) => {
        //const provider = new ethers.providers.JsonRpcProvider();
        const provider = new ethers.JsonRpcProvider();
        const contract = fetchContract(provider);
        const donations = await contract.getDonators(pId);
        const numerOfDonations = donations[0].length; 
        const parsedDonations = [];

        for (let i = 0; i< numerOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                //donation: ethers.utils.formatEther(donations[1][i].toString()),
                donation: ethers.formatEther(donations[1][i]),
            });
        }

        return parsedDonations;
            
    };

    // wallet connect 
    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) {
                console.log("MetaMask not installed");
                return;
            }
    
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
    
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                console.log("Wallet already connected:", accounts[0]);
                await checkAdminStatus(accounts[0]);
                /* remove this is it doesnt work ---------------
                const lowerCased = accounts[0].toLowerCase();
                setIsAdmin(adminWallets.includes(lowerCased));
                */ //-----------------------------------------------
            } else {
                console.log("No connected accounts found.");
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    };
    

    useEffect(() => {
        checkIfWalletConnected();
        //connectWallet();
    }, []);

    /* remove if doesnt work --------------------------------------------------------------
    useEffect(() => {
        if (currentAccount) {
          setIsAdmin(adminWallets.includes(currentAccount.toLowerCase()));
        }
      }, [currentAccount]);
    */ //---------------------------------------------------------------------------------------

    // connect to wallet 
    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask to use this feature.");
                return;
            }
    
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
    
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                console.log("Connected Account:", accounts[0]);
                //setIsAdmin(adminWallets.includes(accounts[0].toLowerCase())); // remove if not work ----------------
                await checkAdminStatus(accounts[0]);
            } else {
                console.log("No accounts found.");
            }
        } catch (error) {
            console.error("Error while connecting to wallet:", error);
        }
    };
    

    console.log("Current account:", currentAccount);
    console.log("Is Admin?", isAdmin);
    return (
        <CrowdFundingContext.Provider
            value={{
                titleData,
                currentAccount,
                isAdmin, // REMOVE IF IT DOESNT WORK -----------
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                //getDonation,
                getDonations, 
                connectWallet
            }}
        >
            {children}
        </CrowdFundingContext.Provider>
    );


};