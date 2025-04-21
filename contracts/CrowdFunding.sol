// SPDX-License-Identifier: UNLICENSED

/**
 * @title CrowdFunding Smart Contract (Enhanced Version)
 * @author Sahar Choudhury
 * @notice This contract allows admins to create campaigns and users to donate securely using ETH.
 *
 *  Based on Tutorial by Daulat Hussain:
 * https://www.youtube.com/watch?v=AcXVKkYnu1c&ab_channel=DaulatHussain
 *
 *  Enhancements & Modifications:
 * - Integrated OpenZeppelin's ReentrancyGuard for security against re-entrancy attacks
 * - Introduced admin role management and contract owner logic (setAdmin, onlyAdmin, onlyOwner)
 * - Added `timestamps[]` to track when each donation occurred
 * - Implemented `deleteCampaign()` (soft delete) and `isDeleted` flag
 * - Built `getCampaigns()` and `getAllCampaigns()` to support filtered and admin-level data
 * - Added detailed NatSpec-style documentation for every function and structure
 * - Added `createCampaignForTest()` for unit testing and spoof scenarios
 * - Improved data integrity with `id` field for each campaign (ensures index alignment)
 * - Added events for analytics, frontend UI sync, and transparency (DonationReceived, AdminUpdated, etc.)
 *
 *  Security Best Practices:
 * - All donation transfers use `.call{value: amount}("")` with reentrancy protection
 * - Access control handled via modifiers (`onlyOwner`, `onlyAdmin`)
 *
 *  Built with Solidity ^0.8.9 — no need for SafeMath due to built-in overflow checks
 */

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

    /**
     * @notice Based on original tutorial implementation by Daulat Hussain.
     * @dev Modified to:
     * - Remove the `_owner` parameter — now uses `msg.sender` for security and simplicity.
     * - Restricted access to admins only using `onlyAdmin` modifier.
     * - Added input validation for deadline and target amount.
     * - Emits a `CampaignCreated` event to enable frontend/off-chain listening.
     */
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

    /**
     * @notice Based on original tutorial implementation by Daulat Hussain.
     * @dev Enhanced to:
     * - Add reentrancy protection via OpenZeppelin’s `nonReentrant` modifier.
     * - Include `timestamps[]` to record when each donation was made.
     * - Emit structured events (`DonationReceived` and `DonationTransferred`) for logging and analytics.
     * - Validate donation amounts and campaign deadlines.
     */
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

        // ensures softdeleted campaigns still cant be donated to
        require(!campaign.isDeleted, "Cannot donate to a deleted campaign");

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

    /**
     * @notice  Based on original tutorial implementation by Daulat Hussain.
     * @dev Improvements:
     * - Corrected loop condition bug from tutorial (`for (uint i = 0; 1 < numberOfCampaigns; i++)`).
     * - Filters out soft-deleted campaigns using the `isDeleted` flag.
     * - Ensures only active campaigns are shown in the frontend.
     */
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

    /**
     * @notice Reused from tutorial to return donor data.
     * @dev Extended to:
     * - Include an additional return value: `timestamps[]` to show when each donation occurred.
     * - Helps improve transparency in the frontend donation history.
     */
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
