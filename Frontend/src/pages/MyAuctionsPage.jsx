// @owner Chirag
// @feature Registered auctions and bidder activity
import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/apiService';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const MyAuctionsPage = () => {
  const navigate = useNavigate();
  const [registeredAuctions, setRegisteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('Please log in to view your auctions.');
      setLoading(false);
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  // Load + poll every 10 s  so status changes appear automatically
  const loadRegisteredAuctions = useCallback(async (userId) => {
    try {
      const data = await userService.getRegisteredAuctions(userId);
      setRegisteredAuctions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load registered auctions right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadRegisteredAuctions(user.userId);
    const id = setInterval(() => loadRegisteredAuctions(user.userId), 10000);
    return () => clearInterval(id);
  }, [user, loadRegisteredAuctions]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group by real DB status
  const liveAuctions      = registeredAuctions.filter(a => a.status === 'LIVE');
  const upcomingAuctions  = registeredAuctions.filter(a => a.status === 'UPCOMING');
  const completedAuctions = registeredAuctions.filter(a => a.status === 'COMPLETED');

  const AuctionCard = ({ auction }) => {
    const auctionId = auction.auctionId ?? auction.id;
    const status    = auction.status ?? 'UPCOMING';
    const type      = auction.auctionType ?? auction.type ?? 'AUCTION';
    const dateTime  = auction.auctionDate ?? auction.dateTime;
    const name      = auction.auctionName ?? auction.name ?? `Auction #${auctionId}`;
    const isCompleted = status === 'COMPLETED';

    return (
      <Card key={auctionId} hover className={`overflow-hidden ${isCompleted ? 'opacity-75' : ''}`}>
        <div className="flex flex-col md:flex-row">
          <div className={`md:w-48 h-32 md:h-auto flex items-center justify-center ${
            isCompleted
              ? 'bg-gradient-to-br from-slate-700/20 to-slate-800/20'
              : status === 'LIVE'
              ? 'bg-gradient-to-br from-emerald-600/20 to-teal-600/20'
              : 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20'
          }`}>
            <svg className={`w-16 h-16 ${isCompleted ? 'text-slate-400/50' : status === 'LIVE' ? 'text-emerald-400/50' : 'text-indigo-400/50'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <Badge variant={(status || 'upcoming').toLowerCase()} pulse={status === 'LIVE'}>
                    {status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[var(--color-text-secondary)] text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(dateTime)}
                  </span>
                  <Badge variant={(type || 'auction').toLowerCase()} size="sm">
                    {type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Completed banner */}
            {isCompleted && (
              <div className="mb-4 p-3 rounded-lg bg-slate-700/30 border border-slate-600/40 text-sm text-slate-300">
                🏁 This auction has ended. Check your purchases for items you won.
              </div>
            )}

            <div className="flex gap-3">
              {!isCompleted && (
                <Button variant="primary" onClick={() => navigate(`/auctions/${auctionId}`)}>
                  {status === 'LIVE' ? '⚡ Bid Now' : 'View Auction'}
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate(`/auctions/${auctionId}`)}>
                {isCompleted ? 'View Results' : 'View Details'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading your auctions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
        <div className="max-w-md text-center">
          <p className="text-xl text-white mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  const SectionHeader = ({ title, dot, count }) => (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        {dot && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
        )}
        {title}
      </h2>
      <span className="px-2.5 py-0.5 bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] text-sm rounded-full">
        {count}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
      <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Auctions</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Track the auctions you have registered for and your bidding activity.
          </p>
        </div>

        {registeredAuctions.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-[var(--color-text-muted)]">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-xl text-white mb-2">No registered auctions yet</p>
              <p className="text-[var(--color-text-secondary)] mb-6">Browse and register for auctions to see them here.</p>
              <Button variant="primary" onClick={() => navigate('/auctions')}>Browse Auctions</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-10">

            {/* ── Live ──────────────────────────────────────────────── */}
            {liveAuctions.length > 0 && (
              <section>
                <SectionHeader title="Live Now" dot count={liveAuctions.length} />
                <div className="grid gap-6">
                  {liveAuctions.map(a => <AuctionCard key={a.auctionId ?? a.id} auction={a} />)}
                </div>
              </section>
            )}

            {/* ── Upcoming ──────────────────────────────────────────── */}
            {upcomingAuctions.length > 0 && (
              <section>
                <SectionHeader title="Upcoming" count={upcomingAuctions.length} />
                <div className="grid gap-6">
                  {upcomingAuctions.map(a => <AuctionCard key={a.auctionId ?? a.id} auction={a} />)}
                </div>
              </section>
            )}

            {/* ── Completed ─────────────────────────────────────────── */}
            {completedAuctions.length > 0 && (
              <section>
                <SectionHeader title="Completed" count={completedAuctions.length} />
                <div className="grid gap-6">
                  {completedAuctions.map(a => <AuctionCard key={a.auctionId ?? a.id} auction={a} />)}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default MyAuctionsPage;
