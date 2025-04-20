// Import React core library
import React from "react";

// Import the Education component from the AboutPage folder
// This component provides educational guidance on how to use the donation platform
import Education from "../Components/AboutPage/Education";



/**
 * Education Route
 *
 * This file defines the route for `/education`.
 * It serves as a standalone page component rendered when a user navigates to that route.
 * 
 * Responsibilities:
 * - Mounts the Education component (which contains onboarding steps, FAQs, and crypto donation education)
 */
const EducationRoute = () => {
  return <Education />;
};

export default EducationRoute;
