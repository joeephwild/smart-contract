// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VerbalToken is ERC20 {
    address public Holder;

    constructor(address holder) ERC20("VerbalToken", "VTK") {
        Holder = holder;
        _mint(holder, 100000 * 10 ** decimals());
    }
}
