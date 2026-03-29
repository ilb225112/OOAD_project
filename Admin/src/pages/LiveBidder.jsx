import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ADMIN_PATH, USER_PATH } from '../constant';

const LiveBidder = () => {
  const { auctionId, auctionName } = useParams();
  const [bidders, setBidders] = useState([]);
  const [purchasesByUser, setPurchasesByUser] = useState({});

  useEffect(() => {
    fetchBidders();
  }, [auctionId]);

  const fetchBidders = () => {
    fetch(`${ADMIN_PATH}/bidders/${auctionId}`)
      .then(res => res.json())
      .then(data => setBidders(data))
      .catch(err => console.error("Error fetching bidders:", err));
  };

  const deleteBidder = (userId) => {
    if (window.confirm("Are you sure you want to remove this bidder from the auction?")) {
      fetch(`${ADMIN_PATH}/deleteBidder/${auctionId}/${userId}`, {
        method: 'DELETE'
      })
        .then(() => {
          setBidders(bidders.filter(b => b.userId !== userId));
        })
        .catch(err => console.error("Error deleting bidder:", err));
    }
  };

  const fetchPurchasedItems = async (userId) => {
    try {
      const res = await fetch(`${USER_PATH}/purchases/${userId}/${auctionId}`);
      const data = await res.json();
      setPurchasesByUser(prev => ({ ...prev, [userId]: data }));
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  const togglePurchaseBox = (userId) => {
    if (purchasesByUser[userId]) {
      setPurchasesByUser(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } else {
      fetchPurchasedItems(userId);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[var(--color-success)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Live Auction Bidders: <span className="text-[var(--color-success)]">{auctionName}</span>
              </h1>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[var(--color-bg-elevated)]">
                  <th className="py-3 px-4 text-left text-[var(--color-text-primary)] font-semibold">Name</th>
                  <th className="py-3 px-4 text-left text-[var(--color-text-primary)] font-semibold">Email</th>
                  <th className="py-3 px-4 text-left text-[var(--color-text-primary)] font-semibold">Role</th>
                  <th className="py-3 px-4 text-right text-[var(--color-text-primary)] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bidders.length > 0 ? (
                  bidders.map((bidder) => (
                    <React.Fragment key={bidder.userId}>
                      <tr className="border-b border-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)] transition">
                        <td className="py-3 px-4 text-[var(--color-text-primary)]">{bidder.name}</td>
                        <td className="py-3 px-4 text-[var(--color-text-secondary)]">{bidder.email}</td>
                        <td className="py-3 px-4 text-[var(--color-text-secondary)] capitalize">{bidder.role}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => togglePurchaseBox(bidder.userId)}
                            className="px-3 py-1 bg-[var(--color-info)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all text-sm font-medium"
                          >
                            {purchasesByUser[bidder.userId] ? 'Hide' : 'Purchase'}
                          </button>
                          <button
                            onClick={() => deleteBidder(bidder.userId)}
                            className="px-3 py-1 bg-[var(--color-error)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {purchasesByUser[bidder.userId] && (
                        <tr>
                          <td colSpan="4" className="p-4 bg-[var(--color-bg-inset)]">
                            <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-neu-inset-md)]">
                              <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-primary)]">Purchased Items:</h3>
                              {purchasesByUser[bidder.userId].length === 0 ? (
                                <p className="text-[var(--color-text-muted)]">No items purchased.</p>
                              ) : (
                                <ul className="space-y-3">
                                  {purchasesByUser[bidder.userId].map(item => (
                                    <li key={item.itemId} className="bg-[var(--color-bg-elevated)] p-4 rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)]">
                                      <p className="text-[var(--color-text-primary)] font-semibold mb-1">{item.name}</p>
                                      <p className="text-[var(--color-text-secondary)] text-sm mb-2">{item.description}</p>
                                      <p className="text-[var(--color-success)] font-semibold">Sold Price: ₹{item.startingPrice?.toLocaleString()}</p>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-[var(--color-text-muted)]">
                      No bidders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBidder;
