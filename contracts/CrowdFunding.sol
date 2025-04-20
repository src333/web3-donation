// SPDX-License-Identifier: UNLICENSED
/*pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }
    // ================= Admin Access Control =================

    address public owner;
    mapping(address => bool) public isAdmin;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true; // make the deployer the first admin
    }

    function setAdmin(address _admin, bool _status) public onlyOwner {
        isAdmin[_admin] = _status;
    }

    // there is no need to create a constrcutor for this contract if youre wondering why its missing

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        require(
            //campaign.deadline < block.timestamp,
            _deadline > block.timestamp, // can change it back later if not working
            "the deadline should be set the future as this date has passed."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
        // to return the actual length of the campaigns
    }

    function donateToCampaign(uint256 _id) public payable {
        // require(_id < numberOfCampaigns, "Campaign does not exist."); // remove if doesnt work
        require(msg.value > 0, "Donation amount must be greater than zero."); // this check can remove later
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        // this line allows us to send fund to the owner of the contract or campaign rather than the contract account itself

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}*/

// latest version
/*pragma solidity ^0.8.9;

contract CrowdFunding {
    // Contract owner (deployer)
    address public contractOwner;

    // Mapping of admin addresses
    mapping(address => bool) public isAdmin;

    bool private locked = false;

    modifier nonReentrant() {
        require(!locked, "Reentrancy attack detected");
        locked = true;
        _;
        locked = false;
    }   // Right now, you're using .call to send ETH, which opens up a reentrancy attack vector (where a malicious contract could repeatedly trigger donateToCampaign() before the previous call finishes).


    // Campaign structure
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    // Constructor — sets deployer as contract owner and default admin
    constructor() {
        contractOwner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // Modifier: Only admins can call
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can perform this action");
        _;
    }

    // Modifier: Only contract owner
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contract owner allowed");
        _;
    }

    // Function: Add or remove admin (onlyOwner can call this)
    function setAdmin(address _admin, bool _status) external onlyOwner {
        isAdmin[_admin] = _status;
    }

    // Create a campaign (now restricted to admins only)
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public onlyAdmin returns (uint256) {
        require(
            _deadline > block.timestamp,
            "The deadline should be set in the future"
        );

        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.owner = _owner; // change from _owner to msg.sender for better secuirty, prevents spoofing and keeps on chain trustworthy as we arent trusting frontend input 
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    // Donate ETH to a campaign
    // add nonReentrant after payable for security 
    function donateToCampaign(uint256 _id) public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");

        if (sent) {
            campaign.amountCollected += msg.value;
        }
    }

    // Get all donators and donations for a campaign
    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // Get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}*/

/////////////////////////////////////////////////////////////////////////////////////////////

// safe contract
/*
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CrowdFunding is ReentrancyGuard {
    // Contract owner
    address public contractOwner;

    // Admin mapping
    mapping(address => bool) public isAdmin;

    // Campaign data structure
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns;

    // Events allow off-chain services (like UIs, block explorers, or indexers) to monitor what happened — e.g., campaign creation or donations.
    event CampaignCreated(uint256 id, address owner, string title);
    event DonationReceived(uint256 campaignId, address donator, uint256 amount);
    event AdminUpdated(address admin, bool status);

    // Constructor
    constructor() {
        contractOwner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contract owner allowed");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin allowed");
        _;
    }

    // Set admin
    function setAdmin(address _admin, bool _status) external onlyOwner {
        isAdmin[_admin] = _status;
        emit AdminUpdated(_admin, _status);
    }

    // Create a new campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public onlyAdmin returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_target > 0, "Target must be greater than 0");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;

        emit CampaignCreated(numberOfCampaigns, _owner, _title);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    // Donate to campaign
    function donateToCampaign(uint256 _id) external payable nonReentrant {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        require(msg.value > 0, "Donation must be greater than 0");

        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "Campaign expired");

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;

        (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");
        require(sent, "Transfer failed");

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    // View all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    // View donators and amounts
    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
} */

// version with security updates
pragma solidity ^0.8.9;

// Importing ReentrancyGuard from OpenZeppelin to prevent re-entrancy attacks on functions like donation transfers.
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// (triple-slash) style is used in Solidity to write NatSpec comments, which stands for Ethereum Natural Specification Format. It’s an official Solidity standard designed for documentation & tooling Benefits
/// @title CrowdFunding Smart Contract
/// @notice Enables users to create campaigns and receive ETH donations securely.
/// @dev Inherits OpenZeppelin's ReentrancyGuard for donation function safety.

