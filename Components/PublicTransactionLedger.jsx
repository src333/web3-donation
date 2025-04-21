// Components/DonationPage/DonationLedgerSection.jsx

import TransactionLedger from "../Components/AdminDashboard/TransactionLedger";


const PublicTransactionLedger = () => (
    <section className="mt-20 pt-12 pb-12  bg-white rounded-lg shadow-sm px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto border-t border-gray-200">
  
      <h2
        id="donation-activity-heading"
        className="text-2xl mt-5  font-bold text-gray-900 mb-3 tracking-tight"
      >
        Recent Donation Activity
      </h2>

      <p className="text-sm text-gray-600 mb-6 max-w-2xl">
        This is a live and transparent feed of all transactions made through our platform,
        updated in real-time. Learn how to understand this table via our{" "}
        <a
          href="/education"
          className="text-green-700 font-semibold underline focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Education Page
        </a>{" "}
        or view full contract interactions on{" "}
        <a
          href="https://etherscan.io/address/0xYourContractAddress"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 font-semibold underline focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Etherscan
        </a>.
      </p>

      <div className="overflow-x-auto pb-0 border rounded-md shadow-sm bg-white">
      <TransactionLedger />
      </div>
    </div>
  </section>
);

export default PublicTransactionLedger;
