import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ADMIN_PATH } from '../constant';

const UpcomingBidder = () => {
  const { auctionId, auctionName } = useParams();
  const [bidders, setBidders] = useState([]);

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

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[var(--color-info)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Registered Bidders: <span className="text-[var(--color-info)]">{auctionName}</span>
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
                  <th className="py-3 px-4 text-right text-[var(--color-text-primary)] font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bidders.length > 0 ? (
                  bidders.map((bidder) => (
                    <tr key={bidder.userId} className="border-b border-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)] transition">
                      <td className="py-3 px-4 text-[var(--color-text-primary)]">{bidder.name}</td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{bidder.email}</td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)] capitalize">{bidder.role}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteBidder(bidder.userId)}
                          className="px-3 py-1 bg-[var(--color-error)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-[var(--color-text-muted)]">No bidders found.</td>
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

export default UpcomingBidder;
