import React, { useEffect, useState, useContext } from "react";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";
import CampaignChart from "./ChartsPanel";

const StatsPanel = () => {
  const { getAllCampaigns, getDonations } = useContext(CrowdFundingContext);
  const [stats, setStats] = useState({
    totalETH: "0",
    totalDonors: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const campaigns = await getAllCampaigns();
        let totalETH = ethers.parseEther("0");
        let active = 0;
        let completed = 0;
        const donorSet = new Set();

        const now = Math.floor(Date.now() / 1000);

        const chartFormatted = [];

        for (const campaign of campaigns) {
          const amount = ethers.parseEther(campaign.amountCollected);
          totalETH += amount;

          chartFormatted.push({
            title: campaign.title + (campaign.isDeleted ? " (Deleted)" : ""),
            amountRaised: parseFloat(ethers.formatEther(amount)),
            isDeleted: campaign.isDeleted, // Add this flag so bar chart can use it
          });
          

          const isActive = Number(campaign.deadline) > now;
          isActive ? active++ : completed++;

          const donations = await getDonations(campaign.pId);
          donations.forEach((d) => donorSet.add(d.donator.toLowerCase()));
        }

        setChartData(chartFormatted);

        setStats({
          totalETH: ethers.formatEther(totalETH),
          totalDonors: donorSet.size,
          activeCampaigns: active,
          completedCampaigns: completed,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total ETH Raised" value={`Ξ ${Number(stats.totalETH).toFixed(2)}`} />
        <StatCard label="Total Donors" value={stats.totalDonors} />
        <StatCard label="Active Campaigns" value={stats.activeCampaigns} />
        <StatCard label="Completed Campaigns" value={stats.completedCampaigns} />
      </div>

      {/* Chart below the cards */}
      <CampaignChart data={chartData} />
    </>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow p-6 text-center">
    <h4 className="text-lg font-semibold text-gray-600 mb-2">{label}</h4>
    <p className="text-2xl font-bold text-green-700">{value}</p>
  </div>
);

export default StatsPanel;
