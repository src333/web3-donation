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

const ChartsPanel = ({ data }) => {
  return (
    <div className="mt-10">
      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          ETH Raised per Campaign
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              tickFormatter={(title, index) =>
                data[index]?.isDeleted ? `${title} (Deleted)` : title
              }
            />
            <YAxis />
            <Tooltip />
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

      {/* Pie/Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <TotalEthPieChart />
        <CampaignPieChart />
      </div>
    </div>
  );
};

export default ChartsPanel;
