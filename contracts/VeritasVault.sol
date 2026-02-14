// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VeritasVault
 * @dev The "Physical Truth Oracle" Treasury.
 * Holds funds and pays out claims verified by the Veritas AI Consensus.
 * now upgraded with AccessControl for Timelock governance.
 */
contract VeritasVault is AccessControl {
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE"); // Only Timelock can have this
    bytes32 public constant LOG_ROLE = keccak256("LOG_ROLE"); // AI Agent can log

    // Evidence Log: Immutable record of AI thoughts
    event EvidenceLogged(string indexed claimId, string indexed evidenceHash, uint256 timestamp);
    event ClaimPaid(string indexed claimId, address indexed recipient, uint256 amount);
    event FundsDeposited(address indexed sender, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WITHDRAW_ROLE, msg.sender); // Initially Admin, will be revoked later
        _grantRole(LOG_ROLE, msg.sender);
    }

    // --- Core Logic ---

    /**
     * @dev Pays out a claim to a confirmed user.
     * @param recipient The wallet address of the claimant
     * @param claimId The Convex ID of the claim (for linking)
     */
    function payoutClaim(address payable recipient, string calldata claimId) external payable onlyRole(WITHDRAW_ROLE) {
        require(address(this).balance >= msg.value, "Veritas: Insufficient vault funds");
        require(msg.value > 0, "Veritas: Amount must be > 0");

        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Veritas: Transfer failed");

        emit ClaimPaid(claimId, recipient, msg.value);
    }

    /**
     * @dev Immutable log of evidence analysis.
     * @param claimId Link to the claim
     * @param evidenceHash SHA256/IPFS hash of the AI debate log
     */
    function logEvidence(string calldata claimId, string calldata evidenceHash) external onlyRole(LOG_ROLE) {
        emit EvidenceLogged(claimId, evidenceHash, block.timestamp);
    }

    // --- Treasury Management ---

    function depositFunds() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external onlyRole(WITHDRAW_ROLE) {
        require(address(this).balance >= amount, "Veritas: Insufficient funds");
        payable(msg.sender).transfer(amount);
    }

    // Accept plain ETH transfers
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
