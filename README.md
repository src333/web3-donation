# Sahar Mosque - Blockchain-Based Mosque Crowdfunding Application

This decentralised web application (DApp) enables transparent ETH donations to support the construction and operations of the Sahar Mosque. Built using **Next.js**, **TailwindCSS**, **Ethers.js (v6)**, **Solidity**, and **OpenZeppelin**, the platform provides secure, scalable, and easy-to-use donation tracking features for both the community users and admins.

## Folder Structure

```
├── components/
│   ├── AdminDashboard/           # Charts, timelines, tables for admin analytics
│       ├── AdminDashboard.jsx
│       ├── CampaignPiechart.jsx
│       ├── CamapignTable.jsx
│       ├── ChartsPanel.jsx
│       ├── DonationTimeline.jsx
│       ├── StatsPanel.jsx
│       ├── TotalEthPieChart.jsx
│       ├── TransactionLedger.jsx
│       ├── AboutPage/                # Pages: About, Contact, Education, Home
│       ├── About.jsx
│       ├── Contact.jsx
│       ├── Education.jsx
│       ├── Home.jsx
│       ├── InfoCard.jsx
│       ├── PublicTransactionLedger.jsx
│   ├── Card.jsx                  # Reusable campaign display cards
│   ├── Footer.jsx                # Global footer with nav
│   ├── Hero.jsx                  # Campaign creation section
│   ├── Logo.jsx                  # SVG mosque logo
│   ├── Menu.jsx                  # Mobile icon
│   ├── NavBar.jsx                # Site navigation with wallet connect
│   ├── PopUp.jsx                 # Donation modal popup

├── context/
│   ├── CrowdFunding.js           # All Web3 smart contract interactions
│   ├── constants.js              # Contains ABI and contract address
│   ├── CrowdFunding.json         # ABI to be moved from the /artifacts/contracts/CrowdFunding.sol/CrowdFunding.json route into  context/

├── contracts/
│   ├── CrowdFunding.sol          # Smart contract (admin, campaign, donation)
│   ├── BadReceiver.sol           # Testing contract for security (reentrancy)

├── pages/
│   ├── index.js                  # Redirects to /home
│   ├── _app.js                   # Wraps every page with NavBar + Footer
│   ├── home.js                   # Landing page
│   ├── about.js                  # About us page
│   ├── contact.js                # Contact page
│   ├── education.js              # Education/tutorial page
│   ├── donation.js               # Campaign dashboard (main)
│   ├── dashboard.js              # Admin-only dashboard

├── public/images/               # Static images (used in Education guide)
├── styles/globals.css           # Tailwind base styles
├── scripts/deploy.js            # Deployment script for the contract
├── test/test.js                 # Unit tests for CrowdFunding contract
├── tailwind.config.js           # Tailwind config
├── postcss.config.mjs           # Tailwind PostCSS config
├── hardhat.config.js            # Hardhat network setup
└── README.md                    # You are here!
```

## Installation Instructions

> Ensure you have **Node.js**, **npm**, **MetaMask**, and **Hardhat** installed on your machine.

### 1. Here is the Repository i used for version this project.

```bash
git clone https://github.com/src333/web3-donation.git
cd web3-donation
```

GitHub URL = https://github.com/src333/web3-donation

### 2. Install Dependencies

**System Requirements**

