// Import Hardhat testing libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding Contract", function () {
    let CrowdFunding;
    let crowdFunding;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get signers from Hardhat's ethers provider
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the contract before each test
        CrowdFunding = await ethers.getContractFactory("CrowdFunding");
        crowdFunding = await CrowdFunding.deploy();
        await crowdFunding.waitForDeployment();
    });

    describe("Create Campaign", function () {
        it("Should create a campaign successfully", async function () {
            const title = "Charity for Animals";
            const description = "Help us support animals in need.";
            const target = ethers.parseEther("5"); // Target of 5 ETH
            const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

            // Create a campaign
            const tx = await crowdFunding.createCampaign(owner.address, title, description, target, deadline);
            await tx.wait();

            // Verify if the campaign was created successfully
            const campaign = await crowdFunding.getCampaigns();
            expect(campaign.length).to.equal(1); // There should be 1 campaign
            expect(campaign[0].title).to.equal(title); // Title should match
            expect(campaign[0].description).to.equal(description); // Description should match
            expect(campaign[0].target).to.equal(target); // Target should match
            expect(campaign[0].deadline).to.equal(deadline); // Deadline should match
            expect(campaign[0].amountCollected).to.equal(0); // Initially, no funds have been collected
        });

        it("Should fail to create a campaign with past deadline", async function () {
            const title = "Old Campaign";
            const description = "This campaign has expired.";
            const target = ethers.parseEther("5"); // Target of 5 ETH
            const deadline = Math.floor(Date.now() / 1000) - 86400; // 1 day in the past

            // Try to create a campaign with a past deadline
            await expect(
                crowdFunding.createCampaign(owner.address, title, description, target, deadline)
            ).to.be.revertedWith("the deadline should be set the future as this date has passed.");
        });
    });

    describe("Donate to Campaign", function () {
        it("Should donate successfully to a campaign", async function () {
            // Create a campaign first
            const title = "Donation Campaign";
            const description = "Supporting good causes.";
            const target = ethers.parseEther("10"); // Target of 10 ETH
            const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
            const tx = await crowdFunding.createCampaign(owner.address, title, description, target, deadline);
            await tx.wait();

            // Donate 1 ETH to the campaign (campaign ID = 0)
            const donationAmount = ethers.parseEther("1");
            const tx2 = await crowdFunding.connect(addr1).donateToCampaign(0, { value: donationAmount });
            await tx2.wait();

            // Verify the donation was successful
            const campaign = await crowdFunding.getCampaigns();
            expect(campaign[0].amountCollected).to.equal(donationAmount); // Campaign amount collected should be 1 ETH

            // Check if the donator was added
            const [donators, donations] = await crowdFunding.getDonators(0);
            expect(donators.length).to.equal(1); // There should be 1 donator
            expect(donators[0]).to.equal(addr1.address); // Donator should be addr1
            expect(donations.length).to.equal(1); // There should be 1 donation
            expect(donations[0]).to.equal(donationAmount); // Donation amount should match
        });

        it("Should fail if donation amount is 0", async function () {
            // Create a campaign first
            const title = "Donation Campaign";
            const description = "Supporting good causes.";
            const target = ethers.parseEther("10"); // Target of 10 ETH
            const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
            const tx = await crowdFunding.createCampaign(owner.address, title, description, target, deadline);
            await tx.wait();

            // Try to donate 0 ETH (Invalid donation)
            await expect(
                crowdFunding.connect(addr1).donateToCampaign(0, { value: 0 })
            ).to.be.revertedWith("Donation amount must be greater than zero.");
        });
    });
});
