// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PolicyRegistry
 * @dev Stores the Immutable "Service Definitions" (Policies) that Agents must follow.
 * Connected to Policy Forge.
 */
contract PolicyRegistry is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE"); // The Forge (Admin)
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE"); // The Timelock

    struct Policy {
        string name;
        string ipfsHash; // The JSON blueprint from Policy Forge
        uint256 activationTime;
        bool isActive;
    }

    // Policy ID (incremental) -> Policy
    mapping(uint256 => Policy) public policies;
    uint256 public nextPolicyId;

    event PolicyProposed(uint256 indexed policyId, string name, string ipfsHash);
    event PolicyActivated(uint256 indexed policyId);
    event PolicyRevoked(uint256 indexed policyId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
    }

    /**
     * @dev Step 1: Forge proposes a policy.
     */
    function proposePolicy(string memory _name, string memory _ipfsHash) external onlyRole(PROPOSER_ROLE) {
        policies[nextPolicyId] = Policy({
            name: _name,
            ipfsHash: _ipfsHash,
            activationTime: 0,
            isActive: false
        });

        emit PolicyProposed(nextPolicyId, _name, _ipfsHash);
        nextPolicyId++;
    }

    /**
     * @dev Step 2: Governance (Timelock) activates it.
     */
    function activatePolicy(uint256 _policyId) external onlyRole(EXECUTOR_ROLE) {
        require(_policyId < nextPolicyId, "Invalid Policy ID");
        policies[_policyId].isActive = true;
        policies[_policyId].activationTime = block.timestamp;
        
        emit PolicyActivated(_policyId);
    }

    /**
     * @dev Emergency Revoke
     */
    function revokePolicy(uint256 _policyId) external onlyRole(EXECUTOR_ROLE) {
        policies[_policyId].isActive = false;
        emit PolicyRevoked(_policyId);
    }
}
