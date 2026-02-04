export const VeritasVaultABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "claimId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ClaimPaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "claimId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "evidenceHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "EvidenceLogged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "claimId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "evidenceHash",
        "type": "string"
      }
    ],
    "name": "logEvidence",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "claimId",
        "type": "string"
      }
    ],
    "name": "payoutClaim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;
