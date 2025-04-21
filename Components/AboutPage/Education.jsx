// Components/AboutPage/Education.jsx
import React from "react";

/**
 * Education Page
 *
 * A comprehensive step-by-step guide explaining:
 * - What crypto donations are
 * - How to use the donation platform
 * - Visual steps for onboarding
 * - Video walkthrough and FAQs
 */

// List of interactive steps for user onboarding
const steps = [
  {
    step: "Step 1",
    title: "Connect Your Wallet",
    description:
      "To begin, you'll need to connect a crypto wallet like MetaMask. This is your digital identity for interacting with the blockchain. A popup will appear asking for permission. Make sure to connect the correct wallet, especially if you're using multiple ones.",
    screenshot: "/images/education/step1_connect_wallet.png",
  },
  {
    step: "Step 2",
    title: "Explore Active Campaigns",
    description:
      "After connecting your wallet, scroll through the live campaigns. Each card shows a title, description, amount raised, and time left. Click on any campaign card to learn more or make a donation.",
    screenshot: "/images/education/step2_browse_campaigns.png",
  },
  {
    step: "Step 3",
    title: "Donate to a Campaign",
    description:
      "Once you've picked a campaign, click on it to open the popup. Type in the amount of ETH you’d like to donate, then confirm the transaction in your wallet. Your donation goes directly to the campaign creator’s wallet.",
    screenshot: "/images/education/step3_donate.png",
  },
  {
    step: "Step 4",
    title: "Track Campaign Progress",
    description:
      "You can view the total funds raised and how many days are left for each campaign. Admins can also view donation histories. This ensures transparency for everyone involved.",
    screenshot: "/images/education/step4_track_progress.png",
  },
  {
    step: "Step 5",
    title: "Create a Campaign (Admin Only)",
    description:
      "Admins can fill out a form to create new campaigns. Title, description, funding goal, and deadline are required. Once submitted, the campaign is instantly live on the blockchain.",
    screenshot: "/images/education/step5_create_campaign.png",
  },
];

