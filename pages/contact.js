// Import React (required for functional component definitions)
import React from "react";

// Import the actual Contact page content component from the components folder
import Contact from "@/Components/AboutPage/Contact";


/**
 * ContactPage Component
 *
 * This route file maps to the '/contact' URL in your Next.js app.
 * It simply wraps and renders the 'Contact' component from your Components folder.
 *
 * Keeping route files clean and offloading content/UI logic to components ensures
 * scalability and better separation of concerns.
 * The actual UI and logic for the Cotact page is encapsulated in `components/AboutPage/Contact.jsx`.
 */
const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
