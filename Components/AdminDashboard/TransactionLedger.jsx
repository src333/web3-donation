import React, { useEffect, useState, useContext } from "react";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

/**
 * Utility: Shortens Ethereum addresses for readability.
 * Example: 0xabc123...789def
 */
const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

/**
 * Utility: Converts UNIX timestamp to DD/MM/YYYY format.
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB");
};

/**
 * Utility: Converts UNIX timestamp to HH:MM format (24-hour).
 */
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

/**
 * TransactionLedger Component
 *
 * Renders a paginated transaction table of all donation activity.
 * Tracks campaign name, participants, ETH value, and handles deleted campaign UI.
 * Automatically fetches from blockchain using context.
 */
const TransactionLedger = () => {
  //const { getAllCampaigns, getDonations, currentAccount } = useContext(CrowdFundingContext);
  const { getAllCampaigns, getDonations, isAdminAddress } = useContext(CrowdFundingContext);


  const [transactions, setTransactions] = useState([]);        // All donation transactions
  const [currentPage, setCurrentPage] = useState(1);           // Current visible page in pagination
  const itemsPerPage = 7;                                      // Max items to show per page

  

  /**
  * Loads all campaigns and their associated donations,
  * enriches each donation with metadata (timestamps, admin flags),
  * and stores the result in state for UI display.
  */
  useEffect(() => {
    const loadTransactions = async () => {

        // Fetch all campaigns (active + deleted)
      const campaigns = await getAllCampaigns();

      // Temporary array to accumulate parsed transaction data
      let all = [];
  
      // Loop through every campaign to collect its donations
      for (const campaign of campaigns) {
        const donations = await getDonations(campaign.pId);  // Get donation records for each campaign

         // Loop through each donation entry
        for (const donation of donations) {
          // Check if donor and campaign owner are admins
          const fromIsAdmin = await isAdminAddress(donation.donator);
          const toIsAdmin = await isAdminAddress(campaign.owner);
          
          // Push formatted transaction data to the array
          all.push({
            date: formatDate(donation.timestamp),
            time: formatTime(donation.timestamp),
            from: donation.donator,
            to: campaign.owner,
            campaign: campaign.title,
            campaignId: campaign.pId,
            amount: parseFloat(donation.donation),
            isDeleted: campaign.isDeleted || false,
            rawTimestamp: Number(donation.timestamp) * 1000,
            fromIsAdmin,
            toIsAdmin,
          });
        }
      }
      
      all.sort((a, b) => b.rawTimestamp - a.rawTimestamp); // Sort transactions from most recent to oldest
      setTransactions(all);  // Store result
    };
  
    loadTransactions(); // Trigger on mount
  }, []);
  


  /**
   * Determines if a given address belongs to the current admin wallet.
   * Adds visual tag if matched.
   */
  const isCurrentAdmin = (address) =>
    currentAccount && address.toLowerCase() === currentAccount.toLowerCase();

  //  Pagination calculations 
  const indexOfLastItem = currentPage * itemsPerPage;                      // Ending index
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;                // Starting index
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem); // Page slice
  const totalPages = Math.ceil(transactions.length / itemsPerPage);       // Total pages

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="bg-white mt-10 p-6 rounded-lg shadow-md overflow-x-auto">
      {/* Ledger Section Header */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Transactions</h3>

      {/* Main Transaction Table */}
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">From</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">Campaign</th>
            <th className="px-4 py-2">Campaign ID</th>
            <th className="px-4 py-2">Amount (ETH)</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((tx, i) => (
            <tr
              key={i}
              className={`border-t text-sm ${
                tx.isDeleted ? "bg-red-50 text-gray-500 italic" : ""
              }`}
            >
              <td className="px-4 py-2">{tx.date}</td>
              <td className="px-4 py-2">{tx.time}</td>

              {/* Donator Address */}
              <td className="px-4 py-2">
                <span title={tx.from} className="text-green-700">
                  {shortenAddress(tx.from)}
                </span>
                {tx.fromIsAdmin && (
                  <span className="ml-1 text-xs bg-gray-100 text-black px-1 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </td>

              {/* Campaign Owner Address */}
              <td className="px-4 py-2">
                <span title={tx.to} className="text-green-700">
                  {shortenAddress(tx.to)}
                </span>
                {tx.toIsAdmin && (
                  <span className="ml-1 text-xs bg-gray-100 text-black px-1 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </td>


              {/* Campaign Title + Deleted Flag */}
              <td className="px-6 py-3">
                {tx.campaign}
                {tx.isDeleted && (
                  <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    Deleted
                  </span>
                )}
              </td>

              {/* Campaign ID + Donation Amount */}
              <td className="px-6 py-3">{tx.campaignId}</td>
              <td className="px-6 py-3 font-medium">{tx.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {transactions.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-900"
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor:pointer"
                : "bg-green-700 text-white hover:bg-green-900"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionLedger;
