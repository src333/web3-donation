// Global stylesheet import (Tailwind CSS, custom global styles)
import "@/styles/globals.css";

// Import shared components that appear across all pages
import { NavBar,Footer } from "../Components";

// Import context provider for managing global blockchain interactions
import {CrowdFundingProvider} from "../Context/CrowdFunding";

/**
 * App Component (Root Layout Wrapper)
 *
 * This is the main entry point for the Next.js application.
 * It wraps all page components with:
 * - Global state/context providers
 * - Persistent layout components (e.g., NavBar, Footer)
 *
 * @param {object} props - Props automatically passed by Next.js
 * @param {Component} props.Component - The active page component being rendered
 * @param {object} props.pageProps - Any initial props preloaded via getStaticProps/getServerSideProps
 */
export default function App({ Component, pageProps }) {
  return (
    <>
     {/* Provide the CrowdFunding context to the entire app */}
      <CrowdFundingProvider>

        {/* Persistent site navigation */}
        <NavBar/>

         {/* Render the current page's content */}
        <Component {...pageProps} />
        
        {/* Persistent footer element */}
        <Footer/>
      </CrowdFundingProvider>
    </>

  );
}
