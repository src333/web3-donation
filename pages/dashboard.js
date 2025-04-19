import React, { useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import AdminDashboard from "../components/AdminDashboard/AdminDashboard";

export default function AdminDashboardPage() {
  const { isAdmin } = useContext(CrowdFundingContext);

  if (!isAdmin) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        🔒 Access Denied - Admins Only
      </div>
    );
  }

  return <AdminDashboard />;
}
