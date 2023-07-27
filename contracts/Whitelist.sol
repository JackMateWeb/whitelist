// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Whitelist {
    uint8 public maxWhitelistAddresses;
    mapping(address => bool) public whitelistAddresses;
    uint8 public numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistAddresses) {
        maxWhitelistAddresses = _maxWhitelistAddresses;
    }

    function addAddressToWhitelist() public {
        require(
            !whitelistAddresses[msg.sender],
            "Sender has already been whitelisted"
        );
        require(
            numAddressesWhitelisted < maxWhitelistAddresses,
            "More addresses cant be added, limit reached"
        );
        whitelistAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }

    function isAddressInWhitelist(address _address) public view returns (bool) {
        return whitelistAddresses[_address];
    }
}