contract CrowdFunding is ReentrancyGuard {
    /// @notice Stores the address of the contract owner (typically the deployer).
    address public contractOwner;

    /// @notice Mapping to track admin status. True = admin, false = non-admin.
    mapping(address => bool) public isAdmin;

    /// @notice Defines the structure of a fundraising campaign similar to creating an object in OOP.
    struct Campaign {
        uint256 id; // Unique ID of the campaign
        bool isDeleted; // Logical flag for soft-deleting the campaign (data remains accessible)
        address owner; // Creator of the campaign
        string title; // Campaign title
        string description; // Detailed explanation of the campaign's purpose
        uint256 target; // ETH target amount in wei to be coverted in front-end
        uint256 deadline; // Timestamp deadline for the campaign (UNIX time)
        uint256 amountCollected; // ETH collected so far (in wei)
        address[] donators; // List of addresses that donated
        uint256[] donations; // Corresponding donation values in wei
        uint256[] timestamps; // list of timestamps for each donation (UNIX time)
    }

    /// @notice Maps a campaign ID to its Campaign data.
    mapping(uint256 => Campaign) public campaigns;

    /// @notice Tracks total number of campaigns created.
    uint256 public numberOfCampaigns;

    // Events allow off-chain services (like UIs, block explorers, or indexers) to monitor what happened
    /// @notice Emitted when a new campaign is created.
    event CampaignCreated(uint256 id, address owner, string title);

    /// @notice Emitted when a donation is made to a campaign.
    event DonationReceived(uint256 campaignId, address donator, uint256 amount);

    /// @notice Emitted when an admin is added or removed.
    event AdminUpdated(address admin, bool status);

    /// @notice Emitted when ETH is transferred from the contract to a campaign owner.
    event DonationTransferred(
        uint256 indexed campaignId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    //  CONTRACT INITIALISATION
    /// @notice Constructor runs once at deployment. Sets deployer as owner and default admin.
    constructor() {
        contractOwner = msg.sender; // Assign deployer as contract owner
        isAdmin[msg.sender] = true; // Grants deployer admin privileges by default
    }

    // ACCESS CONTROL MODIFIERS
    /// @notice Modifier to restrict function to a contracts owner only.
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contract owner allowed");
        _;
    }

    /// @notice Modifier to restrict function to approved admins only.
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin allowed");
        _;
    }

    // ADMIN MANAGEMENT
    /// @notice Allows the contract owner to add or remove admins.
    /// @param _admin The address to promote/demote
    /// @param _status True to promote to admin, false to demote
    function setAdmin(address _admin, bool _status) external onlyOwner {
        isAdmin[_admin] = _status;
        emit AdminUpdated(_admin, _status); // Emit event for transparency
    }

    /// @notice Creates a new crowdfunding campaign
    /// @dev Only callable by an account marked as admin (checked via 'onlyAdmin' modifier)
    /// @param _title The title or name of the campaign
    /// @param _description A short description outlining the purpose of the campaign
    /// @param _target The funding goal in wei (smallest ETH unit) that the campaign aims to collect
    /// @param _deadline A Unix timestamp (in seconds) representing the deadline for the campaign
    /// @return The unique ID of the newly created campaign
    function createCampaign(
        //address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public onlyAdmin returns (uint256) {
        // Ensure that the deadline is in the future (after the current block time)
        require(_deadline > block.timestamp, "Deadline must be in the future");

        // Ensure that the fundraising target is greater than zero
        require(_target > 0, "Target must be greater than 0");

        // Create a new Campaign struct in storage and assign it a unique ID
        Campaign storage campaign = campaigns[numberOfCampaigns];

        // Assign campaign metadata and state
        //campaign.owner = _owner;
        campaign.id = numberOfCampaigns; // Assign current campaign ID
        campaign.owner = msg.sender; // Set the creator as the owner
        campaign.title = _title; // Campaign title
        campaign.description = _description; // Campaign description
        campaign.target = _target; // Campaign funding goal
        campaign.deadline = _deadline; // Campaign deadline

        // Emit an event so off-chain apps (like your frontend) can track creation
        emit CampaignCreated(numberOfCampaigns, msg.sender, _title);

        // Increment the campaign counter so the next one gets a unique ID
        numberOfCampaigns++;

        // Return the ID of the newly created campaign
        return numberOfCampaigns - 1;
    }

    /// @notice TEST-ONLY function to simulate campaign creation on behalf of any user
    /// @dev Intended for test cases, especially malicious scenarios (e.g. impersonation or spoofing).
    /// Should not be used in production. Allows setting a custom owner instead of msg.sender.
    /// @param _owner The spoofed owner of the campaign (not necessarily the caller)
    /// @param _title Campaign title
    /// @param _description Campaign description or context
    /// @param _target Campaign fundraising goal (in wei)
    /// @param _deadline Deadline timestamp for campaign expiration
    /// @return The ID of the created test campaign
    // nevertheless same functionality as the creatCampaign() above
    function createCampaignForTest(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public onlyAdmin returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_target > 0, "Target must be greater than 0");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner; // This bypasses msg.sender for testing , for one of the unit tests
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;

        emit CampaignCreated(numberOfCampaigns, _owner, _title);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    /// @notice Donate ETH to a specific campaign by its ID
    /// @dev Uses nonReentrant modifier to prevent reentrancy attacks (security via OpenZeppelin)
    /// @param _id The campaign ID to donate to
    function donateToCampaign(uint256 _id) external payable nonReentrant {
        // Ensure the campaign exists
        require(_id < numberOfCampaigns, "Campaign does not exist");

        // Ensure a positive donation amount
        require(msg.value > 0, "Donation must be greater than 0");

        // Load campaign from storage
        Campaign storage campaign = campaigns[_id];

        // Ensure the campaign is still active
        require(block.timestamp < campaign.deadline, "Campaign expired");

        // Record donation details
        campaign.donators.push(msg.sender); // Save donor's address
        campaign.donations.push(msg.value); // Save amount donated
        campaign.timestamps.push(block.timestamp); // Save timestamp of donation
        campaign.amountCollected += msg.value; // Increment total raised

        // Attempts to send donated funds directly to the campaign owner
        (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");
        require(sent, "Transfer failed");

        // Emit donation transfer (useful for analytics or transparency)
        emit DonationTransferred(
            _id,
            msg.sender,
            campaign.owner,
            msg.value,
            block.timestamp
        );

        // Emit generic donation event (e.g., for logs or notifications)
        emit DonationReceived(_id, msg.sender, msg.value);
    }

    /// @notice Allows an admin to update a campaign's title, description, and target
    /// @dev Only callable by accounts marked as admins (enforced via 'onlyAdmin' modifier)
    /// @param _id The ID of the campaign to update
    /// @param _title The new title of the campaign
    /// @param _description The new description of the campaign
    /// @param _target The updated fundraising target in wei
    function updateCampaign(
        uint256 _id,
        string memory _title,
        string memory _description,
        uint256 _target
    ) public onlyAdmin {
        // Ensure the campaign exists
        require(_id < numberOfCampaigns, "Campaign does not exist");

        // Target amount must be positive
        require(_target > 0, "Target must be greater than 0");

        // Load campaign from storage
        Campaign storage campaign = campaigns[_id];

        // Update campaign fields
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
    }

    /// @notice Marks a campaign as deleted without removing its data from storage
    /// @dev This is a soft delete – the campaign remains in the array, but is flagged as deleted.
    /// Only admins can perform this action (enforced via the 'onlyAdmin' modifier) via the campaign managment tool in the admin dashboard
    /// @param _id The ID of the campaign to "delete"
    function deleteCampaign(uint256 _id) public onlyAdmin {
        // Ensure the campaign exists by checking if its ID is within the valid range
        require(_id < numberOfCampaigns, "Campaign does not exist");

        //delete campaigns[_id];
        // Soft delete - instead of removing the campaign from storage,
        // we set a flag. This preserves donation history and index integrity.
        campaigns[_id].isDeleted = true;
    }

    // View all campaigns
    /// @notice Returns all non-deleted campaigns stored in the contract
    /// @dev Performs a two-pass loop: first to count valid campaigns, second to copy them into memory
    /// @return allCampaigns An array of active (non-deleted) Campaign structs
    function getCampaigns() public view returns (Campaign[] memory) {
        uint count = 0;

        // First loop: Count how many campaigns are not deleted
        for (uint i = 0; i < numberOfCampaigns; i++) {
            /*if (campaigns[i].owner != address(0)) {
                count++;
            }*/
            if (!campaigns[i].isDeleted) {
                count++;
            }
        }

        // Allocate a new array in memory sized to the number of valid campaigns
        Campaign[] memory allCampaigns = new Campaign[](count);
        uint index = 0;

        // Second loop: Copy each non-deleted campaign into the memory array
        for (uint i = 0; i < numberOfCampaigns; i++) {
            /*if (campaigns[i].owner != address(0)) {
                allCampaigns[index] = campaigns[i];
                index++;
            }*/
            if (!campaigns[i].isDeleted) {
                allCampaigns[index] = campaigns[i];
                index++;
            }
        }

        // Return the filtered array
        return allCampaigns;
    }

    /// @notice Returns all campaigns, including deleted ones
    /// @dev Useful for admin-level analytics and backend tools that require full visibility
    /// @return allCampaigns Array containing every campaign ever created, regardless of deletion status
    function getAllCampaigns() public view returns (Campaign[] memory) {
        // Allocates memory for all campaigns (no filtering applied)
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        // Copy each campaign from storage to memory
        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    // View donators and amounts
    /// @notice Returns the full list of donors, donation amounts, and timestamps for a specific campaign
    /// @dev These arrays are aligned by index — index 0 of each array represents the first donation
    /// @param _id The ID of the campaign to retrieve donations for
    /// @return donators List of donor addresses
    /// @return donations List of donation amounts in Wei
    /// @return timestamps List of Unix timestamps (block time) for each donation
    function getDonators(
        uint256 _id
    )
        public
        view
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        // Return alls relevant donation metadata for the campaign
        return (
            campaigns[_id].donators,
            campaigns[_id].donations,
            campaigns[_id].timestamps
        );
    }
}
