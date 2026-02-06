// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VeritasAgentID
 * @dev Implementation of the ERC-8004 'Trustless Agent' Identity Standard (Prototype).
 * This NFT represents the "License" of an AI Agent Node in the Veritas Network.
 */
contract VeritasAgentID is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to hold Agent Capabilities
    struct AgentService {
        string serviceId;      // e.g., "DAMAGE_ANALYSIS"
        uint256 price;         // in wei (or USDC units)
        bool active;
    }

    // Mapping from Token ID -> Array of Services
    mapping(uint256 => AgentService[]) public agentServices;
    
    // Mapping from Token ID -> Reputation Score (0-1000)
    mapping(uint256 => uint256) public agentReputation;

    event AgentRegistered(uint256 indexed tokenId, address indexed agentWallet, string handle);
    event ServiceAdded(uint256 indexed tokenId, string serviceId);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newScore);

    constructor() ERC721("Veritas Agent Identity", "V-ID") Ownable(msg.sender) {}

    /**
     * @dev Mints a new Agent Identity NFT. 
     * In ERC-8004, this is the "Passport" that allows the agent to be discovered.
     */
    function mintIdentity(address agentWallet, string memory tokenURI, string memory handle)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(agentWallet, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        // Initialize Reputation
        agentReputation[newItemId] = 100; // Base score

        emit AgentRegistered(newItemId, agentWallet, handle);

        return newItemId;
    }

    /**
     * @dev Allows an Agent to list a service they provide.
     * This is the "Service Discovery" part of ERC-8004.
     */
    function addService(uint256 tokenId, string memory serviceId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only agent owner can add services");
        
        agentServices[tokenId].push(AgentService({
            serviceId: serviceId,
            price: price,
            active: true
        }));

        emit ServiceAdded(tokenId, serviceId);
    }

    /**
     * @dev Called by the 'Reputation Registry' (or Admin for now) to update score.
     */
    function updateReputation(uint256 tokenId, uint256 newScore) public onlyOwner {
        agentReputation[tokenId] = newScore;
        emit ReputationUpdated(tokenId, newScore);
    }

    function getServices(uint256 tokenId) public view returns (AgentService[] memory) {
        return agentServices[tokenId];
    }
}
