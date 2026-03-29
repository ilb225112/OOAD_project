import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUCTION_PATH } from "../constant";

const UpcomingAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [goingLive, setGoingLive] = useState(null); // auctionId currently being promoted
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const response = await fetch(`${AUCTION_PATH}/upcoming`);
            if (!response.ok) throw new Error("Failed to fetch auctions");
            const data = await response.json();
            setAuctions(data);
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    const handleGoLive = async (auctionId) => {
        setGoingLive(auctionId);
        try {
            const response = await fetch(`${AUCTION_PATH}/${auctionId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "LIVE" }),
            });
            if (!response.ok) throw new Error("Failed to update status");
            await fetchAuctions(); // refresh list — auction disappears from Upcoming
        } catch (error) {
            console.error("Error going live:", error);
            alert("Failed to mark auction as Live. Check console.");
        } finally {
            setGoingLive(null);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[var(--color-info)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Upcoming Auctions</h2>
                        <p className="text-[var(--color-text-secondary)]">Scheduled auctions</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {auctions.length === 0 ? (
                        <div className="bg-[var(--color-bg-card)] p-12 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-md)] text-center">
                            <p className="text-[var(--color-text-muted)] text-lg">No upcoming auctions found.</p>
                        </div>
                    ) : (
                        auctions.map((auction) => (
                            <div key={auction.auctionId} className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">{auction.name}</h3>
                                        <p className="text-[var(--color-text-secondary)]">Date: {new Date(auction.auctionDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className="px-4 py-2 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium"
                                            onClick={() => navigate(`/auction-items/${auction.auctionId}/${auction.name}`)}
                                        >
                                            All Items
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[var(--color-info)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium"
                                            onClick={() => navigate(`/addItem/${auction.auctionId}`)}
                                        >
                                            Add Item
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium"
                                            onClick={() => navigate(`/upcoming-bidder/${auction.auctionId}/${auction.name}`)}
                                        >
                                            Bidders
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[var(--color-success)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium disabled:opacity-50"
                                            onClick={() => handleGoLive(auction.auctionId)}
                                            disabled={goingLive === auction.auctionId}
                                        >
                                            {goingLive === auction.auctionId ? "Going Live..." : "🔴 Go Live"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingAuctions;
