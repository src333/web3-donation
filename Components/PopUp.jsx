import React ,{useState , useEffect}from 'react'

/**
 * PopUp Component
 * Displays a modal for donating to a selected campaign.
 *
 * Props:
 * - setOpenModel: function to close the modal
 * - donate: selected campaign object
 * - donateFunction: function to handle donation logic (from context)
 * - getDonations: function to fetch all donations for a campaign
 */

const PopUp = ({setOpenModel , donate , donateFunction , getDonations}) => {
    // Holds the amount input by the user for the donation
    const [amount, setAmount] = useState("");
    // List of all donations for this campaign
    const [allDonationData, setallDonationData] = useState();
    // Trigger donation process
    const createDonation = async () => {
        try{
            const data = await donateFunction(donate.pId, amount); // pass campaign id and ETH value
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    /*useEffect(() => {
        const donationsListData = getDonations(donate.pId);
        return async () => {
            const donationData = await donationsListData;
            setallDonationData(donationData);
        };
    }, []);*/ 

    // Fetch donation history for this campaign when campaign changes
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const donationData = await getDonations(donate.pId);
                setallDonationData(donationData);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };
    
        fetchDonations();
    }, [donate.pId]); // Updates if user switches between campaigns
    

    return (
        <>
          {/*  Overlay Modal Container  */}
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-popup-title"
          >
            {/*  Modal Content Wrapper  */}
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/* Main White Box Content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
    
                {/*  Header  */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold" id="donation-popup-title">
                    Title: {donate.title}
                  </h3>
    
                  {/* Close Button via an (X icon) implementation */}
                  <button
                    className="p-1 ml-auto text-black text-3xl leading-none font-semibold"
                    onClick={() => setOpenModel(false)}
                    aria-label="Close Donation Popup"
                  >
                    <span className="h-6 w-6 text-2xl block">×</span>
                  </button>
                </div>
    
                {/*  Body (Donation input + info)  */}
                <div className="relative p-6 flex-auto">
                  {/* Campaign Description */}
                  <p className="my-4 text-slate-900 text-lg leading-relaxed">
                    Description: {donate.description}
                  </p>
    
                  {/* Amount Input Field */}
                  <input
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter donation amount in ETH"
                    required
                    type="text"
                    className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm 
                      appearance-none focus:border-green-500 focus:outline-none focus:shadow-outline"
                    id="donation-amount"
                    name="donation-amount"
                    aria-label="Donation Amount"
                  />
    
                  {/* Donation History if its available */}
                  {allDonationData?.map((donate, i) => (
                    <p
                      key={i}
                      className="my-4 text-slate-700 text-lg leading-relaxed"
                    >
                      {i + 1}: {donate.donation} ETH —{" "}
                      <span className="text-sm text-gray-500">
                        {donate.donator.slice(0, 43)}
                      </span>
                    </p>
                  ))}
                </div>
    
                {/*  Footer Buttons  */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  {/* Close Button */}
                  <button
                    className="text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none 
                      mr-1 mb-1 transition-all duration-150 cursor-pointer"
                    type="button"
                    onClick={() => setOpenModel(false)}
                  >
                    Close
                  </button>
    
                  {/* Donate Button */}
                  <button
                    className="text-white bg-green-700 hover:bg-green-800 font-bold uppercase text-sm px-6 py-3 rounded shadow 
                      hover:shadow-lg transition-all duration-150 cursor-pointer"
                    type="button"
                    onClick={createDonation}
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          </div>
    
          {/*  Modal Background Overlay  */}
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            aria-hidden="true"
          ></div>
        </>
      );
    };
    
    export default PopUp;
    