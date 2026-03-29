// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with Frontend/src/pages/AuctionDetailPage.jsx
// @owner Brunda
// @feature Auction detail and item browsing
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AUCTION_PATH } from "../constant";
import Navbar from "../components/Navbar";

const AuctionItems = () => {
    const { auctionId, auctionName } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${AUCTION_PATH}/auctionItems/${auctionId}`);
                if (!response.ok) throw new Error("Failed to fetch items");
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [auctionId]);

    const filteredItems = filter === "All" 
        ? items 
        : items.filter(item => item.status === filter);

    const getStatusColor = (status) => {
        return status === "SOLD" ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100";
    };

    const stats = {
        total: items.length,
        available: items.filter(i => i.status !== "SOLD").length,
        sold: items.filter(i => i.status === "SOLD").length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/bidderAuctions" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to My Auctions
                    </Link>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {auctionName}
                    </h1>
                    <p className="text-gray-600">Browse auction items</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                        <p className="text-gray-600 text-sm">Total Items</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <p className="text-gray-600 text-sm">Available</p>
                        <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                        <p className="text-gray-600 text-sm">Sold</p>
                        <p className="text-2xl font-bold text-red-600">{stats.sold}</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex justify-center gap-2 mb-6">
                    {["All", "AVAILABLE", "SOLD"].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                filter === status 
                                    ? "bg-blue-600 text-white shadow-lg scale-105" 
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map(item => (
                            <div 
                                key={item.itemId} 
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-semibold text-gray-800 flex-1">{item.name}</h2>
                                    <span className={`${getStatusColor(item.status)} text-xs font-semibold px-3 py-1 rounded-full`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Starting Price</span>
                                    <span className="text-2xl font-bold text-green-600">${item.startingPrice}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-xl text-gray-600">No items found</p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default AuctionItems;
