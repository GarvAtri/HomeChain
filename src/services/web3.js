import Web3 from 'web3';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.networkId = null;
  }

  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        this.web3 = new Web3(window.ethereum);
        
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        this.account = accounts[0];
        this.networkId = await this.web3.eth.net.getId();
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          this.account = accounts[0];
          window.location.reload();
        });
        
        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
        
        return {
          success: true,
          account: this.account,
          networkId: this.networkId
        };
      } catch (error) {
        console.error('Error initializing Web3:', error);
        return {
          success: false,
          error: error.message
        };
      }
    } else {
      return {
        success: false,
        error: 'Please install MetaMask to use this application'
      };
    }
  }

  async getBalance(address) {
    if (!this.web3) return null;
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  isConnected() {
    return this.web3 !== null && this.account !== null;
  }

  getAccount() {
    return this.account;
  }

  getWeb3() {
    return this.web3;
  }
}

export default new Web3Service();