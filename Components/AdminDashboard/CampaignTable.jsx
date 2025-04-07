import React, { useEffect, useState, useContext } from "react";
import { CrowdFundingContext } from "../../Context/CrowdFunding";

const CampaignTable = () => {
  const { getCampaigns, updateCampaign, deleteCampaign } = useContext(CrowdFundingContext);
  const [campaigns, setCampaigns] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedCampaign, setEditedCampaign] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCampaigns();
      setCampaigns(data);
    };
    fetchData();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedCampaign({ ...campaigns[index] });
  };

  const handleSave = async () => {
    try {
      const { title, description, target, pId } = editedCampaign;
      await updateCampaign(pId, title, description, target);
      const refreshed = await getCampaigns();
      setCampaigns(refreshed);
      setEditIndex(null);
    } catch (err) {
      console.error("Failed to update campaign:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const campaignToDelete = campaigns[index];
      await deleteCampaign(campaignToDelete.pId);
      const refreshed = await getCampaigns();
      setCampaigns(refreshed);
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  const handleChange = (e, field) => {
    setEditedCampaign({
      ...editedCampaign,
      [field]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10 overflow-x-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaign Table</h3>
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
          {campaigns.map((c, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
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
              <td className="px-4 py-2">{parseFloat(c.amountCollected).toFixed(2)}</td>
              <td className="px-4 py-2">
                {new Date(Number(c.deadline)).toLocaleDateString("en-GB")}
              </td>
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
    </div>
  );
};

export default CampaignTable;
