import web3Service from './web3';
import { RENTAL_CONTRACT_ABI } from '../contracts/contractABI';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

class ContractService {
  constructor() {
    this.contract = null;
  }

  async initialize() {
    const web3 = web3Service.getWeb3();
    if (!web3) throw new Error('Web3 not initialized');
    
    this.contract = new web3.eth.Contract(
      RENTAL_CONTRACT_ABI,
      CONTRACT_ADDRESS
    );
  }

  async createListing(propertyData) {
    if (!this.contract) await this.initialize();
    
    const account = web3Service.getAccount();
    const { address, price, bedrooms, bathrooms, sqft, description, amenities } = propertyData;
    
    try {
      const propertyDetails = JSON.stringify({
        bedrooms,
        bathrooms,
        sqft,
        description,
        amenities
      });
      
      const receipt = await this.contract.methods
        .createListing(address, web3Service.getWeb3().utils.toWei(price, 'ether'), propertyDetails)
        .send({ from: account });
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        listingId: receipt.events.ListingCreated.returnValues.listingId
      };
    } catch (error) {
      console.error('Error creating listing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async signLease(listingId, duration, monthlyRent) {
    if (!this.contract) await this.initialize();
    
    const account = web3Service.getAccount();
    const rentInWei = web3Service.getWeb3().utils.toWei(monthlyRent.toString(), 'ether');
    const securityDeposit = rentInWei; // 1 month security deposit
    
    try {
      const receipt = await this.contract.methods
        .signLease(listingId, duration)
        .send({ 
          from: account,
          value: securityDeposit
        });
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        leaseId: receipt.events.LeaseSigned.returnValues.leaseId,
        gasUsed: receipt.gasUsed
      };
    } catch (error) {
      console.error('Error signing lease:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getListings() {
    if (!this.contract) await this.initialize();
    
    try {
      const listings = await this.contract.methods.getAllListings().call();
      return listings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  }

  async getListing(listingId) {
    if (!this.contract) await this.initialize();
    
    try {
      const listing = await this.contract.methods.getListing(listingId).call();
      return listing;
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  }
}

export default new ContractService();