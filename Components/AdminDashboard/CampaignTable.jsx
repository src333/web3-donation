import React, { useEffect, useState, useContext } from "react";
import { CrowdFundingContext } from "../../Context/CrowdFunding";

/**
 * CampaignTable Component
 *
 * This component renders a dynamic table of all campaigns with inline editing and delete options.
 * It enables admins to manage campaign data like title, description, and target amount.
 * 
 * Features:
 * - Fetches all campaigns on mount
 * - Allows inline editing per row
 * - Supports deletion of campaigns
 * - Automatically refreshes data after edit/delete
 * - Includes pagination and inline editing functionality.
 */

const CampaignTable = () => {
  const { getCampaigns, updateCampaign, deleteCampaign } = useContext(CrowdFundingContext);
  const [campaigns, setCampaigns] = useState([]);                   // Full campaign data
  const [editIndex, setEditIndex] = useState(null);                 // Currently edited row index (page-level)
  const [editedCampaign, setEditedCampaign] = useState({});         // Edited campaign data

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);                // Current page number
  const itemsPerPage = 7;                                           // Max campaigns per page

  // Fetch campaign data from blockchain
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCampaigns();
      setCampaigns(data);
    };
    fetchData();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = campaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  // Go to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Go to previous page
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Begin editing a campaign row
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedCampaign({ ...currentItems[index] });
  };

  // Submit updated campaign to contract
  const handleSave = async () => {
    try {
      const { title, description, target, pId } = editedCampaign;
      await updateCampaign(pId, title, description, target);
      const refreshed = await getCampaigns(); // Refresh table after edit
      setCampaigns(refreshed);
      setEditIndex(null);                    // Exit edit mode
    } catch (err) {
      console.error("Failed to update campaign:", err);
    }
  };

  // Delete campaign from blockchain
  const handleDelete = async (index) => {
    try {
      const campaignToDelete = currentItems[index];
      await deleteCampaign(campaignToDelete.pId);
      const refreshed = await getCampaigns(); // Refresh table
      setCampaigns(refreshed);
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  // Update form input for a specific field
  const handleChange = (e, field) => {
    setEditedCampaign({
      ...editedCampaign,
      [field]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10 overflow-x-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaign Table</h3>

      {/* Table UI */}
      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Target (ETH)</th>
            <th className="px-4 py-2">Raised</th>
            <th className="px-4 py-2">Deadline</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((c, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{indexOfFirstItem + index + 1}</td>

              {/* Title Field (editable) */}
              <td className="px-4 py-2">
                {editIndex === index ? (
                  <input
                    value={editedCampaign.title}
                    onChange={(e) => handleChange(e, "title")}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  c.title
                )}
              </td>

              {/* Description Field (editable) */}
              <td className="px-4 py-2">
                {editIndex === index ? (
                  <input
                    value={editedCampaign.description}
                    onChange={(e) => handleChange(e, "description")}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  c.description
                )}
              </td>

              {/* Target Field (editable) */}
              <td className="px-4 py-2">
                {editIndex === index ? (
                  <input
                    value={editedCampaign.target}
                    onChange={(e) => handleChange(e, "target")}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  `${parseFloat(c.target).toFixed(2)}`
                )}
              </td>

              {/* Amount Raised (read-only) */}
              <td className="px-4 py-2">{parseFloat(c.amountCollected).toFixed(2)}</td>

              {/* Deadline Display */}
              <td className="px-4 py-2">
                {new Date(Number(c.deadline)).toLocaleDateString("en-GB")}
              </td>

              {/* Action Buttons */}
              <td className="px-4 py-2 space-x-2">
                {editIndex === index ? (
                  <>
                    <button onClick={handleSave} className="text-green-600 font-medium">
                      Save
                    </button>
                    <button onClick={() => setEditIndex(null)} className="text-gray-500">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls (Always visible now) */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded-md border ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CampaignTable;
