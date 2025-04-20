// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// @title BadReceiver (Test Contract)
/// @notice This mock contract is intentionally designed to reject all ETH transfers
/// @dev Used for testing how the main contract handles failed ETH transfers
contract BadReceiver {
    /// @notice Fallback function — gets called when no other function matches
    /// @dev This will revert any unexpected call or transfer, including low-level calls like '.call()'
    fallback() external payable {
        revert("I don't accept ETH");
    }

    /// @notice Receive function — gets called when ETH is sent directly to the contract (e.g., via '.send()' or '.transfer()')
    /// @dev This function also deliberately rejects ETH to simulate failure scenarios
    receive() external payable {
        revert("I don't accept ETH");
    }
}
