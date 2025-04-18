import React, {useState , useContext} from "react" ;
import Logo from "./Logo"; 
import Menu from "./Menu"; 
import { CrowdFundingContext } from "../Context/CrowdFunding";

const NavBar = () => {
  const {currentAccount ,connectWallet , isAdmin} = useContext(CrowdFundingContext);
  const [isMenuOpen , setIsMenuOpen] = useState(false);
  //const menuList = ["white paper", "project","donation","members"];
  const baseMenuList = ["Home", "About", "Donation", "Contact" , "Education"];
  const menuList = isAdmin ? [...baseMenuList, "dashboard"] : baseMenuList;
  return (
   <div className="bg-green-700">
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
          <div className="relative flex items-center justify-between">
              <div className="flex items-center">
                <a
                  href="/"
                  aria-label="Company"
                  title="Company"
                  className="inline-flex items-centre mr-8"
                >
                  <Logo color="text-white"/>
                  <span className="ml-3 text-xl font-bold tracking-wide text-gray-100 uppercase">
                     Mosque
                  </span>
                </a>
                <ul className="flex items-center hidden space-x-8 lg:flex">
                  {menuList.map((el , i) => (
                    <li key={i+1}>
                      <a
                        href={`/${el.toLowerCase().replace(/\s+/g, "-")}`} // e.g., "Admin Dashboard" → "/admin-dashboard"
                        aria-label={el}
                        title={el}
                        className="font-medium tracking-wide text-white transition-colors duration-200 hover:text-teal-accent-400"
                      >
                        {el}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="flex items-center hidden space-x-8 lg:flex">
                <li>
                  {currentAccount ? (
                    <p className="text-white font-semibold flex items-center gap-2">
                      <span>
                        Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                      </span>
                      {isAdmin && (
                        <span className="bg-green-950 text-white text-xs px-2 py-1 rounded-md font-bold tracking-wide">
                          Admin Account
                        </span>
                      )}
                    </p>
                  ) : (
                    <button
                      onClick={() => connectWallet()}
                      className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white 
                      bg-green-950 hover:bg-green-900 active:scale-95 transition-all duration-200 ease-in-out 
                      rounded shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-white-500"
                      aria-label="Connect Wallet"
                      title="Connect Wallet"
                    >
                      Connect Wallet
                    </button>
                  )}
                </li>
              </ul>

              <div className="lg:hidden z-40">
                <button
                  aria-label="Open Menu"
                  title="Open Menu"
                  className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline"
                  onClick={()=> setIsMenuOpen(true)}
                >
                  <Menu />
                </button>
                {isMenuOpen && (
                  <div className="absolute top-0 left-0 w-full">
                    <div className="p-5 bg-white border rounded shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                        <a
                          href="/"
                          aria-label="Company"
                          title="Company"
                          className="inline-flex item-center"
                        >
                          <Logo color="text-black"/>
                          <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
                            Company
                          </span>
                        </a>
                      </div>
                      <div>
                        <button
                          aria-label="Close Menu"
                          title="Close Menu"
                          className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 
                          focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 text-gray-600" viewBox="0 0 24 24">
                            <path 
                              fill="currentColor"
                              d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4
                              ,0s-0.4,1,0,1.416.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,
                              20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-
                              0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <nav>
                      <ul className="space-y-4">
                        {menuList.map((el ,i) => (
                          <li key={i + 1}>
                            <a
                              href={`/${el.toLowerCase().replace(/\s+/g, "-")}`} // same logic as desktop
                              aria-label={el}
                              title={el}
                              className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
                            >
                              {el}
                            </a>
                          </li>
                        ))}                       
                        <li>
                          {currentAccount ? (
                            <div className="flex flex-col gap-2 items-start text-sm text-gray-800">
                              <span className="font-semibold">
                                Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                              </span>
                              {isAdmin && (
                                <span className="bg-purple-700 text-black px-2 py-1 rounded-md text-xs font-semibold">
                                  Admin Account
                                </span>
                              )}
                            </div>
                          ) : (
                            <button 
                              onClick={connectWallet}
                              className="inline-flex items-center justify-center w-full h-12 px-6 font-medium
                                tracking-wide text-white transition duration-200 rounded shadow-md bg-purple-600 
                                hover:bg-purple-700 focus:shadow-outline focus:outline-none"
                            >
                              Connect Wallet
                            </button>
                          )}
                        </li>

                      </ul>
                    </nav>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

  );
};

export default NavBar;