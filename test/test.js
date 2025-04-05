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
            const tx = await crowdFunding.createCampaign( title, description, target, deadline);
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
                crowdFunding.createCampaign( title, description, target, deadline)
            ).to.be.revertedWith("Deadline must be in the future");
        });
    });

    describe("Donate to Campaign", function () {
        it("Should donate successfully to a campaign", async function () {
            // Create a campaign first
            const title = "Donation Campaign";
            const description = "Supporting good causes.";
            const target = ethers.parseEther("10"); // Target of 10 ETH
            const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
            //const tx = await crowdFunding.createCampaign(owner.address, title, description, target, deadline);
            await crowdFunding.createCampaign(title, description, target, deadline);
            const tx = await crowdFunding.createCampaign(title, description, target, deadline);
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
            const tx = await crowdFunding.createCampaign(title, description, target, deadline);
            await tx.wait();

            // Try to donate 0 ETH (Invalid donation)
            await expect(
                crowdFunding.connect(addr1).donateToCampaign(0, { value: 0 })
            ).to.be.revertedWith("Donation must be greater than 0");
        });

        it("Should reject if transfer fails (simulate ReentrancyGuard)", async function () {
            // Deploy the BadReceiver contract
            const BadReceiver = await ethers.getContractFactory("BadReceiver");
            const badReceiver = await BadReceiver.deploy();
            await badReceiver.waitForDeployment();
          
            // Set the bad receiver as admin so we can use its address
            await crowdFunding.setAdmin(badReceiver.target, true);
          
            // Create a campaign using the BadReceiver contract address as the owner
            const tx = await crowdFunding.createCampaignForTest(
              badReceiver.target,
              "Malicious Campaign",
              "This should fail to accept ETH",
              ethers.parseEther("5"),
              Math.floor(Date.now() / 1000) + 86400
            );
            await tx.wait();
          
            // Try to donate — this should fail when the ETH transfer is rejected
            await expect(
              crowdFunding.connect(addr1).donateToCampaign(0, { value: ethers.parseEther("1") })
            ).to.be.revertedWith("Transfer failed");
          });
          
          
        

        it("Should allow multiple separate donations safely", async function () {
            const tx = await crowdFunding.createCampaign( "Guard Test", "No reentrancy", ethers.parseEther("2"), Math.floor(Date.now() / 1000) + 86400);
            await tx.wait();
        
            // Donate from 2 users
            await crowdFunding.connect(addr1).donateToCampaign(0, { value: ethers.parseEther("0.5") });
            await crowdFunding.connect(addr2).donateToCampaign(0, { value: ethers.parseEther("0.3") });
        
            const campaign = await crowdFunding.getCampaigns();
            expect(campaign[0].amountCollected).to.equal(ethers.parseEther("0.8"));
        });
        
        
    });
});

describe("Admin Access Control", function () {
    let CrowdFunding;
    let crowdFunding;
    let owner;
    let addr1;
  
    beforeEach(async function () {
      [owner, addr1] = await ethers.getSigners();
      CrowdFunding = await ethers.getContractFactory("CrowdFunding");
      crowdFunding = await CrowdFunding.deploy();
      await crowdFunding.waitForDeployment();
    });
  
    it("Should allow contract owner (default admin) to create a campaign", async function () {
      const title = "Owner Campaign";
      const description = "Created by contract owner";
      const target = ethers.parseEther("2");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
  
      const tx = await crowdFunding.createCampaign( title, description, target, deadline);
      await tx.wait();
  
      const campaigns = await crowdFunding.getCampaigns();
      expect(campaigns.length).to.equal(1);
      expect(campaigns[0].owner).to.equal(owner.address);
    });
  
    it("Should not allow non-admin to create a campaign", async function () {
      const title = "Non-Admin Campaign";
      const description = "Should fail";
      const target = ethers.parseEther("3");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
  
      await expect(
        crowdFunding.connect(addr1).createCampaign( title, description, target, deadline)
      ).to.be.revertedWith("Only admin allowed");
    });
  
    it("Should allow owner to promote a new admin", async function () {
      await crowdFunding.setAdmin(addr1.address, true);
      const isNowAdmin = await crowdFunding.isAdmin(addr1.address);
      expect(isNowAdmin).to.be.true;
    });
  
    it("Promoted admin should be able to create a campaign", async function () {
      await crowdFunding.setAdmin(addr1.address, true);
  
      const title = "New Admin Campaign";
      const description = "Created by addr1";
      const target = ethers.parseEther("1");
      const deadline = Math.floor(Date.now() / 1000) + 86400;
  
      const tx = await crowdFunding.connect(addr1).createCampaign(title, description, target, deadline);
      await tx.wait();
  
      const campaigns = await crowdFunding.getCampaigns();
      expect(campaigns.length).to.equal(1);
      expect(campaigns[0].owner).to.equal(addr1.address);
    });
  });
  