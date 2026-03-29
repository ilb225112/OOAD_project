import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUCTION_PATH } from "../constant";

const CompletedAuction = () => {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompletedAuctions = async () => {
            try {
                const response = await fetch(`${AUCTION_PATH}/completed`);
                if (!response.ok) throw new Error("Failed to fetch completed auctions");
                const data = await response.json();
                setAuctions(data);
            } catch (error) {
                console.error("Error fetching completed auctions:", error);
            }
        };

        fetchCompletedAuctions();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[var(--color-bg-elevated)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Completed Auctions</h2>
                        <p className="text-[var(--color-text-secondary)]">Past auction results</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {auctions.length === 0 ? (
                        <div className="bg-[var(--color-bg-card)] p-12 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-md)] text-center">
                            <p className="text-[var(--color-text-muted)] text-lg">No completed auctions found.</p>
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
                                            onClick={() => navigate(`/completed-bidder/${auction.auctionId}/${auction.name}`)}
                                        >
                                            Bidders
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

export default CompletedAuction;
