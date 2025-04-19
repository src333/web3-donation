import React, { useState, useEffect, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

const COLORS = ["#2E8B57", "#e5e7eb"]; // Purple & light gray

const CampaignPieChart = () => {
  const { getAllCampaigns } = useContext(CrowdFundingContext);
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const result = await getAllCampaigns();
      setCampaigns(result);
      if (result.length > 0) {
        setSelected(result[0]); // Default to first campaign
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;

    const raised = parseFloat(selected.amountCollected);
    const target = parseFloat(selected.target);
    const remaining = Math.max(0, target - raised);

    setPieData([
      { name: "ETH Raised", value: raised },
      { name: "Remaining Target", value: remaining },
    ]);
  }, [selected]);

  return (
    <div className="bg-white mt-10 p-7 rounded-lg shadow-md h-[360px] flex flex-col justify-between">
  {/* Header with title + filter dropdown */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Campaign Progress: {selected?.title}
    </h3>
    <select
      className="p-1 border rounded text-gray-800"
      onChange={(e) =>
        setSelected(campaigns.find((c) => c.pId === Number(e.target.value)))
      }
      value={selected?.pId || ""}
    >
      {campaigns.map((campaign) => (
        <option key={campaign.pId} value={campaign.pId}>
          {campaign.title} {campaign.isDeleted ? "(Deleted)" : ""}
        </option>
      ))}
    </select>
  </div>

  {/* Chart */}
  <ResponsiveContainer width="100%" height={240}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={88}
        paddingAngle={2}
        label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
        
        
      >
        {pieData.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

  );
};

export default CampaignPieChart;
