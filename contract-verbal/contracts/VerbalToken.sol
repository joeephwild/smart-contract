// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VerbalToken is ERC20 {
    uint256 private constant MAX_SUPPLY;
    address private _deployer;
    address private Holder;

    constructor(MAX_SUPPLY, address _holder) ERC20("VerbalToken", "VTC") {
        _deployer = msg.sender;
        Holder = _holder;
        _mint(_holder, MAX_SUPPLY);
    }
}
