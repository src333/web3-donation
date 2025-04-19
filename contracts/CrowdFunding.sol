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

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CrowdFunding is ReentrancyGuard {
    // Contract owner
    address public contractOwner;

    // Admin mapping
    mapping(address => bool) public isAdmin;

    // Campaign data structure
    struct Campaign {
        uint256 id; // Unique ID of the campaign
        bool isDeleted;
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        uint256[] timestamps;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns;

    // Events allow off-chain services (like UIs, block explorers, or indexers) to monitor what happened — e.g., campaign creation or donations.
    event CampaignCreated(uint256 id, address owner, string title);
    event DonationReceived(uint256 campaignId, address donator, uint256 amount);
    event AdminUpdated(address admin, bool status);
    event DonationTransferred(
        uint256 indexed campaignId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

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
        //address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public onlyAdmin returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_target > 0, "Target must be greater than 0");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        //campaign.owner = _owner;
        campaign.id = numberOfCampaigns;
        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;

        emit CampaignCreated(numberOfCampaigns, msg.sender, _title);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    // test function for test csae to mimic malicious activity
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
        campaign.timestamps.push(block.timestamp);
        campaign.amountCollected += msg.value;

        (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");
        require(sent, "Transfer failed");

        emit DonationTransferred(
            _id,
            msg.sender,
            campaign.owner,
            msg.value,
            block.timestamp
        );
        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function updateCampaign(
        uint256 _id,
        string memory _title,
        string memory _description,
        uint256 _target
    ) public onlyAdmin {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        require(_target > 0, "Target must be greater than 0");

        Campaign storage campaign = campaigns[_id];
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
    }

    function deleteCampaign(uint256 _id) public onlyAdmin {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        //delete campaigns[_id];
        campaigns[_id].isDeleted = true;
    }

    // View all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        uint count = 0;
        for (uint i = 0; i < numberOfCampaigns; i++) {
            /*if (campaigns[i].owner != address(0)) {
                count++;
            }*/
            if (!campaigns[i].isDeleted) {
                count++;
            }
        }

        Campaign[] memory allCampaigns = new Campaign[](count);
        uint index = 0;
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
        return allCampaigns;
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    // View donators and amounts
    function getDonators(
        uint256 _id
    )
        public
        view
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        return (
            campaigns[_id].donators,
            campaigns[_id].donations,
            campaigns[_id].timestamps
        );
    }
}
