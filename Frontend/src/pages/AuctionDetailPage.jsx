import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auctionService, userService } from '../services/apiService';
import { toast } from 'react-toastify';
import Navbar from '../components/layout/Navbar';
import ItemCard from '../components/auction/ItemCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';


/**
 * AuctionDetailPage - Connected to Backend
 * Shows detailed auction information and items
 * Allows users to register for auctions
 */
const AuctionDetailPage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auction, setAuction] = useState(null);
  const [items, setItems] = useState([]);
  
  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);
  
  // Fetch auction details and items
  useEffect(() => {
    if (user && auctionId) {
      fetchAuctionData();
    }
  }, [user, auctionId]);
  
  const fetchAuctionData = async () => {
    try {
      setLoading(true);

      const [details, itemsList, registeredAuctions] = await Promise.all([
        auctionService.getDetails(auctionId),
        auctionService.getItems(auctionId),
        userService.getRegisteredAuctions(user.userId),
      ]);

      // Use real auction data from /api/auctions/details/{id}
      const auctionData = details?.auction;
      if (auctionData) {
        setAuction({
          id: auctionData.auctionId,
          name: auctionData.name || `Auction #${auctionId}`,
          auctionType: auctionData.auctionType || 'CRICKET',
          status: auctionData.status || 'UPCOMING',
          dateTime: auctionData.auctionDate,
          description: 'No description available',
          organizer: 'Auction Platform',
          rules: [
            'All bids are final and binding',
            'Payment must be completed within 48 hours',
            'Items will be shipped within 7 business days',
            'Authenticity certificates provided for all items'
          ]
        });
      } else if (itemsList.length > 0) {
        // Fallback stub if details endpoint fails
        setAuction({
          id: parseInt(auctionId),
          name: `Auction #${auctionId}`,
          auctionType: 'CRICKET',
          status: 'UPCOMING',
          dateTime: new Date().toISOString(),
          description: 'No description available',
          organizer: 'Auction Platform',
          rules: [
            'All bids are final and binding',
            'Payment must be completed within 48 hours',
            'Items will be shipped within 7 business days',
            'Authenticity certificates provided for all items'
          ]
        });
      }

      setItems(itemsList.map(item => ({
        itemId: item.itemId,
        name: item.name || 'Unknown Item',
        description: item.description || 'No description',
        startingPrice: item.startingPrice,
        currentPrice: item.startingPrice,
        status: item.status || 'AVAILABLE',
        imageUrl: item.imageUrl
      })));

      const isUserRegistered = registeredAuctions.some(a => a.auctionId === parseInt(auctionId));
      setIsRegistered(isUserRegistered);

    } catch (error) {
      console.error('Error fetching auction data:', error);
      toast.error('Failed to fetch auction details');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleRegister = async () => {
    try {
      await userService.registerForAuction(user.userId, parseInt(auctionId));
      setIsRegistered(true);
      toast.success('Successfully registered for auction!');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Try again!');
    }
  };
  
  const filteredItems = items.filter(item =>
    (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading auction details...</p>
        </div>
      </div>
    );
  }
  
  if (!auction) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Card className="text-center p-8">
          <p className="text-[var(--color-text-secondary)]">Auction not found</p>
          <Button variant="primary" onClick={() => navigate('/auctions')} className="mt-4">
            Back to Auctions
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/auctions')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Auctions
        </button>
        
        {/* Auction Header */}
        <Card className="mb-8">
          <Card.Body className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant={(auction.status || 'upcoming').toLowerCase()} pulse={auction.status === 'LIVE'} size="lg">
                    {auction.status || 'UPCOMING'}
                  </Badge>
                  <Badge variant={(auction.auctionType || 'cricket').toLowerCase()} size="lg">
                    {auction.auctionType || 'Auction'}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">{auction.name}</h1>
                
                <div className="flex flex-wrap gap-6 text-[var(--color-text-secondary)] mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(auction.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Organized by {auction.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>{items.length} Items</span>
                  </div>
                </div>
                
                <p className="text-[var(--color-text-secondary)] text-lg">{auction.description}</p>
              </div>
              
              <div className="lg:w-80">
                {!isRegistered ? (
                  <Card className="bg-gradient-to-br from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border-[var(--color-accent-primary)]/30">
                    <Card.Body className="text-center space-y-4">
                      <div className="p-4 bg-[var(--color-accent-primary)]/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <svg className="w-10 h-10 text-[var(--color-accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Register to Bid</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm">Join this auction to start placing bids on items</p>
                      </div>
                      <Button variant="primary" size="lg" className="w-full" onClick={handleRegister}>
                        Register Now
                      </Button>
                    </Card.Body>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-[var(--color-success)]/10 to-emerald-600/10 border-[var(--color-success)]/30">
                    <Card.Body className="text-center space-y-4">
                      <div className="p-4 bg-[var(--color-success)]/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">You're Registered!</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm">You can now bid on all items in this auction</p>
                      </div>
                      <Badge variant="available" size="lg">Registered</Badge>
                    </Card.Body>
                  </Card>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--color-bg-elevated)]">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'items'
                ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'overview'
                ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'rules'
                ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Rules
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'items' && (
          <div>
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
            </div>
            
            {/* Items Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard 
                  key={item.itemId} 
                  item={item} 
                  auctionId={auctionId}
                  auctionStatus={auction.status}
                />
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <Card className="text-center py-12">
                <div className="text-[var(--color-text-muted)]">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg">No items found</p>
                </div>
              </Card>
            )}
          </div>
        )}
        
        {activeTab === 'overview' && (
          <Card>
            <Card.Body className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">About This Auction</h3>
              <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">{auction.description}</p>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Organizer</h4>
                  <p className="text-[var(--color-text-secondary)]">{auction.organizer}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Category</h4>
                  <Badge variant={(auction.auctionType || 'cricket').toLowerCase()}>{auction.auctionType || 'Auction'}</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
        
        {activeTab === 'rules' && (
          <Card>
            <Card.Body>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Auction Rules</h3>
              <ul className="space-y-4">
                {auction.rules.map((rule, index) => (
                  <li key={index} className="flex gap-3 text-[var(--color-text-secondary)]">
                    <svg className="w-6 h-6 text-[var(--color-accent-primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuctionDetailPage;
