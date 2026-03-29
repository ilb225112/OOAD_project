import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AUCTION_PATH } from "../constant";

const AuctionItems = () => {
    const { auctionId, auctionName } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${AUCTION_PATH}/auctionItems/${auctionId}`);
                if (!response.ok) throw new Error("Failed to fetch items");
                const data = await response.json();
                setItems(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoading(false);
            }
        };

        fetchItems();
    }, [auctionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p className="text-[var(--color-text-secondary)] text-lg">Loading items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{auctionName}</h1>
                        <p className="text-[var(--color-text-secondary)]">Auction items</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.itemId} className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-300">
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">{item.name}</h2>
                                <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-3">{item.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[var(--color-text-muted)] text-sm">Starting Price</span>
                                    <span className="text-[var(--color-text-primary)] font-semibold text-lg">₹{item.startingPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-bg-elevated)]">
                                    <span className="text-[var(--color-text-muted)] text-sm">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        item.status === "SOLD" 
                                            ? "bg-[var(--color-error)]/20 text-[var(--color-error)]" 
                                            : "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-[var(--color-bg-card)] p-12 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-md)] text-center">
                            <p className="text-[var(--color-text-muted)] text-lg">No items found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuctionItems;
