import React, { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CrowdFundingContext } from "../../Context/CrowdFunding";
import { ethers } from "ethers";

/**
 * DonationTimeline Component
 *
 * Displays a line chart of donations over time with dynamic filters:
 * - Today
 * - Last 7 days
 * - Last 30 days
 * - Last year
 *
 * Uses Recharts for visualisation and fetches all campaigns (including deleted)
 * to ensure historical donation data is preserved.
 */

const DonationTimeline = () => {
  const { getAllCampaigns, getDonations } = useContext(CrowdFundingContext);
  const [timelineData, setTimelineData] = useState([]);
  const [filter, setFilter] = useState("week");    // Default view: Last 7 days

   // Format donation time into short hour:minute format (used for 'today' filter) via the x-axis 
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  // Format donation timestamp to readable date string (used for non-today filters) via the x-axis 
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-GB");
  };

  // Check if a donation falls within the currently selected filter range
  const isWithinFilterRange = (timestamp) => {
    const now = new Date();
    const donationDate = new Date(timestamp);
    const diffInDays = (now - donationDate) / (1000 * 60 * 60 * 24);

    switch (filter) {
      case "today":
        return now.toDateString() === donationDate.toDateString();
      case "week":
        return diffInDays <= 7;
      case "month":
        return diffInDays <= 30;
      case "year":
        return diffInDays <= 365;
      default:
        return true;
    }
  };

  // Fetch and process donation data when the filter changes
  useEffect(() => {
    const fetchTimeline = async () => {
      const campaigns = await getAllCampaigns();  // Includes deleted campaigns for historical accuracy maintained within visualtions 
      let donations = [];

       // Accumulate all donations from every campaign
      for (const campaign of campaigns) {
        const data = await getDonations(campaign.pId);
        donations = [...donations, ...data];
      }

      // Filter donations by time and format them for chart use
      const filtered = donations
        .filter((d) => isWithinFilterRange(d.timestamp))
        .map((d) => ({
          time: filter === "today" ? formatTime(d.timestamp) : formatDate(d.timestamp),
          amount: parseFloat(d.donation),
        }));

      // If not viewing 'today', group donations by date and sum them
      const grouped =
        filter === "today"
          ? filtered
          : filtered.reduce((acc, curr) => {
              const existing = acc.find((item) => item.time === curr.time);
              if (existing) {
                existing.amount += curr.amount;
              } else {
                acc.push({ ...curr });
              }
              return acc;
            }, []);
      
      // Sort by date or time depending on view
      setTimelineData(
        grouped.sort((a, b) => {
          if (filter === "today") {
            const today = new Date().toISOString().split("T")[0];
            return new Date(`${today}T${a.time}`) - new Date(`${today}T${b.time}`);
          } else {
            const [dayA, monthA, yearA] = a.time.split("/");
            const [dayB, monthB, yearB] = b.time.split("/");
            return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
          }
        })
      );
    };

    fetchTimeline();
  }, [filter]);  // Re-run when the filter changes

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10">
      {/* Header with filter dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Donation Timeline ({filter})
        </h3>
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Chart container */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* X Axis with conditional labeling */}
          <XAxis
            dataKey="time"
            label={{
              value: filter === "today" ? "Time" : "Date",
              position: "insideBottom",
              offset: -2.5,
              style: { fill: "#555", fontSize: 12 },
            }}
          />
           {/* Y Axis used for displaying ETH values */}
          <YAxis
            label={{
              value: "ETH Donated",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fill: "#555", fontSize: 12 },
            }}
          />
           {/* Hoverable Tooltip to display the timestamp of the donation the its quantity for bette accessibility and ux */}
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#2E8B57" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationTimeline;
