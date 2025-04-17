import React from "react";

export default function InfoCard({ children, className = "" }) {
  return (
    <div className={`p-6 bg-white shadow-lg rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
