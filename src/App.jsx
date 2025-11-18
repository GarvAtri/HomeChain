import React, { useState, useEffect, useRef } from 'react';
import { Home, Menu, X, Search, MapPin, Bed, Bath, Square, Maximize2, FileText, Shield, Loader, DollarSign } from 'lucide-react';

// West Lafayette coordinates
const WEST_LAFAYETTE_CENTER = { lat: 40.4259, lng: -86.9081 };

// Sample properties with real West Lafayette addresses
const sampleProperties = [
  {
    id: 1,
    address: '123 Northwestern Ave, West Lafayette, IN 47906',
    price: 1200,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    isAvailable: true,
    lat: 40.4259,
    lng: -86.9081,
    description: 'Spacious apartment near Purdue campus with modern amenities and great views.',
    amenities: 'Parking, Laundry, Pet Friendly, WiFi',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    blockchainVerified: true
  },
  {
    id: 2,
    address: '456 State St, West Lafayette, IN 47906',
    price: 950,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    isAvailable: true,
    lat: 40.4237,
    lng: -86.9119,
    description: 'Cozy home with modern amenities, perfect for students or young professionals.',
    amenities: 'AC, Heating, WiFi, Storage',
    owner: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    blockchainVerified: true
  },
  {
    id: 3,
    address: '789 Grant St, West Lafayette, IN 47906',
    price: 1500,
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 1800,
    isAvailable: true,
    lat: 40.4289,
    lng: -86.9140,
    description: 'Large family home with backyard, perfect for families or groups.',
    amenities: 'Backyard, Garage, Dishwasher, Washer/Dryer',
    owner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    blockchainVerified: true
  },
  {
    id: 4,
    address: '321 Salisbury St, West Lafayette, IN 47906',
    price: 850,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    isAvailable: true,
    lat: 40.4276,
    lng: -86.9093,
    description: 'Affordable studio apartment, walking distance to campus.',
    amenities: 'WiFi, Parking, Laundry',
    owner: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
    blockchainVerified: true
  }
];

// Mock Web3 Service
const mockWeb3 = {
  account: null,
  connected: false,
  
  async connect() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0];
        this.connected = true;
        return { success: true, account: this.account };
      } else {
        // Mock connection for demo
        this.account = '0x' + Math.random().toString(16).substr(2, 40);
        this.connected = true;
        return { success: true, account: this.account };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  async signLease(propertyId, duration, rent) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      leaseId: Math.floor(Math.random() * 10000),
      gasUsed: Math.floor(Math.random() * 100000) + 50000
    };
  },
  
  async createListing(data) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      listingId: Math.floor(Math.random() * 10000)
    };
  }
};

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [properties, setProperties] = useState(sampleProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const connectWallet = async () => {
    const result = await mockWeb3.connect();
    if (result.success) {
      setWalletConnected(true);
      setWalletAddress(result.account);
    } else {
      alert(result.error || 'Failed to connect wallet');
    }
  };

  const handleSignLease = async (property) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    const result = await mockWeb3.signLease(property.id, 12, property.price);
    setIsProcessing(false);

    if (result.success) {
      alert(`✅ Lease Signed Successfully!\n\nTransaction Hash: ${result.transactionHash}\nLease ID: ${result.leaseId}\nGas Used: ${result.gasUsed}\n\nYour lease has been recorded on the blockchain.`);
      setSelectedProperty(null);
    } else {
      alert('Failed to sign lease: ' + result.error);
    }
  };

  const handleListProperty = async (formData) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    const result = await mockWeb3.createListing(formData);
    setIsProcessing(false);

    if (result.success) {
      alert(`✅ Property Listed Successfully!\n\nTransaction Hash: ${result.transactionHash}\nListing ID: ${result.listingId}\n\nYour property is now on the blockchain.`);
      
      const newProperty = {
        id: result.listingId,
        ...formData,
        isAvailable: true,
        owner: walletAddress,
        blockchainVerified: true
      };
      
      setProperties([...properties, newProperty]);
      setShowListingForm(false);
    }
  };

  const titleOpacity = Math.max(0, 1 - scrollPosition / 400);
  const mapVisible = scrollPosition > 100;

  const filteredProperties = properties.filter(p => 
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Hero Section */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: scrollPosition > 600 ? -1 : 1
      }}>
        {/* Sky Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '10%',
          background: 'linear-gradient(180deg, #87CEEB 0%, rgba(135, 206, 235, 0.5) 70%, transparent 100%)',
          zIndex: 2
        }} />
        
        {/* 3D Map Background using Google Maps */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: mapVisible ? 1 : 0.3,
          transition: 'opacity 0.5s ease'
        }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12114.089489793595!2d-86.91348!3d40.42586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1699564800000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'brightness(0.7) saturate(1.2)' }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>

        {/* Brand Name */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center',
          opacity: titleOpacity,
          transition: 'opacity 0.3s ease'
        }}>
          <h1 style={{
            fontSize: '96px',
            fontWeight: 800,
            color: 'white',
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
            letterSpacing: '-2px',
            margin: 0
          }}>
            HomeChain
          </h1>
          <p style={{
            fontSize: '24px',
            color: 'white',
            marginTop: '16px',
            textShadow: '0 2px 15px rgba(0,0,0,0.8)',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            Blockchain-Powered Rentals in West Lafayette
          </p>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: '24px',
            left: '24px',
            zIndex: 100,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
        >
          <div style={{ width: '24px', height: '2px', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '24px', height: '2px', background: 'white', borderRadius: '2px' }} />
          <div style={{ width: '24px', height: '2px', background: 'white', borderRadius: '2px' }} />
        </button>
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-320px',
        width: '320px',
        height: '100vh',
        background: 'white',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 200,
        transition: 'left 0.3s ease',
        overflowY: 'auto'
      }}>
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '8px'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ padding: '60px 24px 24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            color: '#1e40af'
          }}>
            <Home size={32} />
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>HomeChain</h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <SidebarButton
              icon={<Search size={20} />}
              text="Browse Properties"
              onClick={() => {
                setSidebarOpen(false);
                window.scrollTo({ top: 900, behavior: 'smooth' });
              }}
            />
            <SidebarButton
              icon={<MapPin size={20} />}
              text="Interactive Map"
              onClick={() => {
                setShowMapView(true);
                setSidebarOpen(false);
              }}
            />
            <SidebarButton
              icon={<FileText size={20} />}
              text="List Property"
              onClick={() => {
                setShowListingForm(true);
                setSidebarOpen(false);
              }}
            />
          </nav>

          <div style={{
            marginTop: 'auto',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            {walletConnected ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#f0fdf4',
                borderRadius: '8px',
                color: '#166534',
                fontWeight: 500,
                fontSize: '14px'
              }}>
                <Shield size={20} color="#10b981" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gradient Transition */}
      <div style={{
        position: 'relative',
        height: '200px',
        background: 'linear-gradient(180deg, transparent 0%, #f9fafb 100%)',
        marginTop: '100vh',
        zIndex: 2
      }} />

      {/* Properties Section */}
      <div style={{
        position: 'relative',
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '60px 0',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 700,
              marginBottom: '24px',
              color: '#111827'
            }}>
              Available Properties
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              maxWidth: '500px'
            }}>
              <Search size={20} color="#6b7280" />
              <input
                type="text"
                placeholder="Search by address or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  background: 'transparent'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onSignLease={handleSignLease}
          walletConnected={walletConnected}
          isProcessing={isProcessing}
        />
      )}

      {/* List Property Form */}
      {showListingForm && (
        <ListPropertyForm
          onClose={() => setShowListingForm(false)}
          onSubmit={handleListProperty}
          isProcessing={isProcessing}
        />
      )}

      {/* Interactive Map */}
      {showMapView && (
        <InteractiveMapModal
          properties={properties}
          onClose={() => setShowMapView(false)}
          onPropertyClick={setSelectedProperty}
        />
      )}
    </div>
  );
}

function SidebarButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: '#f3f4f6',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s',
        color: '#374151',
        width: '100%',
        textAlign: 'left'
      }}
      onMouseOver={(e) => {
        e.target.style.background = '#e5e7eb';
        e.target.style.transform = 'translateX(4px)';
      }}
      onMouseOut={(e) => {
        e.target.style.background = '#f3f4f6';
        e.target.style.transform = 'translateX(0)';
      }}
    >
      {icon}
      {text}
    </button>
  );
}

function PropertyCard({ property, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        background: `url(https://source.unsplash.com/800x600/?house,apartment,${property.id}) center/cover`,
        backgroundColor: '#e5e7eb'
      }}>
        {property.isAvailable && (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '6px 12px',
            background: '#10b981',
            color: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            Available
          </span>
        )}
        {property.blockchainVerified && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '6px 10px',
            background: 'rgba(30, 64, 175, 0.9)',
            color: 'white',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Shield size={14} />
            Verified
          </span>
        )}
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#1e40af',
          marginBottom: '8px'
        }}>
          ${property.price}/mo
        </div>
        
        <div style={{
          color: '#6b7280',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {property.address}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          color: '#374151',
          fontSize: '14px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bed size={16} /> {property.bedrooms}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bath size={16} /> {property.bathrooms}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Square size={16} /> {property.sqft}
          </span>
        </div>
      </div>
    </div>
  );
}

