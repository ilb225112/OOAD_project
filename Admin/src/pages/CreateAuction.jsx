import React, { useState } from "react";
import { toast } from "react-toastify";
import { AUCTION_PATH } from "../constant";
import { useNavigate } from "react-router-dom";

const CreateAuction = () => {
  const [auctionType, setAuctionType] = useState("");
  const [auctionDate, setAuctionDate] = useState("");
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auctionTypes = [
    { value: 'CRICKET', label: 'Cricket', icon: '🏏', color: 'orange' },
    { value: 'ANTIQUES', label: 'Antiques', icon: '🏺', color: 'amber' },
    { value: 'REAL_ESTATE', label: 'Real Estate', icon: '🏢', color: 'cyan' },
    { value: 'KABADDI', label: 'Kabaddi', icon: '🤼', color: 'pink' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newAuction = { name, auctionType, auctionDate, durationMinutes: Number(durationMinutes) };

    try {
      const response = await fetch(`${AUCTION_PATH}/createAuction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAuction),
      });

      if (response.ok) {
        toast.success("Auction created successfully!");
        setAuctionType("");
        setAuctionDate("");
        setName("");
        setDurationMinutes(60);
        setTimeout(() => navigate('/upcomingAuctions'), 1000);
      } else {
        toast.error("Failed to create auction");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex justify-center items-center p-4">
      <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)] w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-xl)] mb-3 shadow-[var(--shadow-neu-md)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Create New Auction</h2>
          <p className="text-[var(--color-text-secondary)] mt-1">Set up a new auction event</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-3">Auction Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {auctionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setAuctionType(type.value)}
                  className={`p-4 rounded-[var(--radius-lg)] border-2 transition-all ${
                    auctionType === type.value
                      ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 shadow-[var(--shadow-neu-md)]'
                      : 'border-[var(--color-bg-elevated)] bg-[var(--color-bg-inset)] hover:border-[var(--color-bg-hover)] shadow-[var(--shadow-neu-inset-sm)]'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-2">Auction Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition"
              placeholder="Enter auction name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-2">Auction Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition"
              value={auctionDate}
              onChange={(e) => setAuctionDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-2">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="1440"
              className="w-full px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition"
              placeholder="e.g. 60"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">How long bidding is open once the auction goes live</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white py-3 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Auction'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
