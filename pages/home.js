// Import React core library
import React from "react";

// Import the Home component which serves as the main landing content
// Located under the AboutPage folder (could be refactored to a more global directory later)
import Home from "@/components/AboutPage/Home";

/**
 * HomePage Component
 *
 * This is the main entry point for the `/home` route.
 * It renders the <Home /> component which serves as the landing page
 * and wraps it with a container that ensures consistent background and text styling.
 *
 * Features:
 * - Displays a welcoming hero section
 * - Highlights mosque objectives and purpose
 * - Embeds a promotional or informational video
 */

export default function HomePage() {
  return (
    <div className="relative bg-white text-gray-800">
      <Home />
    </div>
  );
}
