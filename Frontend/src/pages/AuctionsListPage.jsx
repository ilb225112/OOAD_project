import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/apiService';
import { toast } from 'react-toastify';
import Navbar from '../components/layout/Navbar';
import AuctionCard from '../components/auction/AuctionCard';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';


/**
 * AuctionsListPage - Connected to Backend
 * Fetches real auction data from Spring Boot backend
 * Implements filtering and search functionality
 */
const AuctionsListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);
  
  // Fetch auctions from backend, then poll every 10 s for status changes
  useEffect(() => {
    if (!user) return;
    fetchAuctions();
    const id = setInterval(fetchAuctions, 10000);
    return () => clearInterval(id);
  }, [user]);
  
  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const [unregistered, registered] = await Promise.all([
        userService.getUnregisteredAuctions(user.userId),
        userService.getRegisteredAuctions(user.userId),
      ]);
      const unregMarked = unregistered.map(a => ({ ...a, isRegistered: false }));
      const regMarked = registered.map(a => ({ ...a, isRegistered: true }));
      setAuctions([...regMarked, ...unregMarked]);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast.error('Failed to fetch auctions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (auctionId) => {
    const confirmRegister = window.confirm('Do you want to register for this auction?');
    if (!confirmRegister) return;
    try {
      await userService.registerForAuction(user.userId, auctionId);
      toast.success('Successfully registered for auction!');
      fetchAuctions();
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Try again!');
    }
  };
  
  const auctionTypes = [
    { value: 'all', label: 'All Categories', icon: '🎯' },
    { value: 'CRICKET', label: 'Cricket', icon: '🏏' },
    { value: 'ANTIQUES', label: 'Antiques', icon: '🏺' },
    { value: 'REAL_ESTATE', label: 'Real Estate', icon: '🏢' },
    { value: 'KABADDI', label: 'Kabaddi', icon: '🤼' }
  ];
  
  // Map backend auction data to frontend format
  // NOTE: unregistered auctions return raw Auction entity (field: name, auctionType)
  //       registered auctions return BidderAuctionDTO    (field: auctionName, auctionType)
  const mappedAuctions = auctions.map(auction => ({
    id: auction.auctionId,
    name: auction.name ?? auction.auctionName ?? `Auction #${auction.auctionId}`,
    auctionType: auction.auctionType || 'CRICKET',
    status: (auction.status || 'UPCOMING').toUpperCase(),  // normalise case
    dateTime: auction.auctionDate,
    description: auction.description || 'No description available',
    itemCount: auction.itemCount || 0,
    isRegistered: auction.isRegistered
  }));
  
  const tabs = [
    { value: 'all', label: 'All Auctions', count: mappedAuctions.length },
    { value: 'LIVE', label: 'Live', count: mappedAuctions.filter(a => a.status === 'LIVE').length },
    { value: 'UPCOMING', label: 'Upcoming', count: mappedAuctions.filter(a => a.status === 'UPCOMING').length },
    { value: 'registered', label: 'My Auctions', count: mappedAuctions.filter(a => a.isRegistered).length }
  ];
  
  const filteredAuctions = mappedAuctions.filter(auction => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'registered' ? auction.isRegistered : auction.status === activeTab);
    const matchesType = selectedType === 'all' || auction.auctionType === selectedType;
    const matchesSearch = (auction.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (auction.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesType && matchesSearch;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading auctions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">Browse Auctions</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">Discover exclusive items across multiple categories</p>
        </div>
        
        {/* Filters Section */}
        <Card className="mb-8">
          <Card.Body className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {auctionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2 rounded-[var(--radius-lg)] font-medium transition-all ${
                      selectedType === type.value
                        ? 'bg-gradient-to-r from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white shadow-[var(--shadow-neu-md)]'
                        : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] shadow-[var(--shadow-neu-sm)]'
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[var(--radius-lg)] font-medium whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? 'bg-gradient-to-r from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white shadow-[var(--shadow-neu-md)]'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] shadow-[var(--shadow-neu-sm)]'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.value
                  ? 'bg-white/20'
                  : 'bg-[var(--color-bg-elevated)]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--color-text-secondary)]">
            Showing <span className="text-[var(--color-text-primary)] font-semibold">{filteredAuctions.length}</span> auctions
          </p>
        </div>
        
        {/* Auctions Grid */}
        {filteredAuctions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard 
                key={auction.id} 
                auction={auction}
                onRegister={!auction.isRegistered ? () => handleRegister(auction.id) : null}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <div className="text-[var(--color-text-muted)]">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-[var(--color-text-secondary)] mb-2">No auctions found</h3>
              <p className="text-[var(--color-text-muted)]">Try adjusting your filters or search query</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuctionsListPage;
