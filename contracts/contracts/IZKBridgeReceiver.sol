// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IZKBridgeReceiver {
    // @notice zkBridge endpoint will invoke this function to deliver the message on the destination
    // @param srcChainId - the source endpoint identifier
    // @param srcAddress - the source sending contract address from the source chain
    // @param nonce - the ordered message nonce
    // @param payload - a custom bytes payload from send chain
    function zkReceive(uint16 srcChainId, address srcAddress, uint64 nonce, bytes calldata payload) external;
}