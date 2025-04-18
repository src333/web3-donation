import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TotalEthPieChart from "./TotalEthPieChart"; 
import CampaignPieChart from "./CampaignPieChart";

const ChartsPanel = ({ data }) => {
    return (
      <div className="mt-10">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">ETH Raised per Campaign</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amountRaised" fill="#2E8B57" />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        {/* Pie/Donut Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TotalEthPieChart />
            <CampaignPieChart />
        </div>
      </div>
    );
};

export default ChartsPanel;