- [Node.js + npm](https://nodejs.org/en/download/) – Required for running the frontend and installing dependencies
- [MetaMask](https://metamask.io/download.html) – Browser wallet for interacting with the blockchain

> If you're new:  
> Download and install **Node.js LTS** from the [official website](https://nodejs.org/en/download/).  
> npm comes bundled with it automatically.

```bash
npm install
```

## Blockchain Setup

### 3. Install Hardhat

```bash
npm install --save-dev hardhat
npx hardhat
```

Choose:

- JavaScript project
- say yes to all options after that
- Create sample files

### 4. Start Local Blockchain

```bash
npx hardhat node
```

You’ll see 20 generated accounts. **Copy the first private key**, as this account will act as the **default contract deployer (also the admin)**.

Example:

```
Account #0: 0xf39f...2266 (use this in MetaMask)
Private Key: 0x59c6...abc
```

### 5. Deploy Smart Contract

Open a new terminal window:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, note the **contract address** (you’ll need it in `context/constants.js`).

## . Move Contract ABI into /Context folder

- after you have ran the commands in step 5 , you will need to navigate to the /artifacts/contracts/CorwdFunding.sol and you will need to move the CrowdFunding.json file into the Context folder for you to be able to open the program in the localhost server

## Start the Frontend

```bash
npm run dev
```

Visit: http://localhost:3000

## MetaMask Setup

1. **Install MetaMask Extension**: https://metamask.io/
2. Create an account if you dont have one and log-in
3. go to meta-mask extension setting and turn on pin in tool bar , make sure its set to all sites , turn on allow access to files url , turn on allow incognito
4. open meta-mask using the fox icon near the search bar (NOTE: ive had constent issues of metamask taking a while to load and prompt me to end my password to login , the way i overcame this is going the the extension settings and turning everything on and off and returning to the application and clicking the fox-icon again and itll manage to load)
5. Once loaded and logged in , on the top left of the meta-mask UI , click the network filter , select 'Add a customer network'
   - give any netowrk name
   - in 'Default RPC URL' field , input : http:127.0.0.1:8545 or http://localhost:8545 (try both if one doesnt load)
   - in the 'Chain ID' field : input '31337
   - in 'Currency symbol' field you can add any name like (e.g eth)
   - this HTTP and WebSocket JSON-RPC server / network has to be set up in order for the fake funds to fill up your wallet to be used for testing
6. click on account 2 - it will open up your list of account , press '+ Add account or hardeare wallet' , then click on the 'private key' option and it will prompt you to paste a private key , now from the hardhat node terminal copy and paste account 1s private key in. it will now create a localhost hardhat wallet (connected to the local host network) with fake crypto to use to now make campaign and donate - this account will replicate the admin account
7. go through step 6 again but now paste account 2s private key , which will replicate a non-admin account (any accounts private key pasted above account 1 will replicate differs non-admin users)

## Run Tests

```bash
npx hardhat test
```

Tests are in `/test/test.js`

## Hosted Version (If Applicable)

> Provide a live version of your site (Vercel, Netlify, etc.)

** Live Demo:** https://stepney-mosque-dapp.vercel.app

## Features Overview

- **Create Campaigns** (Admin only)
- **Donate ETH to campaigns** with MetaMask
- **Live transparency**: view donators and donations
- **Admin Dashboard**: charts, timelines, tables (built with Recharts)
- **Security**: OpenZeppelin’s `ReentrancyGuard` prevents exploit risks
- **Education Page**: guide new users through crypto giving
- **Fully Responsive**: built with TailwindCSS
- **Modular Codebase**: scalable and maintainable file structure

## Developer Log Summary

This project was developed over several iterations with full logs. Key development steps included:

1. Initialised with `create-next-app`
2. TailwindCSS and Hardhat setup
3. Smart contract development (CrowdFunding & security contracts)
4. MetaMask wallet integration using Ethers.js v6
5. Campaign creation, donation, admin filtering, and data fetching
6. Custom UI/UX with Tailwind + responsive layout
7. Donation popup modal and wallet connection
8. Full admin dashboard with charts, ledger, and timeline
9. Frontend campaign pagination + scalability improvements
10. Extensive codebase documentation (frontend + backend)
11. Unit testing with `npx hardhat test`
12. Smart contract security with OpenZeppelin
13. About, Contact, Education, and Home pages created
14. Fully responsive card-based UI for campaigns
15. ETH chart visualisations and filtering added
16. Fully commented smart contracts and all components
17. Admin-only routes and dashboard functionality implemented
18. All logs documented for transparency

## Contact

For feedback or technical support:

- Email: info@yourmosque.org.uk
- GitHub: [src333](https://github.com/src333/web3-donation)

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT)

> **Built with purpose to empower communities through decentralised transparency.**