function PropertyModal({ property, onClose, onSignLease, walletConnected, isProcessing }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.75)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <X size={24} />
        </button>

        <div style={{
          width: '100%',
          height: '400px',
          background: `url(https://source.unsplash.com/1200x800/?house,apartment,${property.id}) center/cover`,
          backgroundColor: '#e5e7eb',
          position: 'relative'
        }}>
          {property.blockchainVerified && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(16, 185, 129, 0.95)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Shield size={18} />
              Blockchain Verified
            </div>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{
                fontSize: '36px',
                color: '#1e40af',
                margin: '0 0 8px 0'
              }}>
                ${property.price}/month
              </h2>
              <p style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                margin: 0
              }}>
                <MapPin size={18} />
                {property.address}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '32px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Bed size={32} color="#374151" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{property.bedrooms}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Bedrooms</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Bath size={32} color="#374151" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{property.bathrooms}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Bathrooms</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Square size={32} color="#374151" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '18px', fontWeight: 600 }}>{property.sqft}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Sq Ft</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#111827' }}>Description</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
              {property.description}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#111827' }}>Amenities</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {property.amenities.split(',').map((amenity, i) => (
                <span key={i} style={{
                  padding: '8px 16px',
                  background: '#e0f2fe',
                  color: '#0c4a6e',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {amenity.trim()}
                </span>
              ))}
            </div>
          </div>

          {property.blockchainVerified && (
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #86efac'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                color: '#166534',
                fontWeight: 600
              }}>
                <Shield size={20} />
                Blockchain Security Features
              </div>
              <ul style={{
                margin: '8px 0 0 0',
                paddingLeft: '24px',
                fontSize: '14px',
                color: '#166534',
                lineHeight: '1.8'
              }}>
                <li>Smart contract lease agreement</li>
                <li>Immutable transaction history</li>
                <li>Automated payment processing</li>
                <li>Decentralized dispute resolution</li>
              </ul>
            </div>
          )}

          {property.isAvailable && (
            <>
              <button
                onClick={() => onSignLease(property)}
                disabled={isProcessing || !walletConnected}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: (walletConnected && !isProcessing) 
                    ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' 
                    : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: (walletConnected && !isProcessing) ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => {
                  if (walletConnected && !isProcessing) {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {isProcessing ? (
                  <>
                    <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing Transaction...
                  </>
                ) : walletConnected ? (
                  <>
                    <FileText size={20} />
                    Sign Smart Contract Lease
                  </>
                ) : (
                  'Connect Wallet to Rent'
                )}
              </button>

              {!walletConnected && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#92400e',
                  textAlign: 'center'
                }}>
                  ⚠️ Please connect your Web3 wallet to proceed with rental
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ListPropertyForm({ onClose, onSubmit, isProcessing }) {
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    amenities: '',
    lat: 40.4259,
    lng: -86.9081,
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    
    // Store files
    setFormData({...formData, images: [...formData.images, ...files]});
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData({...formData, images: newImages});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      sqft: parseInt(formData.sqft)
    };
    
    onSubmit(submitData);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.75)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '32px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '28px', marginBottom: '24px', color: '#111827' }}>
          List Your Property
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151'
            }}>
              Property Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, West Lafayette, IN 47906"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151'
              }}>
                Monthly Rent ($)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="1200"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151'
              }}>
                Square Feet
              </label>
              <input
                type="number"
                required
                value={formData.sqft}
                onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                placeholder="1400"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151'
              }}>
                Bedrooms
              </label>
              <input
                type="number"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                placeholder="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151'
              }}>
                Bathrooms
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                placeholder="2"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151'
            }}>
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your property..."
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151'
            }}>
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              required
              value={formData.amenities}
              onChange={(e) => setFormData({...formData, amenities: e.target.value})}
              placeholder="Parking, Laundry, WiFi"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{
            background: '#eff6ff',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              color: '#1e40af',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              <Shield size={18} />
              Blockchain Registration
            </div>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#1e40af',
              lineHeight: '1.5'
            }}>
              Your property will be registered on the blockchain as a smart contract, ensuring transparency and security for all transactions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '14px',
                background: isProcessing 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? (
                <>
                  <Loader size={18} />
                  Processing...
                </>
              ) : (
                'List Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InteractiveMapModal({ properties, onClose, onPropertyClick }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Initialize Google Map
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE';
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: WEST_LAFAYETTE_CENTER,
      zoom: 14,
      mapTypeId: 'satellite',
      tilt: 45,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    });

    // Add markers for each property
    properties.forEach(property => {
      const marker = new window.google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: map,
        title: property.address,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: property.isAvailable ? '#10b981' : '#ef4444',
          fillOpacity: 0.9,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1e40af;">${property.price}/mo</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${property.address}</p>
            <div style="font-size: 13px; color: #374151; margin-bottom: 8px;">
              ${property.bedrooms} bed • ${property.bathrooms} bath • ${property.sqft} sqft
            </div>
            <div style="display: inline-block; padding: 4px 8px; background: ${property.isAvailable ? '#d1fae5' : '#fee2e2'}; color: ${property.isAvailable ? '#065f46' : '#991b1b'}; border-radius: 4px; font-size: 12px; font-weight: 600;">
              ${property.isAvailable ? 'Available' : 'Rented'}
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onPropertyClick(property);
      });
    });

    setMapLoaded(true);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.75)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '1400px',
          width: '100%',
          height: '90vh',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <X size={24} />
        </button>

        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px'
          }}
        />

        {!mapLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Loader size={48} color="#1e40af" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading interactive map...</p>
          </div>
        )}

        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          fontSize: '14px',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <span>Rented</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
