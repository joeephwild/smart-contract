//SPDX-Lincense-Identifier: MIT

pragma solidity ^0.8.19;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract IAxelarContract is AxelarExecutable {
    IAxelarGasService public immutable gasService;

    constructor(
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    // Call this function to update the value of this contract along with all its siblings'
    function setRemoteValue(
        string calldata _destinationChain,
        string calldata _destinationAddress,
        string calldata _value
    ) external payable {
        require(msg.value > 0, "Gas payment is required");

        bytes memory payload = abi.encode(_value);
        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            _destinationChain,
            _destinationAddress,
            payload,
            msg.sender
        );
        gateway.callContract(_destinationChain, _destinationAddress, payload);
    }

    // Handles calls created by setAndSend. Updates this contract's value
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        string value = abi.decode(payload_, (string));
        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;
    }
}
