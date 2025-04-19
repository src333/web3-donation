import React, { useState, useEffect, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

// Color palette for the pie chart
const COLORS = ["#2E8B57", "#e5e7eb"]; // green tone & light gray


/**
 * CampaignPieChart Component
 *
 * This component renders a pie chart representing a single campaign's progress
 * (ETH raised vs. remaining target). It includes a dropdown to switch between campaigns.
 * 
 * Features:
 * - Automatically loads all campaigns on mount
 * - Defaults to first campaign if available
 * - Dynamically updates chart data based on selected campaign
 * - Optionally marks deleted campaigns in the dropdown for admin visibility
 */


const CampaignPieChart = () => {
  const { getAllCampaigns } = useContext(CrowdFundingContext);
  const [campaigns, setCampaigns] = useState([]);                  // All campaigns fetched from the contract
  const [selected, setSelected] = useState(null);                  // Currently selected campaign
  const [pieData, setPieData] = useState([]);                      // Data formatted for the PieChart

  //  Fetch all campaigns on initial render 
  useEffect(() => {
    const load = async () => {
      const result = await getAllCampaigns();
      setCampaigns(result);
      if (result.length > 0) {
        setSelected(result[0]); // Default to first campaign and automatically selects the first campaign
      }
    };
    load();
  }, []);


   // Update chart data whenever a different campaign is selected 
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
    {/*  Top section with heading and a dropdown to filter the pie chart between individual campaians  */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Campaign Progress: {selected?.title}
    </h3>
     {/* Dropdown to select a campaign by campaign pId */}
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

   {/*  Pie Chart  */}
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
      <Tooltip />    {/* On-hover tooltip showing values to better usabiliity and ux*/}
    </PieChart>
  </ResponsiveContainer>
</div>

  );
};

export default CampaignPieChart;
