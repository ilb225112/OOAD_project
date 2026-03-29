import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUCTION_PATH } from "../constant";

const LiveAuction = () => {
    const [auctions, setAuctions] = useState([]);
    const [markingComplete, setMarkingComplete] = useState(null); // auctionId being completed
    const navigate = useNavigate();

    useEffect(() => {
        fetchLiveAuctions();
    }, []);

    const fetchLiveAuctions = async () => {
        try {
            const response = await fetch(`${AUCTION_PATH}/live`);
            if (!response.ok) throw new Error("Failed to fetch live auctions");
            const data = await response.json();
            setAuctions(data);
        } catch (error) {
            console.error("Error fetching live auctions:", error);
        }
    };

    const handleMarkComplete = async (auctionId) => {
        setMarkingComplete(auctionId);
        try {
            const response = await fetch(`${AUCTION_PATH}/${auctionId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" }),
            });
            if (!response.ok) throw new Error("Failed to update status");
            await fetchLiveAuctions(); // refresh — this auction disappears from Live
        } catch (error) {
            console.error("Error marking complete:", error);
            alert("Failed to mark auction as Completed. Check console.");
        } finally {
            setMarkingComplete(null);
        }
    };
    
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            Live Auctions
                            <span className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                        </h2>
                        <p className="text-[var(--color-text-secondary)]">Active auctions happening now</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {auctions.length === 0 ? (
                        <div className="bg-[var(--color-bg-card)] p-12 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-md)] text-center">
                            <p className="text-[var(--color-text-muted)] text-lg">No live auctions found.</p>
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
                                            Items
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[var(--color-info)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium"
                                            onClick={() => navigate(`/addItem/${auction.auctionId}`)}
                                        >
                                            Add Item
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium"
                                            onClick={() => navigate(`/host/${auction.auctionId}`)}
                                        >
                                            Host
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[var(--color-success)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium"
                                            onClick={() => navigate(`/live-bidder/${auction.auctionId}/${auction.name}`)}
                                        >
                                            Bidders
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[var(--color-warning,#f59e0b)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium disabled:opacity-50"
                                            onClick={() => handleMarkComplete(auction.auctionId)}
                                            disabled={markingComplete === auction.auctionId}
                                        >
                                            {markingComplete === auction.auctionId ? "Completing..." : "✅ Mark Complete"}
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

export default LiveAuction;
