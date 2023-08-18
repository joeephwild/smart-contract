// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VerbalToken is ERC20 {
    address public Holder;

    constructor(
        uint256 totalSupply,
        address _holder
    ) ERC20("VerbalToken", "VTC") {
        Holder = _holder;
        _mint(_holder, totalSupply);
    }
}
