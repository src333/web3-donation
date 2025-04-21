// Import necessary React utilities
import React, {useState, useEffect} from "react";                                                        
// Web3Modal is a library that simplifies wallet connection (e.g., in our case MetaMask)
import Web3Modal from "web3modal";                                                                        
// Ethers.js is the main library used to interact with the Ethereum blockchain
import {ethers} from "ethers";                                                                           

// Internal imports: ABI (contract interface) and deployed contract address
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";                                        




/**
* CrowdFunding Context Provider
*
* This file was initially based on tutorial code from: Daulat Hussain's Web3.0 Crowdfunding tutorial 
* https://www.youtube.com/watch?v=AcXVKkYnu1c&ab_channel=DaulatHussain
*
* Major Enhancements & Modifications by [Sahar Choudhury]:
* - Migrated to Ethers.js v6 syntax
* - Full inline documentation with JSDoc-style comments
* - Integrated admin verification using isAdmin() smart contract method
* - Created context-based logic for conditional rendering (e.g., admin dashboards)
* - also added getAllCampaigns(), updateCampaign(), and deleteCampaign() for admin use
* - Improved error handling, loading states, and UI syncing
* - Refactored async wallet logic to modern standards
* - Extended donation parsing with timestamps for analytics
* - Used best practices for secure interaction with smart contracts
*
* The structure remains similar to the original tutorial, but most logic has been expanded,
* secured, and adapted for advanced use cases.
*/




// Utility: fetchContract()
// Dynamically returns a contract instance using either a provider (read-only)
// or a signer (for sending transactions)
const fetchContract = (singerOrProvider) =>                                                                
    new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, singerOrProvider);                          

// Create a new Context object for the CrowdFunding dApp
export const CrowdFundingContext = React.createContext();                                                  

