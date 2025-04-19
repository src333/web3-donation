import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

const COLORS = ["#2E8B57", "#CBD5E1", "#A0AEC0"]; // green, light gray, muted gray for deleted (optional)

const TotalEthPieChart = () => {
  const { getAllCampaigns } = useContext(CrowdFundingContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const campaigns = await getAllCampaigns();

        let totalRaised = ethers.parseEther("0");
        let totalTarget = ethers.parseEther("0");

        campaigns.forEach((campaign) => {
          totalRaised += ethers.parseEther(campaign.amountCollected);
          totalTarget += ethers.parseEther(campaign.target);
        });

        const raised = parseFloat(ethers.formatEther(totalRaised));
        const target = parseFloat(ethers.formatEther(totalTarget));

        const remaining = Math.max(target - raised, 0);

        setChartData([
          { name: "ETH Raised", value: raised },
          { name: "Remaining Target", value: remaining },
        ]);
      } catch (error) {
        console.error("Pie chart error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white mt-10 p-6 rounded-lg shadow-md h-[360px] flex flex-col justify-between">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Fundraising Progress (All Time)</h3>
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
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalEthPieChart;
