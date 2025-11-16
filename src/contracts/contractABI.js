export const RENTAL_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "propertyAddress", "type": "string" },
      { "internalType": "uint256", "name": "monthlyRent", "type": "uint256" },
      { "internalType": "string", "name": "propertyDetails", "type": "string" }
    ],
    "name": "createListing",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "listingId", "type": "uint256" },
      { "internalType": "uint256", "name": "duration", "type": "uint256" }
    ],
    "name": "signLease",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllListings",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string", "name": "propertyAddress", "type": "string" },
          { "internalType": "uint256", "name": "monthlyRent", "type": "uint256" },
          { "internalType": "bool", "name": "isAvailable", "type": "bool" },
          { "internalType": "string", "name": "details", "type": "string" }
        ],
        "internalType": "struct RentalPlatform.Listing[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "listingId", "type": "uint256" }
    ],
    "name": "getListing",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string", "name": "propertyAddress", "type": "string" },
          { "internalType": "uint256", "name": "monthlyRent", "type": "uint256" },
          { "internalType": "bool", "name": "isAvailable", "type": "bool" },
          { "internalType": "string", "name": "details", "type": "string" }
        ],
        "internalType": "struct RentalPlatform.Listing",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];