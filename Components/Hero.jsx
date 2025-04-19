//import React, {useState} from 'react'
//import { useContext } from "react"; // remove 
import React, { useContext, useState } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding"; // remove 


/**
 * Hero Component
 *
 * Displays the landing section of the homepage with a banner and conditional form.
 * If the user is an admin, they can create a new campaign using the form.
 *
 * Props:
 * - titleData (unused): potentially for future dynamic headings
 * - createCampaign (function): async handler to submit new campaign data
 */
const Hero = ({titleData , createCampaign}) => {
    const { isAdmin } = useContext(CrowdFundingContext); // Admin check for conditional rendering
     // Form state for creating a new campaign
    const [campaign , setCampaign] = useState ({
        title: "",
        description: "",
        amount: "",
        deadline: "",
    });

    /**
    * Handles form submission to create a campaign.
    * Calls the passed `createCampaign` prop function.
    */
    const createNewCampaign = async (e) => {
        e.preventDefault();
        try{
            const data = await createCampaign(campaign);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative">
             {/* Background Overlay Image */}
            <span className="coverLine"></span>
            <img 
                src="https://images.pexels.com/photos/3228766/pexels-photo-3228766.jpeg?auto=compress&amp;cs=tinysrbg&amp;dpr=2&amp;h=750&amp;w=1260"
                className='absolute inset-0 object-cover w-full h-full'
                alt=""
            />
            {/* Overlay and content container */}
            <div className="relative bg-opacity-75 bg-green-700">
                {/* Decorative wave for visual flair */}
                <svg 
                    className="absolute inset-x-0 bottom-0 text-white"
                    viewBox="0 0 1160 163"
                >
                    <path
                        fill="currentColor"
                        d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276
                        13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 
                        -104 162.5H-164V13Z" 
                    />
                </svg>

                {/* Content Layout */}
                <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                    <div className="flex flex-col items-center justify-between xl:flex-row">
                        {/* Hero Text Block */}
                        <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
                            <h2 className=" max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-none">
                                Crypto Mosque <br className="hidden md:block"/>
                                Crowd Funding CK
                            </h2>
                            <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
                                sed ut perspiciatis unde iste natus error sit voluptatem accusantium doloremque laudan, totam aperiam, eaque ipsa quae.
                            </p>
                            <a 
                                href="/"
                                aria-label=""
                                className="inline-flex items-center font-semibold tracking-wider transition-colors duration-200 text-teal-accent-400 hover:text-teal-accent-700 text-gray-200">
                                Learn more
                                <svg
                                    className="inline-block w-3 ml-2"
                                    fill="currentColor"
                                    viewBox="0 0 12 12"
                                >
                                    <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                                </svg>
                            </a>
                        </div>
                            {/* Conditional Admin Form or Restricted Notice which includes fields a campaign title , description input , target amount to raise funds for , a deadline input field*/}
                            <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
                            {isAdmin ? (
                                <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                                    <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
                                        Campaign
                                    </h3>
                                    <form>
                                        {/* Campaign Title Input */}
                                        <div className="mb-1 sm:mb-2">
                                            <label 
                                                htmlFor="firstName"
                                                className="inline-block mb-1 font-medium"
                                            >
                                                Title
                                            </label>
                                            <input 
                                                onChange={(e) =>
                                                    setCampaign({
                                                        ...campaign,
                                                        title: e.target.value,
                                                    })
                                                }
                                                placeholder="title"
                                                required
                                                type="text"
                                                className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 
                                                rounded shadow-sm appearance-none focus:border-deep-green-accent-800 focus:outline-none focus:shadow-outline"
                                                id="firstName"
                                                name="firstName"
                                            />
                                        </div>

                                        {/* Description Input */}
                                        <div className="mb-1 sm:mb-2">
                                            <label 
                                                htmlFor="lastName"
                                                className="inline-block mb-1 font-medium"
                                            >
                                                Description
                                            </label>
                                            <input 
                                                onChange={(e) =>
                                                    setCampaign({
                                                        ...campaign,
                                                        description: e.target.value,
                                                    })
                                                }
                                                placeholder="description"
                                                required
                                                type="text"
                                                className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 
                                                rounded shadow-sm appearance-none focus:border-deep-green-accent-800 focus:outline-none focus:shadow-outline"
                                                id="lastName"
                                                name="lastName"
                                            />
                                        </div>

                                        {/* Target Amount Input */}
                                        <div className="mb-1 sm:mb-2">
                                            <label 
                                                htmlFor="email"
                                                className="inline-block mb-1 font-medium"
                                            >
                                                Target Amount
                                            </label>
                                            <input 
                                                onChange={(e) =>
                                                    setCampaign({
                                                        ...campaign,
                                                        amount: e.target.value,
                                                    })
                                                }
                                                placeholder="amount"
                                                required
                                                type="text"
                                                className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 
                                                rounded shadow-sm appearance-none focus:border-deep-green-accent-800 focus:outline-none focus:shadow-outline"
                                                id="email"
                                                name="email"
                                            />
                                        </div>

                                        {/* Deadline Input */}
                                        <div className="mb-1 sm:mb-2">
                                            <label 
                                                htmlFor="email"
                                                className="inline-block mb-1 font-medium"
                                            >
                                                Deadline 
                                            </label>
                                            <input 
                                                onChange={(e) =>
                                                    setCampaign({
                                                        ...campaign,
                                                        deadline: e.target.value,
                                                    })
                                                }
                                                placeholder="Date"
                                                required
                                                type="date"
                                                className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 
                                                rounded shadow-sm appearance-none focus:border-deep-green-accent-800 focus:outline-none focus:shadow-outline"
                                                id="email"
                                                name="email"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div>
                                            <button 
                                                onClick={(e) => createNewCampaign(e)}
                                                type="submit"
                                                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide 
                                                 text-white transition duration-200 rounded shadow-md bg-green-700 
                                                hover:bg-green-900 focus:shadow-outline focus:outline-none cursor-pointer"
                                            >
                                                Create Campaign 
                                            </button>
                                        </div>
                                        <p>
                                            .
                                        </p>
                                        <p className="text-xs text-gray-800 sm:text-sm text-center">
                                            Create your campaign to raise funds 
                                        </p>
                                    </form>
                                    {/* displays restricted access UI if user isnt an admin instead of the campaign creation form */}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 text-center max-w-sm sm:max-w-md mx-auto">
                                    <h3 className="mb-3 text-lg sm:text-xl font-bold text-red-600 flex items-center justify-center gap-2">
                                        <span>Restricted Access</span> <span>🚫</span>
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        You must be an admin to create campaigns.<br />
                                        If you think this is a mistake, please contact the project owner.
                                    </p>
                                </div>

                                )}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;