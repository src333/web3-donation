import React from "react" ;

const Footer = () => {
  const productList = ["market", "ERC20 Token", "Donation"];
  const contactList = [
    "support@cryptoking.com",
    "info@example.com", 
    "Contact Us" ,
  ];
  const usefullLink = ["Home","About Us","Company Bio"];
  return (
    <footer className="text-center text-white backgroundMain lg:text-left">
      <div className="px-6 py-10 text-center md:text-left">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Crypto King 
            </h6>
            <p>
              Here you can use rows and colums to organise your footer content. 
              Ideally later ill write about the mosque in this footer section.
            </p>
          </div>
          <div className="pl-6 md:pl-10">
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Products
            </h6>
            {productList.map((el ,i) => (
              <p className="mb-4" key={i+1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
          <div className="">
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Useful Links
            </h6>
            {usefullLink.map((el , i) => (
              <p className="mb-4" key={i+1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
          <div className="">
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            {contactList.map((el , i)=> (
              <p className="mb-4" key={i+1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="backgroundMain p-6 text-center">
        <span>@ 2025 Copyright: </span>
        <a className="front-semibold" href="https://tailwind-elements.com/">
        Crypto Mosque 
        </a>
      </div>
    </footer>
  ); 
};

export default Footer;