const Education = () => {
  return (
    <div className="bg-white text-gray-900">
        <div className="relative bg-green-700 text-white py-16 text-center">
        {/* SVG wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 text-white"
          viewBox="0 0 1160 163"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 
            1216 7.7L1276 13V163H1216C1156 163 1036 163 916 163C796 163 676 163 556 163C436 163 316 163 196 163C76 163 
            -44 163 -104 163H-164V13Z"
          />
        </svg>
      </div>
      {/* Page Introduction */}
      <section className="px-4 py-10 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-green-800 mb-2">
            Learn About Crypto Giving
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about blockchain donations and how to get started.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Section 1: What is Crypto Giving */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">What is Crypto Giving?</h2>
            <p className="text-gray-700 leading-relaxed">
              Crypto giving is the act of donating cryptocurrency to support causes. It works similarly to regular online donations,
              except the assets are sent using blockchain technology. This ensures faster, more secure transactions, and provides transparency for all stakeholders.
            </p>
          </div>

          {/* Section 2: How to Use the Platform */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">How to Use Our Platform</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Install MetaMask or a compatible crypto wallet.</li>
              <li>Connect your wallet using our "Connect Wallet" button.</li>
              <li>Browse campaigns and select one you’d like to support.</li>
              <li>Enter your donation amount and confirm the transaction.</li>
              <li>See your donation appear in the donation history instantly.</li>
            </ol>
          </div>

          {/* Section 3: Benefits */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Benefits of Crypto Donations</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Instant transaction confirmations</li>
              <li>Lower processing fees than traditional systems</li>
              <li>Donor anonymity, if desired</li>
              <li>Decentralised and secure systems</li>
              <li>Trackable donation transparency</li>
            </ul>
          </div>

          {/* Section 4: Video Tutorial */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Watch a Quick Walkthrough</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/TODO"
                title="Crypto Giving Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Step-by-step Visual Guide */}
        <div className="mt-24 space-y-16 ">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center ">Step-by-Step Visual Guide</h2>
          {steps.map((item, index) => (
            <div key={index} className="grid lg:grid-cols-2 gap-10 items-center p-6 bg-gray-50 rounded-xl shadow-md">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-green-700">{item.step}: {item.title}</h3>
                <p className="text-gray-700 text-lg">{item.description}</p>
              </div>
              <div>
                {/* TODO: Replace this screenshot with your actual image */}
                <img
                  src={item.screenshot}
                  alt={`${item.title} screenshot`}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          ))}
        </div>

        {/* FAQ sections */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Question 1 */}
            <div className="p-5 bg-gray-100 rounded shadow">
              <h3 className="font-semibold text-lg text-gray-800">Do I need to understand blockchain to donate?</h3>
              <p className="text-gray-600">No, our platform is designed to be easy for everyone, regardless of experience level. Just follow the steps above.</p>
            </div>
            {/* Question 2 */}
            <div className="p-5 bg-gray-100 rounded shadow">
              <h3 className="font-semibold text-lg text-gray-800">Is it safe to use my crypto wallet here?</h3>
              <p className="text-gray-600">Yes. We use decentralised smart contracts to ensure security. You control your funds at all times.</p>
            </div>
            {/* Question 3 */}
            <div className="p-5 bg-gray-100 rounded shadow">
              <h3 className="font-semibold text-lg text-gray-800">Can I see who donated to a campaign?</h3>
              <p className="text-gray-600">Yes. Donations are public and can be viewed transparently on each campaign.</p>
            </div>
          </div>
        </div>
        
        {/* Ledger Education Section */}
        <div className="mt-24 space-y-8">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">
            How to Read the Donation Ledger
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Date & Time */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-green-700 mb-2"> Date & Time</h3>
              <p className="text-gray-700">
                Each row in the ledger includes the exact date and time the donation was made, pulled directly from the blockchain timestamp.
              </p>
            </div>

            {/* From / To */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-green-700 mb-2"> From / To</h3>
              <p className="text-gray-700">
                The donor's wallet address (From) and the campaign owner's address (To) are shown. These are pseudonymous but verifiable through tools like Etherscan.
              </p>
            </div>

            {/* Campaign Info */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-green-700 mb-2"> Campaign Title / ID</h3>
              <p className="text-gray-700">
                Indicates which campaign the donation went to. IDs are unique and mapped on-chain, while titles help human readers identify the cause.
              </p>
            </div>

            {/* ETH Amount */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-green-700 mb-2"> Amount Donated (ETH)</h3>
              <p className="text-gray-700">
                The total ETH donated, converted from its base unit (Wei) into readable ETH values for clarity.
              </p>
            </div>

            {/* Deleted Indicator */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-green-700 mb-2"> Deleted Campaigns</h3>
              <p className="text-gray-700">
                Campaigns that have been soft-deleted are marked accordingly in the ledger. Their data is preserved for accountability.
              </p>
            </div>
          </div>
        </div>

        {/* Understanding Etherscan */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">
            Navigating Etherscan for Deeper Insights
          </h2>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl p-6 shadow-md space-y-4">
            <p className="text-gray-700">
              <strong>Etherscan</strong> is a public blockchain explorer that lets you verify any transaction. You don’t need to register or log in.
            </p>

            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Copy a wallet address or transaction hash from our donation ledger.</li>
              <li>Go to <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="text-green-700 underline font-semibold">etherscan.io</a>.</li>
              <li>Paste the address into the search bar and press enter.</li>
              <li>You’ll see a list of transactions. Click any to view full details — including gas fees, status, block confirmations, and more.</li>
            </ol>

            <p className="text-gray-700">
              Etherscan helps ensure that every ETH movement on our platform is traceable and public.
            </p>
          </div>
        </div>



        
      </section>
    </div>
  );
};

export default Education;
