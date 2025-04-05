// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BadReceiver {
    fallback() external payable {
        revert("I don't accept ETH");
    }

    receive() external payable {
        revert("I don't accept ETH");
    }
}
