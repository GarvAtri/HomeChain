# 🏠 HomeChain - Blockchain Rental Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Web3](https://img.shields.io/badge/Web3-4.3.0-green.svg)](https://web3js.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-orange.svg)](https://soliditylang.org/)

**A decentralized rental property platform for West Lafayette, Indiana, powered by blockchain technology.**

HomeChain revolutionizes the rental market by providing transparent, secure, and trustless property listings and lease agreements through smart contracts on the Ethereum blockchain.
[([<img width="1898" height="971" alt="image" src="https://github.com/user-attachments/assets/b1121106-92a7-4e1e-9f3c-63b745aecc41" />](https://github.com/GarvAtri/HomeChain/blob/52f2d9c42fd9defdbf5c24c9d3d2e2b74922651a/HomeChain.png))](https://github.com/GarvAtri/HomeChain/blob/52f2d9c42fd9defdbf5c24c9d3d2e2b74922651a/HomeChain.png)


---

## ✨ Features

### 🔐 Blockchain Security
- **Smart Contract Leases** - Automated, immutable rental agreements
- **Transparent Transactions** - All lease activities recorded on-chain
- **Decentralized Trust** - No intermediaries needed
- **MetaMask Integration** - Secure wallet connectivity

### 🗺️ Interactive Mapping
- **Real-time Google Maps** - 3D satellite view of West Lafayette
- **Property Markers** - Click-to-view property details
- **Location-based Search** - Find rentals in specific areas
- **Smooth Navigation** - Seamless scrolling experience

### 🏡 Property Management
- **List Properties** - Easy-to-use listing form with image uploads
- **Browse Listings** - Beautiful card-based property gallery
- **Detailed Views** - Comprehensive property information
- **Availability Tracking** - Real-time rental status

### 💰 Payment Processing
- **Crypto Payments** - Pay rent in ETH
- **Security Deposits** - Automated deposit handling via smart contracts
- **Transaction History** - Complete payment records on blockchain

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/homechain.git
cd homechain
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**

Edit `.env` and add your keys:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
REACT_APP_NETWORK_ID=11155111
REACT_APP_NETWORK_NAME=sepolia
```

5. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000` 🎉

---

## 🔧 Configuration

### Getting Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the key and add to your `.env` file

### Setting Up MetaMask

1. Install [MetaMask](https://metamask.io/) browser extension
2. Create a new wallet (save your seed phrase securely!)
3. Switch to **Sepolia Test Network**
4. Get free test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

---

## 📦 Smart Contract Deployment

### Using Remix IDE (Recommended for Beginners)

1. **Open Remix**
   - Go to [remix.ethereum.org](https://remix.ethereum.org/)

2. **Create Contract File**
   - Create new file: `RentalContract.sol`
   - Copy contract code from `src/contracts/RentalContract.sol`

3. **Compile**
   - Click "Solidity Compiler" tab
   - Select version `0.8.19`
   - Click "Compile RentalContract.sol"

4. **Deploy**
   - Click "Deploy & Run" tab
   - Environment: **Injected Provider - MetaMask**
   - Select contract: **RentalPlatform**
   - Click **Deploy**
   - Confirm transaction in MetaMask

5. **Copy Contract Address**
   - After deployment, copy the contract address
   - Add it to your `.env` file as `REACT_APP_CONTRACT_ADDRESS`

### Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 📁 Project Structure

```
homechain/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico
├── src/
│   ├── contracts/
│   │   ├── RentalContract.sol  # Smart contract
│   │   └── contractABI.js      # Contract ABI
│   ├── services/
│   │   ├── web3.js            # Web3 service
│   │   └── contract.js        # Contract interaction
│   ├── App.jsx                # Main application
│   └── index.js               # Entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## 🎯 Usage Guide

### For Tenants

1. **Connect Wallet**
   - Click hamburger menu (top-left)
   - Click "Connect Wallet"
   - Approve MetaMask connection

2. **Browse Properties**
   - Scroll down to view available properties
   - Use search bar to filter listings
   - Click "Interactive Map" to explore on map

3. **Sign a Lease**
   - Click on a property card
   - Review property details
   - Click "Sign Smart Contract Lease"
   - Approve transaction in MetaMask (includes security deposit)
   - Receive confirmation with transaction hash

### For Landlords

1. **Connect Wallet**
   - Must have MetaMask connected

2. **List Property**
   - Click hamburger menu → "List Property"
   - Fill in property details:
     - Address
     - Monthly rent
     - Bedrooms/bathrooms
     - Square footage
     - Upload images
     - Description
     - Amenities
   - Click "List Property"
   - Confirm blockchain transaction
   - Property goes live immediately!

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Lucide React** - Icon library
- **Google Maps API** - Interactive mapping
- **CSS-in-JS** - Inline styling

### Blockchain
- **Solidity 0.8.19** - Smart contract language
- **Web3.js 4.3** - Ethereum JavaScript API
- **MetaMask** - Wallet integration
- **Ethereum (Sepolia)** - Test network

### Development Tools
- **Create React App** - React boilerplate
- **Remix IDE** - Smart contract development
- **Hardhat** (optional) - Development environment
- **Git** - Version control

---

## 🔐 Smart Contract Details

### RentalPlatform Contract

**Key Functions:**

- `createListing(address, rent, details)` - List a new property
- `signLease(listingId, duration)` - Sign rental agreement
- `getAllListings()` - Fetch all properties
- `getListing(id)` - Get specific property
- `getLease(id)` - Get lease details

**Events:**

- `ListingCreated` - Emitted when property is listed
- `LeaseSigned` - Emitted when lease is signed
- `LeaseTerminated` - Emitted when lease ends

**Security Features:**

- Ownership verification
- Reentrancy protection
- Input validation
- Security deposit handling

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Alternative: Netlify

```bash
# Build production bundle
npm run build

# Deploy to Netlify (drag & drop build folder)
```

### Environment Variables for Production

Make sure to add these in your hosting platform:
- `REACT_APP_GOOGLE_MAPS_API_KEY`
- `REACT_APP_CONTRACT_ADDRESS`
- `REACT_APP_NETWORK_ID`
- `REACT_APP_NETWORK_NAME`

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist

- [ ] Wallet connection works
- [ ] Properties display correctly
- [ ] Search functionality works
- [ ] Map loads and shows markers
- [ ] Property details modal opens
- [ ] Listing form validates input
- [ ] Image upload works
- [ ] Smart contract interactions succeed
- [ ] Transaction confirmations appear

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write clear commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation if needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Known Issues

- Google Maps requires API key for full functionality
- MetaMask required for blockchain features
- Test network only (Sepolia)
- Image uploads stored locally (not on blockchain/IPFS yet)

---

## 🗺️ Roadmap

### Phase 1 - MVP ✅
- [x] Basic property listings
- [x] Smart contract integration
- [x] Map integration
- [x] Lease signing

### Phase 2 - Enhancement 🚧
- [ ] IPFS image storage
- [ ] Advanced search filters
- [ ] User profiles
- [ ] Rating system
- [ ] Multi-language support

### Phase 3 - Expansion 📅
- [ ] Mainnet deployment
- [ ] Mobile app
- [ ] Property verification system
- [ ] Dispute resolution
- [ ] Rent payment automation

---

## 💬 Support

Need help? Here's how to get support:

- **Issues**: [GitHub Issues](https://github.com/yourusername/homechain/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/homechain/discussions)
- **Email**: support@homechain.example.com

---

## 👏 Acknowledgments

- **Purdue University** - Inspiration for West Lafayette focus
- **Ethereum Foundation** - Blockchain technology
- **Google Maps** - Mapping services
- **MetaMask** - Wallet integration
- **React Community** - Frontend framework

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/homechain?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/homechain?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/homechain)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/homechain)

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400/1e40af/ffffff?text=Landing+Page+Screenshot)

### Property Listings
![Property Listings](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Property+Listings+Screenshot)

### Interactive Map
![Interactive Map](https://via.placeholder.com/800x400/10b981/ffffff?text=Interactive+Map+Screenshot)

### Property Details
![Property Details](https://via.placeholder.com/800x400/6366f1/ffffff?text=Property+Details+Screenshot)

---

<div align="center">

**Made with ❤️ for the Web3 Community**

[Website](https://homechain.example.com) • [Documentation](https://docs.homechain.example.com) • [Demo](https://demo.homechain.example.com)

⭐ Star us on GitHub — it helps!

</div>
