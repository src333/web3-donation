import React from "react";

const Logo = ({ color = "text-white" }) => {
  return (
    <svg
      className={`w-8 h-8 ${color}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dome */}
      <path
        d="M32 8C22 8 14 16 14 26H50C50 16 42 8 32 8Z"
        fill="currentColor"
      />

      {/* Rectangular mosque base */}
      <rect
        x="8"
        y="26"
        width="48"
        height="28"
        rx="2"
        fill="currentColor"
      />

      {/* Left Minaret */}
      <rect
        x="2"
        y="18"
        width="4"
        height="36"
        rx="1"
        fill="currentColor"
      />

      {/* Right Minaret */}
      <rect
        x="58"
        y="18"
        width="4"
        height="36"
        rx="1"
        fill="currentColor"
      />
    </svg>
  );
};

export default Logo;
