import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/apiService';
import Navbar from '../components/layout/Navbar';       // ← shared layout navbar
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/**
 * Purchases — shows all items won by the logged-in user across ALL auctions.
 * Strategy: fetch registered auctions, then aggregate purchases from each.
 */
const Purchases = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Resolve user from localStorage ────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  // ── Fetch all purchases across all registered auctions ────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchAllPurchases = async () => {
      try {
        setLoading(true);
        // Step 1: get every auction this user is registered for
        const registered = await userService.getRegisteredAuctions(user.userId);

        // Step 2: for each auction, get items won by this user
        const results = await Promise.all(
          registered.map(a =>
            userService.getPurchases(user.userId, a.auctionId)
              .then(items => items.map(item => ({
                ...item,
                auctionName: a.auctionName ?? a.name ?? `Auction #${a.auctionId}`,
                auctionId: a.auctionId,
              })))
              .catch(() => [])   // silently skip failed auctions
          )
        );

        // Step 3: flatten
        setItems(results.flat());
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('Failed to load your purchases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPurchases();
  }, [user]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  const totalSpent = items.reduce((sum, item) => sum + (item.finalPrice ?? item.startingPrice ?? 0), 0);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <p className="text-[var(--color-error)] text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white rounded-[var(--radius-lg)]"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar user={user} onLogout={() => { localStorage.removeItem('user'); navigate('/login'); }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Purchases</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Items you have won across all auctions
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center p-5">
            <p className="text-3xl font-bold text-emerald-400">{items.length}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Items Won</p>
          </Card>
          <Card className="text-center p-5">
            <p className="text-3xl font-bold text-indigo-400">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Total Spent</p>
          </Card>
          <Card className="text-center p-5 col-span-2 md:col-span-1">
            <p className="text-3xl font-bold text-purple-400">
              {new Set(items.map(i => i.auctionId)).size}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Auctions</p>
          </Card>
        </div>

        {/* Items grid */}
        {items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Card key={`${item.auctionId}-${item.itemId ?? index}`} hover className="overflow-hidden">
                <Card.Body>
                  {/* Auction badge */}
                  <p className="text-xs text-[var(--color-text-muted)] mb-3 truncate">
                    🏛️ {item.auctionName}
                  </p>

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white leading-snug">{item.name ?? item.itemName}</h3>
                    <Badge variant="live" size="sm">SOLD</Badge>
                  </div>

                  {item.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-2 pt-4 border-t border-[var(--color-bg-elevated)]">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--color-text-muted)]">Starting Price</span>
                      <span className="text-[var(--color-text-secondary)]">
                        {formatCurrency(item.startingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--color-text-muted)]">Won At</span>
                      <span className="text-xl font-bold text-emerald-400">
                        {formatCurrency(item.finalPrice ?? item.startingPrice)}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-[var(--color-text-muted)] opacity-40 mb-4"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xl font-bold text-white mb-2">No purchases yet</p>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Win items by placing the highest bid before the timer runs out.
            </p>
            <button
              onClick={() => navigate('/auctions')}
              className="px-6 py-2 bg-gradient-to-r from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)]"
            >
              Browse Auctions
            </button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Purchases;
