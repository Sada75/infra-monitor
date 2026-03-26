// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofStorage {
    struct Proof {
        string projectId;
        string deviceId;
        uint256 timestamp;
        string ipfsHash;
        bytes32 dataHash;
    }

    Proof[] public proofs;

    function submitProof(
        string memory projectId,
        string memory deviceId,
        uint256 timestamp,
        string memory ipfsHash,
        bytes32 dataHash
    ) public {
        proofs.push(
            Proof(projectId, deviceId, timestamp, ipfsHash, dataHash)
        );
    }

    function getProofCount() public view returns (uint256) {
        return proofs.length;
    }
}