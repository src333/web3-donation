const hre = require("hardhat");
// 0x5FbDB2315678afecb367f032d93F642f64180aa3 , everytime we recompile and redeploy we need the new contract add to intercat with front-end 

async function main() {
    // Get the contract factory
    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
    
    // Deploy the contract
    console.log("Deploying contract...");
    const crowdFunding = await CrowdFunding.deploy();

    // Wait for the contract to be deployed
    await crowdFunding.waitForDeployment();
    

    // Access the deployed contract's address using .target()
    //console.log(`CrowdFunding deployed to: ${crowdFunding.target}`);
    //console.log(`CrowdFunding deployed to: ${crowdFunding.address}`);
    console.log(`CrowdFunding deployed to: ${await crowdFunding.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
