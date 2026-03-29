import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/apiService';
import { toast } from 'react-toastify';
import Navbar from '../components/layout/Navbar';
import StatsCard from '../components/ui/StatsCard';
import AuctionCard from '../components/auction/AuctionCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';


/**
 * BidderDashboard - Connected to Backend
 * Main dashboard for bidders showing stats, live auctions, and activity
 * Implements Observer pattern for real-time updates
 */
const BidderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    registeredAuctions: 0,
    upcomingAuctions: 0,
    liveAuctions: 0,
    itemsWon: 0
  });
  
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);
  
  // Fetch dashboard data once, then poll every 10 s for status changes
  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
    const id = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(id);
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const registered = await userService.getRegisteredAuctions(user.userId);

      // Use real DB status — not date math
      const liveCount     = registered.filter(a => a.status === 'LIVE').length;
      const upcomingCount = registered.filter(a => a.status === 'UPCOMING').length;

      setStats({
        registeredAuctions: registered.length,
        upcomingAuctions: upcomingCount,
        liveAuctions: liveCount,
        itemsWon: 0
      });

      const live = registered
        .filter(a => a.status === 'LIVE')
        .slice(0, 3)
        .map(a => ({
          id: a.auctionId,
          name: a.name,
          auctionType: a.auctionType || 'CRICKET',
          status: a.status,          // real status from DB
          dateTime: a.auctionDate,
          itemCount: a.itemCount || 0
        }));
      setLiveAuctions(live);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'won':
        return (
          <div className="p-2.5 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success-dark)] rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-sm)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'outbid':
        return (
          <div className="p-2.5 bg-gradient-to-br from-[var(--color-error)] to-[var(--color-error-dark)] rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-sm)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-sm)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Gradient Text */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--color-accent-gradient-start)] via-[var(--color-accent-primary)] to-[var(--color-accent-gradient-end)] bg-clip-text text-transparent">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)]">Here's what's happening with your auctions today</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Registered Auctions"
            value={stats.registeredAuctions}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            }
            color="blue"
            trend="up"
            trendValue={`${stats.registeredAuctions} total`}
          />
          <StatsCard
            title="Upcoming Auctions"
            value={stats.upcomingAuctions}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="purple"
          />
          <StatsCard
            title="Live Auctions"
            value={stats.liveAuctions}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="emerald"
            trend="up"
            trendValue={`${stats.liveAuctions} active now`}
          />
          <StatsCard
            title="Items Won"
            value={stats.itemsWon}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
            color="amber"
          />
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Auctions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-success)]"></span>
                </span>
                Live Auctions
              </h2>
              <button 
                onClick={() => navigate('/auctions')}
                className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] text-sm font-semibold transition-colors"
              >
                View All →
              </button>
            </div>
            
            {liveAuctions.length > 0 ? (
              <div className="grid gap-6">
                {liveAuctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <p className="text-[var(--color-text-secondary)]">No live auctions at the moment</p>
                <button
                  onClick={() => navigate('/auctions')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] transition-all"
                >
                  Browse Auctions
                </button>
              </Card>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Quick Actions</h2>
            
            <Card>
              <Card.Body className="space-y-3">
                <button 
                  onClick={() => navigate('/auctions')}
                  className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] text-left transition-all group shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)]"
                >
                  <div className="p-2 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-sm)]">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-[var(--color-text-primary)] font-medium">Browse Auctions</span>
                </button>
                
                <button 
                  onClick={() => navigate('/my-auctions')}
                  className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] text-left transition-all group shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)]"
                >
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-sm)]">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <span className="text-[var(--color-text-primary)] font-medium">My Auctions</span>
                </button>
                
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] text-left transition-all group shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)]"
                >
                  <div className="p-2 bg-gradient-to-br from-[var(--color-success)] to-emerald-700 rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-sm)]">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[var(--color-text-primary)] font-medium">My Profile</span>
                </button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidderDashboard;
