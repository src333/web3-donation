import React from "react" ;

/**
* Menu Component
* Renders a hamburger menu icon used typically for toggling navigation on mobile.
*
* Accessibility:
* - Includes role and title for screen readers.
*/

/**
* Menu Component
*
*  Adapted from: Daulat Hussain’s Web3.0 Crowdfunding Tutorial
* https://www.youtube.com/watch?v=AcXVKkYnu1c
*
*  Enhancements by Sahar Choudhury:
* - Included descriptive JSDoc block for clarity
*/


const Menu = () => {
  return (
   <svg className="w-5 text-white" viewBox="0 0 24 24">
        <path
            fill="currentColor"
            d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
        />
        <path
            fill="currentColor"
            d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
        />
        <path
            fill="currentColor"
            d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
        />
   </svg>
  ); 
};

export default Menu;