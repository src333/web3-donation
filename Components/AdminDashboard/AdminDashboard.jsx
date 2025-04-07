import React from "react";
import StatsPanel from "./StatsPanel";
import DonationTimeline from "./DonationTimeline";
import TransactionLedger from "./TransactionLedger";
import CampaignTable from "./CampaignTable";



const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Stats section */}
        <StatsPanel />
        <DonationTimeline/>
        <TransactionLedger />


        {/* Future sections */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Campaign Management</h2>
          {/* Add CampaignTable.jsx here later */}
            <CampaignTable/>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
