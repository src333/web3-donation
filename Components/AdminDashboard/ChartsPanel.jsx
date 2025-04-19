import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import TotalEthPieChart from "./TotalEthPieChart"; 
import CampaignPieChart from "./CampaignPieChart";

/**
 * ChartsPanel Component
 *
 * Displays key campaign insights through:
 * 1. Bar chart of ETH raised per campaign
 * 2. Total fundraising pie chart
 * 3. Campaign-specific pie chart (selectable)
 *
 * Props:
 * - data: Array of campaign data objects, each containing title, amountRaised, isDeleted
 */

const ChartsPanel = ({ data }) => {
  return (
    <div className="mt-10">
       {/* 
          Bar Chart representing the total ETH Raised per Campaign*/}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          ETH Raised per Campaign
        </h3>
        {/* Makes charts responsive to screen size */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
             {/* X Axis is used to represent the data of all campaign titles) */}
            <XAxis
              dataKey="title"
              tickFormatter={(title, index) =>
                data[index]?.isDeleted ? `${title} (Deleted)` : title
              }
            />
            {/* Y Axis is used to represent the data of all the ETH raised per campaign title */}
            <YAxis />

             {/* Hover tooltip for better accessibility and ux*/}
            <Tooltip />

             {/* Bars to show each campaign's raised ETH */}
            <Bar dataKey="amountRaised">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isDeleted ? "#CBD5E1" : "#2E8B57"} // Light gray if deleted, green otherwise
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie/Donut Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Total ETH Raised vs Target */}
        <TotalEthPieChart />

         {/* Specific Campaign Progress pie chart*/}
        <CampaignPieChart />
      </div>
    </div>
  );
};

export default ChartsPanel;
