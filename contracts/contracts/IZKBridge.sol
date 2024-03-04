// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IZKBridge {
    
    // @notice send a zkBridge message to the specified address at a zkBridge endpoint.
    // @param dstChainId - the destination chain identifier
    // @param dstAddress - the address on destination chain
    // @param payload - a custom bytes payload to send to the destination contract
    function send(uint16 dstChainId, address dstAddress, bytes memory payload) external payable returns (uint64 nonce);

    // @notice gets a quote in source native gas, for the amount that send() requires to pay for message delivery
    // @param dstChainId - the destination chain identifier
    function estimateFee(uint16 dstChainId) external view returns (uint256 fee);
}