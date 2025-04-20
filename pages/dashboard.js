// Import React to build the functional component
import React, { useContext } from "react";

// Import the global context to access authentication/admin status
import { CrowdFundingContext } from "../Context/CrowdFunding";

// Import the Admin Dashboard component
import AdminDashboard from "../components/AdminDashboard/AdminDashboard";


/**
 * AdminDashboardPage Component
 *
 * This page maps to `/dashboard` in your application.
 * It checks if the current connected wallet has admin privilages.
 * - If the user is an admin, the full dashboard UI is rendered.
 * - If not, an access denied message is shown.
 *
 * This adds basic frontend protection and improves user experience.
 */
export default function AdminDashboardPage() {

  // Access the isAdmin flag from the context (based on smart contract's admin mapping)
  const { isAdmin } = useContext(CrowdFundingContext);

  // Render error message if user is not an admin
  if (!isAdmin) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
         Access Denied - Admins Only
      </div>
    );
  }

  // Render the admin dashboard if access is granted
  return <AdminDashboard />;
}
