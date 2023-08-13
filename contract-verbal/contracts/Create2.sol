// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Create2 {
    event Deployed(address addr);

    function deployUsingCreate2(
        bytes memory bytecode,
        string memory _salt
    ) external returns (address) {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deployed(addr);
        return addr;
    }
}
