import React from "react";

/**
 * InfoCard Component
 * 
 * A lightweight reusable wrapper that provides consistent styling 
 * for boxed content areas (e.g., on the About page or other information sections).
 * 
 * Props:
 * - children: The content passed inside the card (e.g., headings, text, etc.)
 * - className: Optional additional Tailwind classes to customize spacing/layout from the parent
 */

export default function InfoCard({ children, className = "" }) {
  return (
     // Merge base styling with optional class overrides
    <div className={`p-6 bg-white shadow-lg rounded-2xl ${className}`}>
      {children} {/* Render any inner content passed between <InfoCard>...</InfoCard> */}
    </div>
  );
}
