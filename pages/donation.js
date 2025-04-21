/**
 *  Donation Page
 *
 *  Adapted from: Daulat Hussain’s Web3.0 Crowdfunding Tutorial (original 'index.js')
 * https://www.youtube.com/watch?v=AcXVKkYnu1c
 *
 *  Enhancements by Sahar Choudhury:
 * - Converted from default index route to `/donation` route for better navigation
 * - minor change to variable naming (e.g., `usecampaign` → `userCampaigns`)
 * - Added full inline documentation for context, logic, and UI
 * - Modularised data fetching using `fetchData()` pattern inside `useEffect`
 * - Added accessibility-friendly structure for component usage
 * - UI logic extended with dynamic popup donation state tracking
 *
 * The core layout and logic are inspired by the tutorial but expanded for better UX and maintainability.
 */



// Import React and necessary hooks for state and lifecycle management
import React, {useEffect , useContext , useState} from "react" ;

// Import the global context that handles blockchain interactions and state
import { CrowdFundingContext } from "../Context/CrowdFunding";

// Import local reusable UI components
import {Hero , Card , PopUp} from "../Components";

//imports ledger component 
import TransactionLedger from "../Components/AdminDashboard/TransactionLedger";
import PublicTransactionLedger from "../Components/PublicTransactionLedger";



/**
 * Donation Page
 * 
 * This is the main donation route (`/donation`) where users can:
 * - View all campaigns
 * - View their own created campaigns
 * - Open a donation popup to contribute ETH
 * 
 * It also connects to the smart contract to retrieve campaign and donation data.
 */
const index = () => {

  // Destructure values and functions from the CrowdFundingContext
  const {
    titleData,             // Hero banner title
    getCampaigns,          // Fetch all active (non-deleted) campaigns
    createCampaign,        // Function to create a new campaign (admin only)
    donate,                // Function to send ETH to a campaign
    getUserCampaigns,      // Get campaigns created by the current wallet
    getDonations,          // Get donation history for a campaign
  } = useContext(CrowdFundingContext);

  // State to hold all campaigns from the blockchain
  const [allcampaign, setAllcampaign] = useState();

  // State to hold only campaigns created by the current user
  const [usecampaign, setUsercampaign]= useState();

  /*useEffect(() => {
    const getCampaignsData = getCampaigns();
    const userCampaignsData= getUserCampaigns();
    return async () => {
      const allData = await getCampaignsData; 
      const userData = await userCampaignsData;
      setAllcampaign(allData);
      setUsercampaign(userData);
    } ;
  }, []); */

   // Fetch campaign data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const allData = await getCampaigns();           // All public campaigns
      const userData = await getUserCampaigns();      // Campaigns owned by this user
      setAllcampaign(allData);
      setUsercampaign(userData);
    };
  
    fetchData(); // Call the async function
  }, []);
  

  // donation popup model
  // State to control the donation popup visibility
  const [openModel , setOpenModel] = useState(false);

  // State to track which campaign the user wants to donate to
  const [donateCampaign, setDonateCampaign] = useState();

  // Debug: show selected donation target
  console.log(donateCampaign);
  return(
    <>
      {/* Top section banner with create campaign button (for admins) */}
      <Hero titleData={titleData} createCampaign={createCampaign}/>

      {/* All public campaigns */}
      <Card 
        titleData="All Listed Campaign"
        allcampaign={allcampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

       {/* Campaigns created by the current wallet user */}
      <Card
        titleData="Your Created Campaign"
        allcampaign={allcampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

       {/* Donation popup modal */}
      {openModel && (
        <PopUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}

      {/*  Add Transaction Ledger Below  */}
      <PublicTransactionLedger />


    </>
    
  );
};

export default index;