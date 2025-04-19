import React from "react";
import StatsPanel from "./StatsPanel";
import DonationTimeline from "./DonationTimeline";
import TransactionLedger from "./TransactionLedger";
import CampaignTable from "./CampaignTable";

/**
 * AdminDashboard Component
 *
 * This serves as the main layout for the admin dashboard.
 * It combines high-level analytics (stats + timeline),
 * financial records (transactions), and campaign controls.
 *
 * Components rendered:
 * - StatsPanel: Shows key metrics like ETH raised, active campaigns, etc.
 * - DonationTimeline: Line chart showing donations over time.
 * - TransactionLedger: Tabular history of all donation transactions.
 * - CampaignTable: List of campaigns with edit/delete capabilities.
 */

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
        {/* Container centers the dashboard and applies padding */}
      <div className="max-w-7xl mx-auto">
         {/* Main Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

         {/* this is where all analytics are displayed */}
        <StatsPanel />
        <DonationTimeline/>
        <TransactionLedger />


         {/* campaign managment section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Campaign Management</h2>
          {/* Table listing all campaigns where admins can edit/delete them */}
            <CampaignTable/>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
