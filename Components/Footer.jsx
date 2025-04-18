import React from "react";
import Link from "next/link";

const Footer = () => {
  const productList = ["Market", "ERC20 Token", "Donation"];

  const contactList = [
    { label: "81-83 Duckett Street, E1 4TD", link: null },
    { label: "020-7265-8603", link: null },
    { label: "info@yourmosque.org.uk", link: "mailto:info@yourmosque.org.uk" },
    { label: "Contact Us", link: "/contact" },
  ];

  const usefulLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Donation", path: "/donation" },
    { name: "Contact", path: "/contact" },
    { name: "Education", path: "/education" },
  ];

  return (
    <footer className="text-center text-white bg-green-700 lg:text-left">
      <div className="px-6 py-10 text-center md:text-left">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Mosque
            </h6>
            <p>
              The London Borough of Tower Hamlets is home to a dense Muslim
              population, Stepney Green. Before 1980, local Muslims did not
              have a Masjid where they could come together for daily prayers or
              to run Islamic activities.
            </p>
          </div>

          {/* Products */}
          <div className="pl-6 md:pl-10">
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Products
            </h6>
            {productList.map((el, i) => (
              <p className="mb-4" key={i}>
                <span className="cursor-pointer">{el}</span>
              </p>
            ))}
          </div>

          {/* Useful Links */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Useful Links
            </h6>
            {usefulLinks.map((link, i) => (
              <p className="mb-4" key={i}>
                <Link href={link.path} className="hover:underline">
                  {link.name}
                </Link>
              </p>
            ))}
          </div>

          {/* Contact Info */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            {contactList.map((item, i) => (
              <p className="mb-4" key={i}>
                {item.link ? (
                  <Link href={item.link} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="bg-green-800 p-6 text-center text-white">
        <span>@ 2025 Copyright: </span>
        <a className="font-semibold hover:underline" href="/">
           Mosque
        </a>
      </div>
    </footer>
  );
};

export default Footer;
