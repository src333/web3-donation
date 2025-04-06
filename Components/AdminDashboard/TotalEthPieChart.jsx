import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

const COLORS = ["#7e22ce", "#e2e8f0"]; // purple & gray

const TotalEthPieChart = () => {
  const { getCampaigns } = useContext(CrowdFundingContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const campaigns = await getCampaigns();

        let totalRaised = ethers.parseEther("0");
        let totalTarget = ethers.parseEther("0");

        campaigns.forEach(campaign => {
          totalRaised += ethers.parseEther(campaign.amountCollected);
          totalTarget += ethers.parseEther(campaign.target);
        });

        const raised = parseFloat(ethers.formatEther(totalRaised));
        const target = parseFloat(ethers.formatEther(totalTarget));

        setChartData([
          { name: "ETH Raised", value: raised },
          { name: "Remaining Target", value: Math.max(target - raised, 0) },
        ]);
      } catch (error) {
        console.error("Pie chart error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white mt-10 p-6 rounded-lg shadow-md h-[360px] flex flex-col justify-between">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Fundraising Progress</h3>
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
            label
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
