import React from "react";

/**
 * Card Component
 * Displays a grid of campaign cards.
 * Each card shows title, description, target, amount raised, and remaining days.
 * Clicking a card triggers the donation modal.
 *
 * Props:
 * - allcampaign: array of campaign objects
 * - setOpenModel: function to control donation popup visibility
 * - setDonate: function to set selected campaign for donation
 * - titleData: heading text shown above the cards
 */

const Card = ({ allcampaign, setOpenModel, setDonate, titleData }) => {
  // Utility to calculate days left until the deadline
  const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays.toFixed(0);
  };

  return (
    // Outer section wrapping the entire card area, including a section heading and a responsive grid
    <section
      className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"
      aria-labelledby="campaign-section"
    >
      {/* Section Title */}
      <h2
        id="campaign-section"
        className="py-16 text-2xl font-bold leading-5 text-gray-900"
      >
        {titleData} {/* Dynamic heading passed as prop */}
      </h2>

      {/* Card Grid */}
      <div className="grid gap-5 lg:grid-cols-3 sm:max-w-sm ms:mx-auto lg:max-w-full">
         {/* Loop through all campaigns passed from props */}
        {allcampaign?.map((campaign, i) => (
          <article
            onClick={() => {
              setDonate(campaign);  // Set the clicked campaign as the active one for donation
              setOpenModel(true);   // Open the donation modal
            }}
            key={i}
            className="cursor-pointer border overflow-hidden transition-shadow duration-300 bg-white rounded"
            role="button"           // Mark this <article> semantically as a clickable element
            tabIndex={0}            // Makes the card focusable with keyboard navigation
            onKeyDown={(e) => e.key === "Enter" && setOpenModel(true)}  // Allow Enter key to trigger modal
            aria-label={`Donate to campaign: ${campaign.title}`}        // Accessibility screen reader label
          >

             {/* Campaign Image */}
            <img
              src="https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;w=1260"
              alt={`${campaign.title} campaign image`}
              className="object-cover w-full h-64 rounded"
            />

             {/* Card Content Container */}
            <div className="py-5 pl-2">
              <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                Days Left: {daysLeft(campaign.deadline)}
              </p>

              {/* Campaign Title */}
              <h3 className="text-2xl font-bold leading-5 text-black mb-3">
                {campaign.title}
              </h3>

              {/* Campaign Description */}
              <p className="mb-4 text-gray-700">{campaign.description}</p>
              
               {/* Target and Amount Raised Stats */}
              <div className="flex space-x-4 text-sm">
                <p className="font-semibold text-gray-800">
                  Target: {campaign.target} ETH
                </p>
                <p className="font-semibold text-gray-800">
                  Raised: {campaign.amountCollected} ETH
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Card;
