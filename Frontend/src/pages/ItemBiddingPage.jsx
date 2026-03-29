// @owner Chinmay
// @feature Live bidding and bid history
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auctionService, bidService } from '../services/apiService';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ItemBiddingPage = () => {
  const { auctionId, itemId } = useParams();
  const navigate = useNavigate();
  const numericAuctionId = Number(auctionId);
  const numericItemId = Number(itemId);

  const [user, setUser] = useState(null);
  const [auction, setAuction] = useState(null);
  const [item, setItem] = useState(null);
  const [currentBid, setCurrentBid] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);   // seconds remaining, null = not computed yet

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (!user || Number.isNaN(numericAuctionId) || Number.isNaN(numericItemId)) {
      return;
    }

    const fetchPageData = async () => {
      try {
        setLoading(true);

        const [items, auctionDetails] = await Promise.all([
          auctionService.getItems(numericAuctionId),
          auctionService.getDetails(numericAuctionId).catch(() => null),
        ]);

        const matchedItem = items.find(entry => Number(entry.itemId) === numericItemId);

        if (!matchedItem) {
          setItem(null);
          setAuction(auctionDetails?.auction ?? null);
          return;
        }

        setItem(matchedItem);
        setAuction(auctionDetails?.auction ?? {
          auctionId: numericAuctionId,
          name: `Auction #${numericAuctionId}`,
          auctionType: 'CRICKET',
          status: 'UPCOMING',
        });
      } catch (error) {
        console.error('Error fetching item data:', error);
        toast.error('Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [user, numericAuctionId, numericItemId]);

  useEffect(() => {
    if (!item || Number.isNaN(numericAuctionId) || Number.isNaN(numericItemId)) {
      return;
    }

    const fetchBidData = async () => {
      try {
        const [latestBidData, bidHistoryData] = await Promise.all([
          bidService.getLatestBid(numericAuctionId, numericItemId).catch(() => null),
          bidService.getBidHistory(numericAuctionId, numericItemId).catch(() => []),
        ]);

        setCurrentBid(latestBidData || null);
        setBidHistory(Array.isArray(bidHistoryData) ? bidHistoryData : []);
      } catch (error) {
        console.error('Error fetching bid data:', error);
        toast.error('Failed to fetch bid data');
      }
    };

    fetchBidData();
  }, [item, numericAuctionId, numericItemId]);

  // ── Poll bid data + item/auction status every 3 s ──────────────────────────
  useEffect(() => {
    if (!item || Number.isNaN(numericAuctionId) || Number.isNaN(numericItemId)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const [latest, historyData, allItems, details] = await Promise.all([
          bidService.getLatestBid(numericAuctionId, numericItemId).catch(() => null),
          bidService.getBidHistory(numericAuctionId, numericItemId).catch(() => []),
          auctionService.getItems(numericAuctionId).catch(() => []),
          auctionService.getDetails(numericAuctionId).catch(() => null),
        ]);
        setCurrentBid(latest || null);
        setBidHistory(Array.isArray(historyData) ? historyData : []);

        // Reflect latest item status (SOLD detection)
        const freshItem = allItems.find(i => Number(i.itemId) === numericItemId);
        if (freshItem) setItem(freshItem);

        // Reflect latest auction status (COMPLETED detection)
        if (details?.auction) setAuction(details.auction);
      } catch (error) {
        console.error('Error polling bid data', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [item, numericAuctionId, numericItemId]);

  // ── Countdown timer: based on when auction actually went LIVE ────────────────
  useEffect(() => {
    if (!auction?.durationMinutes) return;
    // startedAt is set by backend when status → LIVE
    // Fall back to Date.now() so timer still works if startedAt is missing
    const liveTimestamp = auction.startedAt
      ? new Date(auction.startedAt).getTime()
      : Date.now();
    const endTime = liveTimestamp + auction.durationMinutes * 60 * 1000;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [auction?.startedAt, auction?.durationMinutes]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const refreshBidData = async () => {
    const [latestBidData, bidHistoryData] = await Promise.all([
      bidService.getLatestBid(numericAuctionId, numericItemId).catch(() => null),
      bidService.getBidHistory(numericAuctionId, numericItemId).catch(() => []),
    ]);

    setCurrentBid(latestBidData || null);
    setBidHistory(Array.isArray(bidHistoryData) ? bidHistoryData : []);
  };

  const topBid = Math.max(item?.startingPrice ?? 0, currentBid?.bidAmount ?? 0);
  const minBidAmount = topBid + 1000;

  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (amount >= minBidAmount) {
      setShowConfirmModal(true);
    }
  };

  const confirmBid = async () => {
    if (!user || !item) {
      return;
    }

    const amount = Number(bidAmount);
    if (Number.isNaN(amount) || amount < minBidAmount) {
      toast.error('Enter a valid bid amount');
      return;
    }

    try {
      setIsSubmitting(true);
      await bidService.placeBid({
        auctionId: numericAuctionId,
        itemId: numericItemId,
        bidderId: user.userId,
        bidAmount: amount
      });

      await refreshBidData();
      setBidAmount('');
      setShowConfirmModal(false);
      toast.success('Bid placed successfully');
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidBid = bidAmount && Number(bidAmount) > topBid && Number(bidAmount) >= minBidAmount;
  const auctionTypeVariant = auction?.auctionType ? auction.auctionType.toLowerCase() : 'default';
  const auctionStatusVariant = auction?.status ? auction.status.toLowerCase() : 'default';

  // Derived state for UI guards
  const itemSold       = item?.status === 'SOLD';
  const auctionEnded   = auction?.status === 'COMPLETED';
  const biddingBlocked = itemSold || auctionEnded;

  // Format time remaining
  const timerMinutes = timeLeft !== null ? Math.floor(timeLeft / 60) : '--';
  const timerSeconds = timeLeft !== null ? String(timeLeft % 60).padStart(2, '0') : '--';
  const timerExpired = timeLeft === 0;
  const timerLow     = timeLeft !== null && timeLeft > 0 && timeLeft < 60;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
        <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="text-center">
            <Card.Body className="p-10 space-y-4">
              <h2 className="text-2xl font-bold text-white">Item not found</h2>
              <p className="text-[var(--color-text-secondary)]">The requested item does not belong to this auction.</p>
              <Button variant="primary" onClick={() => navigate(`/auctions/${auctionId}`)}>
                Back to Auction
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
      <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/auctions/${auctionId}`)}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Auction
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-slate-700 to-slate-800">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={item.status.toLowerCase()} size="lg">
                    {item.status}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{item.name}</h1>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <span>{auction?.name || `Auction #${auctionId}`}</span>
                    </div>
                  </div>
                  <Badge variant={auctionTypeVariant}>
                    {auction?.auctionType || 'Auction'}
                  </Badge>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-[var(--color-text-primary)] leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-1">Starting Price</p>
                      <p className="text-xl font-bold text-[var(--color-text-primary)]">{formatCurrency(item.startingPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-1">Minimum Bid Hint</p>
                      <p className="text-xl font-bold text-[var(--color-text-primary)]">{formatCurrency(topBid)}</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Next valid bid: {formatCurrency(minBidAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="text-xl font-bold text-white">Bid History</h3>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="divide-y divide-slate-700/50">
                  {bidHistory.length === 0 ? (
                    <div className="p-6 text-center text-[var(--color-text-muted)]">No bids yet</div>
                  ) : (
                    bidHistory.map((bid, index) => (
                      <div key={bid.bidId ?? `${bid.bidderId}-${bid.bidTime}`} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                                : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                            }`}>
                              {(bid.bidderName || 'U').charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{bid.bidderName || 'Unknown bidder'}</p>
                              <p className="text-sm text-[var(--color-text-muted)]">
                                {bid.bidTime ? new Date(bid.bidTime).toLocaleString() : 'Time unavailable'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${index === 0 ? 'text-emerald-400' : 'text-[var(--color-text-secondary)]'}`}>
                              {formatCurrency(bid.bidAmount)}
                            </p>
                            {index === 0 && (
                              <Badge variant="live" size="sm">Highest</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="space-y-6">

            {/* ── Countdown Timer ─────────────────────────────────── */}
            {auction?.durationMinutes && (
              <div className={`rounded-[var(--radius-lg)] p-4 text-center border ${
                timerExpired || auctionEnded
                  ? 'bg-red-900/20 border-red-500/40'
                  : timerLow
                  ? 'bg-amber-900/20 border-amber-500/40 animate-pulse'
                  : 'bg-indigo-900/20 border-indigo-500/30'
              }`}>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Time Remaining</p>
                <p className={`text-3xl font-bold font-mono ${
                  timerExpired || auctionEnded ? 'text-red-400' : timerLow ? 'text-amber-400' : 'text-indigo-300'
                }`}>
                  {timerExpired || auctionEnded ? 'Auction Ended' : `${timerMinutes}:${timerSeconds}`}
                </p>
              </div>
            )}

            {/* ── Auction Ended banner ─────────────────────────────── */}
            {auctionEnded && (
              <div className="rounded-[var(--radius-lg)] p-5 bg-red-900/30 border border-red-500/40 text-center">
                <p className="text-lg font-bold text-red-300">🏁 This auction has ended</p>
                <p className="text-sm text-red-400 mt-1">No more bids are being accepted.</p>
              </div>
            )}

            {/* ── Item Sold banner ─────────────────────────────────── */}
            {itemSold && !auctionEnded && (
              <div className="rounded-[var(--radius-lg)] p-5 bg-amber-900/30 border border-amber-500/40 text-center">
                <p className="text-lg font-bold text-amber-300">🔨 This item has been sold</p>
                <p className="text-sm text-amber-400 mt-1">The highest bidder has won this item.</p>
              </div>
            )}

            {/* ── Bid panel ────────────────────────────────────────── */}
            {!biddingBlocked && (
              <Card glow className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
                <Card.Body>
                  <div className="text-center mb-6">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">Current Highest Bid</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {formatCurrency(currentBid ? currentBid.bidAmount : item.startingPrice)}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[var(--color-text-secondary)] text-sm">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {(currentBid?.bidderName || 'N').charAt(0)}
                      </div>
                      <span>{currentBid ? `by ${currentBid.bidderName}` : 'No bids yet'}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {currentBid?.bidTime ? new Date(currentBid.bidTime).toLocaleString() : 'Be the first bidder'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                        Your Bid Amount
                      </label>
                      <Input
                        type="number"
                        placeholder={`Min: ${formatCurrency(minBidAmount)}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        disabled={biddingBlocked}
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Minimum bid hint: {formatCurrency(topBid)}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={!isValidBid || biddingBlocked}
                      onClick={handlePlaceBid}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Place Bid
                    </Button>

                    <div className="grid grid-cols-3 gap-2">
                      {[1000, 5000, 10000].map((increment) => (
                        <button
                          key={increment}
                          onClick={() => setBidAmount((minBidAmount + increment).toString())}
                          className="px-3 py-2 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-card)] rounded-lg text-sm text-[var(--color-text-primary)] hover:text-white transition-all border border-[var(--color-bg-elevated)] hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={biddingBlocked}
                        >
                          +Rs. {increment / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* ── Auction Information card ─────────────────────────── */}
            <Card>
              <Card.Header>
                <h3 className="font-bold text-white">Auction Information</h3>
              </Card.Header>
              <Card.Body className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Status</span>
                  <Badge variant={auctionStatusVariant} pulse={auction?.status === 'LIVE'}>
                    {auction?.status || 'UNKNOWN'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Item ID</span>
                  <span className="text-white font-semibold">{item.itemId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Bids</span>
                  <span className="text-white font-semibold">{bidHistory.length}</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <Card.Header>
              <h3 className="text-xl font-bold text-white">Confirm Your Bid</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <p className="text-[var(--color-text-primary)]">
                You are about to place a bid of <span className="font-bold text-indigo-400">{formatCurrency(Number(bidAmount))}</span> on:
              </p>
              <p className="font-semibold text-white">{item.name}</p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-400">
                  This bid is final and binding. Make sure you're ready to purchase if you win.
                </p>
              </div>
            </Card.Body>
            <Card.Footer className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmBid}
                loading={isSubmitting}
              >
                Confirm Bid
              </Button>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ItemBiddingPage;