// Context Provider
// This component wraps your application and provides all blockchain-related functions and state
export const CrowdFundingProvider = ({children}) => {                                                       

    // Title shown in UI (optional, used in dashboards)
    const titleData = "Crowd Funding Contract";                                                            

     // Connected wallet address (empty string if not connected)
    const [currentAccount , setCurrentAccount] = useState("");                                            

    // Boolean flag: true if connected user is an admin (on-chain verification)
    const [isAdmin, setIsAdmin] = useState(false);                                                          


 
    // Function: checkAdminStatus()
    /**
    * Checks if the connected account is marked as an admin by the smart contract.
    * Useful for conditionally rendering admin-only views or routes.
    *
    * @param {string} account - Ethereum address of the connected wallet
    */
    const checkAdminStatus = async (account) => {
        if (!account) return; // Exit early if no wallet connected
        
        try {
          // Create a read-only connection to the blockchain
          const provider = new ethers.JsonRpcProvider(); // (Default to local Hardhat network or it can be replaced with actual RPC URL)
          
          // Instantiate the contract with the provider
          const contract = fetchContract(provider);

          // Call the isAdmin(address) function from the contract
          const result = await contract.isAdmin(account);

          // Update admin state
          setIsAdmin(result);
        } catch (error) {
          console.error("Failed to check admin status:", error);
          setIsAdmin(false);  // set status to false if anything occours to cause a failure
        }
    };



    /**
    * Checks if any given address is an admin (used for ledger display).
    * created to fix admin badge bug on the transaction ledger 
    * @param {string} address - Wallet address to check
    * @returns {boolean} True if address is an admin
    */
    const isAdminAddress = async (address) => {
      try {
        const provider = new ethers.JsonRpcProvider(); // read-only
        const contract = fetchContract(provider);
        const result = await contract.isAdmin(address);
        return result;
      } catch (error) {
        console.error("Failed to check admin status for address:", address, error);
        return false;
      }
    };

      

    /**
    * function: createCampaign()
    * Sends a transaction to the smart contract to create a new crowdfunding campaign.
    * This function should be called only by an authorised wallet (typically an admin).
    *
    * @param {Object} campaign - Object containing the campaign details from the form
    *   - title: string
    *   - description: string
    *   - amount: string (in ETH)
    *   - deadline: string (date input)
    */

    /**
    * Function adapted from: Daulat Hussain’s Web3.0 Crowdfunding Tutorial
    * https://www.youtube.com/watch?v=AcXVKkYnu1c
    *
    *  Modified by Sahar Choudhury:
    * - Migrated to Ethers.js v6 (parseUnits, BrowserProvider)
    * - Removed `_owner` parameter (uses msg.sender in contract)
    * - Added inline documentation for clarity
    * - Added page reload to sync state after creation
    */
    const createCampaign = async (campaign) => {                                              
        // Destructure form input values
        const {title , description , amount , deadline} = campaign;                            

        // Initialise Web3Modal and prompt wallet connection (MetaMask, WalletConnect)
        const web3Modal = new Web3Modal();                                                     
        const connection = await web3Modal.connect();   // This opens the wallet popup          

        // Create an ethers.js provider using the connected wallet
        const provider = new ethers.BrowserProvider(connection);                                
 
        // Get the signer (represents the user account that will sign transactions)
        const signer = await provider.getSigner();                                              

        // Instantiate the contract using the signer (read & write access)
        const contract= fetchContract(signer);                                                  
        
        // For debugging purposes this will log the account trying to create a campaign
        console.log(currentAccount);                                                           

        try{                                                                                     
            // Send transaction to the contract's createCampaign function
            const transaction = await contract.createCampaign(                                  
                //currentAccount ,             
                title ,                                                                      
                description,
                //ethers.utils.parseUnits(amount, 18), 
                ethers.parseUnits(amount, 18),                                               
                new Date(deadline).getTime()                                                  
            );

            // Wait for the transaction to be mined
            await transaction.wait();                                                         

            // an optional reload for the page to refresh campaign list after creation 
            location.reload();

            // Log success for developer reference
            console.log("contracy call success", transaction);                                 
        } catch (error) {                                                                     
            // Log failure reason to help with debugging
            console.log("contract call failure", error);                                      
        }
    };


    /**
    * getCampaigns()
    *
    * Fetches all campaigns stored in the smart contract and transforms the data
    * into a readable format for the frontend.
    *
    * This is a read-only operation that does not require a connected wallet.
    *
    * @returns {Array<Object>} - List of parsed campaigns with user-friendly structure
    */

    /**
    * Function based on tutorial logic from: Daulat Hussain
    * https://www.youtube.com/watch?v=AcXVKkYnu1c
    *
    *  Modified by Sahar Choudhury:
    * - Migrated to Ethers.js v6 formatting
    * - Improved campaign parsing logic (cleaner format)
    * - Renamed variables for better readability
    */
    const getCampaigns = async ()=> {                                                                              

        // Initialise a provider to read data from the blockchain
        // JsonRpcProvider connects to a local blockchain (e.g., Hardhat in our case) or a custom endpoint
        const provider = new ethers.JsonRpcProvider();     

        // Create a read-only instance of the contract
        const contract = fetchContract(provider);                                                                   

        // Call the smart contract method to get all campaigns
        // This returns raw Solidity data like hex strings or bignumber for example 
        const campaigns = await contract.getCampaigns();                                                         

        // Transform the raw blockchain data into a readable format
        const parsedCampaigns = campaigns.map((campaign,i) => ({                                                  
            owner: campaign.owner,                     // Wallet address of campaign creator                      
            title: campaign.title,                     // Title of the campaign                                      
            description: campaign.description,         // Brief description of the campaign                         

            // Convert target from Wei which is the smallest units for eth, into ETH for UI readability
            target: ethers.formatEther(campaign.target),
            
            // Convert deadline from BigNumber to JS number (timestamp)
            deadline: Number(campaign.deadline),
            
            // Format the collected ETH value for frontend display
            amountCollected: ethers.formatEther(campaign.amountCollected), 

            // Get the campaign ID which is stored in campaign.id
            //pId: i,
            pId: Number(campaign.id)

        }));
        
        // Returns the cleaned-up campaign list
        return parsedCampaigns;                                                                                     
    };



    /**
    * getUserCampaigns
    *
    * Fetches all campaigns created by the currently connected wallet (user).
    * 
    * This function uses the `eth_accounts` method to retrieve the user's address,
    * then filters all blockchain campaigns to only include those owned by that address.
    *
    * @returns {Array<Object>} - List of campaigns created by the connected wallet
    */

    /**
    * Function logic adapted from: Daulat Hussain (Campaign filtering by user)
    * https://www.youtube.com/watch?v=AcXVKkYnu1c
    *
    *  Modifications by Sahar Choudhury:
    * - Made wallet address dynamic (no hardcoded value)
    * - Ensured case-insensitive address matching
    * - Migrated to Ethers.js v6
    * - Added additional validation for campaign and wallet presence
    */
    const getUserCampaigns = async () => {                                                    
        try {
          // Check if running in a browser with MetaMask installed
          if (typeof window === "undefined" || !window.ethereum) {
            console.warn("MetaMask not available.");
            return [];
          }
          
          // Create a read-only connection to the blockchain
          const provider = new ethers.JsonRpcProvider();                                    

          // Fetch the deployed contract instance using the provider
          const contract = fetchContract(provider);                                       

          // Get all campaigns from the smart contract
          const allCampaigns = await contract.getCampaigns();                                
          
          // Request the list of user accounts from MetaMask
          const accounts = await window.ethereum.request({                                  
            method: "eth_accounts",                                                          
          });
          
          // Assume the first account is the connected wallet
          const currentUser = accounts[0];                                                   
      
          // Filter campaigns to include only those created by the current user
          const filteredCampaigns = allCampaigns.filter((campaign) => {                       
            return (
              campaign?.owner &&                                           // Ensures campaign has an owner            
              currentUser &&                                               // Ensures user wallet is available
              campaign.owner.toLowerCase() === currentUser.toLowerCase()   // Match case-insensitive addresses
            );
          });
          
          // Transform campaign data into a frontend-friendly format
          const userData = filteredCampaigns.map((campaign, i) => ({
            owner: campaign.owner,                                         // Campaign creator wallet
            title: campaign.title,                                         // Campaign title
            description: campaign.description,                             // Campaign summary
            target: ethers.formatEther(campaign.target),                   // Convert target to ETH from Wei
            amountCollected: ethers.formatEther(campaign.amountCollected), // Convert amount raised
            //pId: i,
            pId: Number(campaign.id),                                      // Unique campaign ID where .id should be from the smart contract
          }));
      

          // Return the filtered list of user-owned campaigns
          return userData;                                                                                   


        } catch (error) {
          // Handle errors (e.g., MetaMask rejection, contract call failure)
          console.error("Failed to fetch user campaigns:", error);
          return [];
        }
    };


    /**
    * getAllCampaigns()
    *
    * Retrieves all campaigns ever created — including deleted ones — 
    * from the smart contract using the `getAllCampaigns()` method.
    *
    * This is used for admin views, dashboards, analytics, 
    * where even soft-deleted data must be retained.
    *
    * @returns {Array<Object>} Parsed and normaliesd list of all campaign objects
    */
    const getAllCampaigns = async () => {

      // Create a read-only connection to the blockchain
      const provider = new ethers.JsonRpcProvider();

      // Fetch the deployed contract instance using the provider via address + ABI + provider
      const contract = fetchContract(provider);

      // Call the smart contract method to retrieve all campaigns (including deleted ones)
      const campaigns = await contract.getAllCampaigns();
    
      // Format the raw smart contract data into a frontend-friendly format
      const parsedCampaigns = campaigns.map((campaign) => ({
        owner: campaign.owner,                                           // Wallet address of campaign creator
        title: campaign.title,                                           // Campaign title
        description: campaign.description,                               // Campaign summary or purpose
        target: ethers.formatEther(campaign.target),                     // Funding goal converted from Wei to ETH
        amountCollected: ethers.formatEther(campaign.amountCollected),   // ETH raised so far
        deadline: Number(campaign.deadline),                             // Deadline as a JS timestamp
        pId: Number(campaign.id),                                        // Unique ID (useful for referencing in UI)
        isDeleted: campaign.isDeleted,                                   // Flag for soft-deleted campaigns (important for admin UX)
      }));
    

      // Return the processed and normalised data
      return parsedCampaigns;
    };
    
      
    /**
    * donate()
    *
    * Allows a connected wallet to donate ETH to a specific campaign.
    * Interacts directly with the `donateToCampaign` smart contract method.
    *
    * Steps:
    * 1. Connects to MetaMask or compatible Web3 wallet.
    * 2. Uses wallet signer to call `donateToCampaign(pId, { value: X })`.
    * 3. Sends ETH with the transaction (in parsed format).
    * 4. Waits for the transaction to be confirmed.
    * 5. Reloads the page on success.
    *
    * @param {number} pId - The unique ID of the campaign to donate to.
    * @param {string} amount - The amount of ETH (as string) to donate.
    * @returns {Promise<Object>} - The transaction object if successful.
    */

    /**
    * Donation function originally derived from: Daulat Hussain’s Crowdfunding tutorial
    * https://www.youtube.com/watch?v=AcXVKkYnu1c
    *
    *  Modifications by Sahar Choudhury:
    * - Updated for Ethers v6 (parseEther, BrowserProvider)
    * - Added page reload post-confirmation
    * - Added inline comments for clarity and maintainability
    */
    const donate = async (pId, amount) => {

        // Initialise Web3Modal popup to connect user wallet (MetaMask)
        const web3Modal = new Web3Modal();                                                                
        const connection = await web3Modal.connect();                                                    

        // Create a provider using the browser wallet connection (MetaMask)
        const provider = new ethers.BrowserProvider(connection);

        // Get signer instance (the user's wallet) for sending transactions
        const signer = await provider.getSigner(); 

        // Fetch the smart contract instance with signer (so we can write)
        const contract = fetchContract(signer);                                                          

        // Call the contract's donateToCampaign method with ETH value
        const campaignData = await contract.donateToCampaign(pId , {  
            value: ethers.parseEther(amount),   // Convert ETH string → BigNumber (in Wei)
        });

         // Wait for the blockchain to confirm the transaction
        await campaignData.wait();                                                                      

        // Refresh the page after successful donation
        location.reload();                                                                              

         // Return transaction object which was optional but used in case we want to track or debug
        return campaignData;                                                                             
    };



    /**
    * updateCampaign()
    *
    * Allows an admin  to update an existing campaign from the dashboard page via campaign management.
    * Interacts with the smart contract's `updateCampaign()` function.
    *
    * Fields that can be modified:
    * - Title
    * - Description
    * - Target amount (in ETH)
    *
    * @param {number} pId - The ID of the campaign to update
    * @param {string} title - The new title for the campaign
    * @param {string} description - Updated description text
    * @param {string} target - New target amount in ETH (as string)
    */
    const updateCampaign = async (pId, title, description, target) => {
        try {
          // Initialise Web3Modal to prompt wallet connection
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();

          // Wrap connection into ethers.js provider
          const provider = new ethers.BrowserProvider(connection);

          // Extract signer (wallet that will perform the update)
          const signer = await provider.getSigner();

          // Create contract instance with signer to authorise write actions
          const contract = fetchContract(signer);
          
          // Call update function on the smart contract with new data
          const tx = await contract.updateCampaign(
            pId,                                      // Campaign ID to update
            title,                                    // New campaign title
            description,                              // New campaign description
            ethers.parseUnits(target, 18)             // New target amount in Wei
          );
      
          // Wait for the transaction to be mined
          await tx.wait();

          console.log("Campaign updated");
        } catch (error) {
          // Handle errors (e.g., user rejection, contract issues)
          console.error("Failed to update campaign:", error);
        }
      };
      

      /**
      * deleteCampaign()
      *
      * Calls the smart contract to mark a campaign as deleted.
      * Only accessible to campaign creators or admins, depending on contract logic.
      *
      * This is a "soft delete" — typically the campaign stays on-chain
      * but is hidden and remove in the UI, however its data is still visible in the analytics dashboard via visulations.
      *
      * @param {number} pId - The ID of the campaign to delete
      */
      const deleteCampaign = async (pId) => {
        try {

          // Prompt user to connect their wallet via Web3Modal
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();

          // Initialise a provider from the wallet connection
          const provider = new ethers.BrowserProvider(connection);

          // Retrieve signer — the connected wallet that will sign the delete transaction
          const signer = await provider.getSigner();

          // Fetch the smart contract instance with the signer attached
          const contract = fetchContract(signer);
          
          // Call the contract's deleteCampaign() method with the campaign ID
          const tx = await contract.deleteCampaign(pId);

          // Wait for the blockchain transaction to be mined and confirmed
          await tx.wait();

          console.log("Campaign deleted");
        } catch (error) {
          // handle errors (e.g. rejection, unauthorised user, gas issues)
          console.error("Failed to delete campaign:", error);
        }
      };
    


    /**
    * getDonations()
    *
    * Fetches all donations for a specific campaign from the blockchain.
    * Returns a parsed array of donor records with readable ETH values and timestamps.
    *
    * @param {number} pId - The ID of the campaign for which to fetch donation history
    * @returns {Array} Array of donation objects: { donator, donation (in ETH), timestamp (in ms) }
    */

    /**
    * Donation history fetching logic based on: Daulat Hussain’s Web3 tutorial
    * https://www.youtube.com/watch?v=AcXVKkYnu1c
    *
    *  Modified by Sahar Choudhury:
    * - Refactored parsing to include timestamps for analytics
    * - Renamed and improved clarity of returned data
    * - Wrapped in try-catch for better error handling
    */
    const getDonations = async (pId) => {                                                                  
       // Connect to Ethereum network using default JSON-RPC provider (read-only)                          
        const provider = new ethers.JsonRpcProvider();

        // Load the smart contract using provider (no signer needed for read calls)
        const contract = fetchContract(provider);                                                         
      
        try {
          // Fetch raw donor data from the contract. This function returns three parallel arrays:
          // - donators: array of wallet addresses
          // - donations: array of donation values in Wei
          // - timestamps: array of UNIX timestamps (in seconds)
          const [donators, donations, timestamps] = await contract.getDonators(pId);
      
          // Merge the parallel arrays into a unified and readable format
          const parsedDonations = donators.map((donator, i) => ({
            donator,
            donation: ethers.formatEther(donations[i]),                     // Convert from Wei to ETH (e.g., 1000000000000000000 -> 1.0)
            timestamp: Number(timestamps[i]) * 1000,                        // Convert to milliseconds for JS Date
          }));
      
           // Return the structured donation list
          return parsedDonations;                                                                          
        } catch (error) {
          // If something fails (e.g. invalid ID or connection error), return an empty array 
          console.error("Failed to get donations:", error);
          return [];
        }
      };
      

    /**
    * checkIfWalletConnected()
    *
    * This function checks if the user has already connected a crypto wallet (like MetaMask)
    * to the application. If a wallet is connected, it stores the wallet address in the state
    * and checks if that wallet has admin privileges.
    *
    * It runs automatically (e.g. on app load) to detect and maintain wallet state.
    */

    /**
    * Wallet connection logic reused from: Daulat Hussain’s Web3 tutorial
    * https://www.youtube.com/watch?v=AcXVKkYnu1c
    *
    *  Modified by Sahar Choudhury:
    * - Enhanced with admin status check using contract call
    * - Added descriptive console logs
    * - Improved error handling and UX
    */
    const checkIfWalletConnected = async () => {                                                      
        try {                                                                                             
          // Check if the browser has access to the Ethereum provider (e.g., MetaMask)
            if (!window.ethereum) {                                                                      
                console.log("MetaMask not installed");                                                  
                return;                                 // Exit if no wallet is detected
            }
     
            // Request list of accounts that are authorised (connected) in MetaMask
            const accounts = await window.ethereum.request({                                             
                method: "eth_accounts",                                                                  
            });
            
             // If at least one account is connected:
            if (accounts.length > 0) {
              // Save connected account to state
              setCurrentAccount(accounts[0]);
              console.log("Wallet already connected:", accounts[0]);

              // Check whether this connected wallet has admin privileges
              await checkAdminStatus(accounts[0]);
                
            } else {
                 // No accounts connected (MetaMask installed, but not active or authorised)
                console.log("No connected accounts found.");
            }
        } catch (error) {
            // Handle unexpected errors 
            console.error("Error checking wallet connection:", error);
        }
    };
    
    /**
    * useEffect Hook
    *
    * This hook runs once when the component is mounted.
    * It automatically checks if a wallet is already connected by calling `checkIfWalletConnected`.
    * 
    * This improves user experience by persisting the connection across page reloads
    * or returning users without them needing to reconnect their wallet manually.
    */
    useEffect(() => {
        // Check if a wallet is already connected (MetaMask/browser wallet)
        checkIfWalletConnected();
        //connectWallet();
    }, []);  // Empty dependency array means this runs only once
    


    /**
    * connectWallet
    *
    * Triggers MetaMask (or compatible wallet) connection flow.
    * If the user approves access, the wallet address is stored in state (`currentAccount`)
    * and admin status is also checked for permission-based UI logic.
    */
    const connectWallet = async () => {                                                               
        try {                                                                                        
            // Checks if MetaMask (or another wallet provider) is installed 
            if (!window.ethereum) {                                                                   
                alert("Please install MetaMask to use this feature.");
                return;
            }
             // Requests access to wallet accounts will prompt the user for approval
            const accounts = await window.ethereum.request({                                         
                method: "eth_requestAccounts",                                                        
            });
            
            // If the user approved and we received at least one account
            if (accounts.length > 0) {
                // we set the current account in local state for access elsewhere
                setCurrentAccount(accounts[0]);
                console.log("Connected Account:", accounts[0]);
            
                // Check if this account has admin privileges via the smart contract
                await checkAdminStatus(accounts[0]);
            } else {
                console.log("No accounts found.");
            }
        } catch (error) {
            console.error("Error while connecting to wallet:", error);
        }
    };
    
    // Logging current wallet and admin state for debugging
    console.log("Current account:", currentAccount);
    console.log("Is Admin?", isAdmin);

    
    /**
    * CrowdFundingContext.Provider
    *
    * This is the return value of the provider component.
    * It makes the context values available throughout the app
    * to any components consuming the CrowdFundingContext.
    */
    return (                                                                                             
        <CrowdFundingContext.Provider                                                                    
            value={{
                titleData,
                currentAccount,
                isAdmin, 
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations, 
                connectWallet,
                updateCampaign,
                deleteCampaign,
                getAllCampaigns,
                isAdminAddress,
            }}
        >
            {/* Provide all of the above to children components */}
            {children}
        </CrowdFundingContext.Provider>                                                                   
    );


};