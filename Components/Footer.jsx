import React from "react";
import Link from "next/link";

/**
* Footer Component
* 
* Displays contact details, navigation links, product placeholders, 
* and a brief description of the mosque. 
* Structured to support screen readers and keyboard navigation through proper layout.
*/


/**
* Footer Component
* 
* Adapted from: Daulat Hussain’s Web3.0 Crowdfunding Tutorial
* https://www.youtube.com/watch?v=AcXVKkYnu1c
* 
*  Enhancements by Sahar Choudhury:
* - Replaced placeholder content with real mosque address, phone, and email
* - Integrated Next.js <Link> for proper client-side navigation
* - Added aria attributes and semantic html for accessibility (e.g., <address>, role, aria-labelledby)
* - Introduced scalable data structures for useful links and contact info
* - Switched from hardcoded anchors to proper routing and accessible design patterns
* - Improved colour consistency and structure with Tailwind
* 
* Original structure retained for inspiration; logic and UI restructured for production-readiness.
*/

const Footer = () => {
  // Placeholder product list - intended to be replaced with dynamic marketplace features
  const productList = ["Market", "ERC20 Token", "Donation"];

   // List of contact details - includes static address, phone, and email link
  const contactList = [
    { label: "81-83 Duckett Street, E1 4TD", link: null },
    { label: "020-7265-8603", link: "tel:02072658603" },
    { label: "info@yourmosque.org.uk", link: "mailto:info@yourmosque.org.uk" },
    { label: "Contact Us", link: "/contact" },
  ];

  // Site navigation links for key pages
  const usefulLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Donation", path: "/donation" },
    { name: "Contact", path: "/contact" },
    { name: "Education", path: "/education" },
  ];

  return (
    <footer className="bg-green-700 text-white">
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" role="contentinfo">

          {/* About Section - Brief intro about mosque's historical background */}
          <section aria-labelledby="footer-about">
            <h2 id="footer-about" className="text-lg font-semibold uppercase mb-4">
              About the Mosque
            </h2>
            <p className="text-sm leading-relaxed">
              Located in the heart of Tower Hamlets, Stepney Shahjalal Mosque has served
              the community since 1985, offering prayer, education, and social services.
            </p>
          </section>

          {/* Product Links - Currently static placeholders; will later link to actual offerings */}
          <section aria-labelledby="footer-products">
            <h2 id="footer-products" className="text-lg font-semibold uppercase mb-4">
              Products
            </h2>
            <ul className="space-y-2">
              {productList.map((el, i) => (
                <li key={i}>
                  <button className="hover:underline text-sm" aria-label={`Learn more about ${el}`}>
                    {el}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Useful Links - In-page navigation for core sections of the site */}
          <section aria-labelledby="footer-links">
            <h2 id="footer-links" className="text-lg font-semibold uppercase mb-4">
              Useful Links
            </h2>
            <ul className="space-y-2">
              {usefulLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="hover:underline text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

           {/* Contact Info - Static and accessible contact information for the mosque */}
          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="text-lg font-semibold uppercase mb-4">
              Contact
            </h2>
            <address className="not-italic text-sm space-y-2">
              {contactList.map((item, i) => (
                <div key={i}>
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="hover:underline"
                      aria-label={`Contact via ${item.label}`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              ))}
            </address>
          </section>
        </div>
      </div>

      {/* Bottom copyright strip - includes attribution and year */}
      <div className="bg-green-800 p-6 text-center text-white text-sm">
        <span>&copy; 2025 Sahar Mosque. </span>
        <Link href="/" className="font-semibold hover:underline">
          Back to Home
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
