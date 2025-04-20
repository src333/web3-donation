// scripts/deploy.js

// Import Hardhat Runtime Environment (HRE)
// Used for deploying and testing contracts
const hre = require("hardhat");

// Note:
// Every time you recompile and redeploy your contract, it gets a new address.
// You must update this address in your frontend app to keep it in sync.
// Example of previous deployment address:
// 0x5FbDB2315678afecb367f032d93F642f64180aa3 this has always been the address i recieved when i redeploy 


/**
 * main()
 * This is the deployment script that gets executed by `npx hardhat run scripts/deploy.js`.
 *
 * Workflow:
 * 1. Get the contract factory (compiled blueprint).
 * 2. Deploy the contract to the local/selected blockchain.
 * 3. Wait for deployment to finish.
 * 4. Print the deployed contract address to the console.
 */
async function main() {
    // Step 1: Load the compiled CrowdFunding contract factory
    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
    
     // Step 2: Start the deployment
    console.log("Deploying contract...");
    const crowdFunding = await CrowdFunding.deploy();

    // Step 3: Wait for the deployment to complete
    await crowdFunding.waitForDeployment();
    

    // Step 4: Log the deployed contract's address
    // Using getAddress() ensures compatibility across newer Hardhat versions
    console.log(`CrowdFunding deployed to: ${await crowdFunding.getAddress()}`);
}

// Catch and handle errors 
main().catch((error) => {
    console.error(error);
    process.exitCode = 1; // Exit with error code for CI/CD or scripting environments
});
