import React, { useEffect, useState, useContext } from "react";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB");
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const TransactionLedger = () => {
  const { getAllCampaigns, getDonations, currentAccount } = useContext(CrowdFundingContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const campaigns = await getAllCampaigns();
      let all = [];

      for (const campaign of campaigns) {
        const donations = await getDonations(campaign.pId);

        donations.forEach((donation) => {
          all.push({
            date: formatDate(donation.timestamp),
            time: formatTime(donation.timestamp),
            from: donation.donator,
            to: campaign.owner,
            campaign: campaign.title,
            campaignId: campaign.pId,
            amount: parseFloat(donation.donation),
            isDeleted: campaign.isDeleted || false, // Support optional field
          });
        });
      }

      all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTransactions(all);
    };

    loadTransactions();
  }, []);

  const isCurrentAdmin = (address) =>
    currentAccount && address.toLowerCase() === currentAccount.toLowerCase();

  return (
    <div className="bg-white mt-10 p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Transactions</h3>

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
          {transactions.map((tx, i) => (
            <tr
              key={i}
              className={`border-t text-sm ${tx.isDeleted ? "bg-red-50 text-gray-500 italic" : ""}`}
            >
              <td className="px-4 py-2">{tx.date}</td>
              <td className="px-4 py-2">{tx.time}</td>
              <td className="px-4 py-2">
                <span title={tx.from} className="text-green-700">
                  {shortenAddress(tx.from)}
                </span>
                {isCurrentAdmin(tx.from) && (
                  <span className="ml-1 text-xs bg-gray-100 text-black px-1 py-0.5 rounded">Admin</span>
                )}
              </td>
              <td className="px-4 py-2">
                <span title={tx.to} className="text-green-700">
                  {shortenAddress(tx.to)}
                </span>
                {isCurrentAdmin(tx.to) && (
                  <span className="ml-1 text-xs bg-gray-100 text-black px-1 py-0.5 rounded">Admin</span>
                )}
              </td>
              <td className="px-6 py-3">
                {tx.campaign}
                {tx.isDeleted && (
                  <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    Deleted
                  </span>
                )}
              </td>
              <td className="px-6 py-3">{tx.campaignId}</td>
              <td className="px-6 py-3 font-medium">{tx.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionLedger;
