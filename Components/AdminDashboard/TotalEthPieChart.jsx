import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

/**
 * Color scheme for the pie segments:
 * - Green: ETH raised
 * - Light gray: Remaining target
 * - Optional muted gray available for future use (e.g. deleted funds)
 */

const COLORS = ["#2E8B57", "#CBD5E1", "#A0AEC0"]; // green, light gray, muted gray for deleted (optional)

/**
 * TotalEthPieChart Component
 *
 * Shows a donut chart displaying overall fundraising performance.
 * It compares ETH raised versus the total target across all campaigns.
 * Uses getAllCampaigns() to include deleted campaigns as part of historic data.
 */

const TotalEthPieChart = () => {
  const { getAllCampaigns } = useContext(CrowdFundingContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const campaigns = await getAllCampaigns();  // includes deleted for full picture

        let totalRaised = ethers.parseEther("0");
        let totalTarget = ethers.parseEther("0");

         // Aggregate totals across all campaigns
        campaigns.forEach((campaign) => {
          totalRaised += ethers.parseEther(campaign.amountCollected);
          totalTarget += ethers.parseEther(campaign.target);
        });

        const raised = parseFloat(ethers.formatEther(totalRaised));
        const target = parseFloat(ethers.formatEther(totalTarget));

        const remaining = Math.max(target - raised, 0); // ensure no negative values

        // Set pie chart data
        setChartData([
          { name: "ETH Raised", value: raised },
          { name: "Remaining Target", value: remaining },
        ]);
      } catch (error) {
        console.error("Pie chart error:", error);
      }
    };

    fetchStats(); // run once on component mount
  }, []);

  return (
    <div className="bg-white mt-10 p-6 rounded-lg shadow-md h-[360px] flex flex-col justify-between">
        {/* Section Title */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Fundraising Progress (All Time)</h3>
       {/* Responsive Pie/Donut Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={88}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* Hoverable Tooltip to display the total amount left to raise to meet the combine target across all campaigns for better accessibility and ux */}
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalEthPieChart;
