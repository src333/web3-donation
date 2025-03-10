import React, {useState, useEffect} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";

// interanl import 
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

// fetching smart contract 

const fetchContract = (singerOrProvider) => 
    new ethers.Contract(CrowdFundingAddres, CrowdFundingABI, singerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({children}) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount , setCurrentAccount] = useState("");

    const createCampaign = async (campaign) => {
        const {title , description , amount , deadline} = campaign; 
        const web3Modal = new web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.provider.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract= fetchContract(signer);
        
        console.log(currentAccount);
        try{
            const transaction = await contract.createCampaign(
                currentAccount ,
                title , 
                description,
                ethers.utils.parseUnits(amount, 18), 
                new Date(deadline).getTime()
            );
            await transaction.wait();
            console.log("contracy call success", transaction);
        } catch (error) {
            console.log("contract call failure", error);
        }
    };


    const getCampaigns = async ()=> {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const campaigns = await contract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign,i) => ({
            owner: campaign.owner,
            title: campaign.title,
            describe: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(
                campaign.amountCollected.toString()
            ),
            pId: i,
        }));

        return parsedCampaigns;
    };

    const getUserCampaigns = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider); 

        const allCampaigns = await contract.getCampaigns();

        const accounts = await window.ethereum.request({
            method: "eth_accounts",

        });
        const currentUser = accounts[0];

        const filteredCampaigns = allCampaigns.filter(
            (campaign) => 
                campaign.owner === "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" // make it dynamic later 

        );

        const userData = filteredCampaigns.map((campaign,i ) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            amountCollected: ethers.utils.formatEther(
                campaign.amountCollected.toString()
            ),
            pId: i, 

        }));

        return userData;
    };

    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        const campaignData = await contract.donateToCampaign(pId , {
            value: ethers.utils.parseEther(amount),
        });

        await campaignData.wait();
        location.reload;

        return campaignData;
    };


    const getDonation = async (pId) => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);
        const donations = await contract.getDonators(pId);
        const numerOfDonations = donations[0].length; 
        const parsedDonations = [];

        for (let i = 0; i< numerOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }

        return parsedDonations;
            
    };

    // wallet connect 
    const checkIfWalletConnected = async () => {
        try{
            if(!window.ethereum)
                return setOpenError(true) , setError("install metamask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length){
                setCurrentAccount(accounts[0]);
            }
            else {
                console.log("no acount found");
            }
        }catch (error){
            console.log("something went wrong whilst connecting to your wallet");
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    // connect to wallet 
    const connectWallet = async () => {
        try{
            if(!window.ethereum)
                return console.log("install metamask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            setCurrentAccount(accounts[0]);
        }catch(error){
            console.log("error while connecting to wallet ");
        }
    };

    return (
        <CrowdFundingContext.Provider
            value={{
                titleData,
                currentAccount,
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonation,
                connectWallet
            }}
        >
            {children}
        </CrowdFundingContext.Provider>
    );


};