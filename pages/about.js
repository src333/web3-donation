// Import React (required for functional component definitions)
import React from "react";

// Import the actual About page content component from the components folder
import About from "../components/AboutPage/About";


/**
 * AboutRoute Component
 *
 * This acts as the top-level route page for '/about'
 * Next.js uses the filename `about.js` to map to the '/about' URL.
 * 
 * The actual UI and logic for the About page is encapsulated in `components/AboutPage/About.jsx`.
 */
export default function AboutRoute() {
  return <About />;
}
