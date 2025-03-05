const hre = require('hardhat');

async function main() {

    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding")
    const crowdFunding = await CrowdFunding.deploy();

    await CrowdFunding.deployed();

    console.log(`CrowdFunding deployed to:" ${crowdFunding.address}`);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });