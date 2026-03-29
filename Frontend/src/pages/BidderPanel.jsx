import { useState, useEffect } from "react";
import { auctionService, bidService } from '../services/apiService';

import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const BidderPanel = () => {
    const { auctionId, name, userId } = useParams();
    const [items, setItems] = useState([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [timer, setTimer] = useState(3600);
    const [intervalId, setIntervalId] = useState(null);
    const [allSold, setAllSold] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isPlacingBid, setIsPlacingBid] = useState(false);

    useEffect(() => {
    const fetchItems = async () => {
        try {
            const data = await auctionService.getItems(auctionId);
            const availableItems = data.filter(item => item.status !== "SOLD");
            if (availableItems.length === 0) setAllSold(true);
            setItems(availableItems);
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to fetch items");
        }
    };
        fetchItems();
    }, [auctionId]);

    useEffect(() => {
        if (items.length === 0 || allSold) return;
    
        const fetchLatestBid = async () => {
            try {
                const latestBid = await bidService.getLatestBid(auctionId, items[currentItemIndex].itemId);
                if (latestBid) {
                    const bidTime = new Date(latestBid.bidtime).getTime();
                    const currentTime = Date.now();
                    const remainingTime = Math.max(60 - (currentTime - bidTime) / 1000, 0);
                    setCurrentBid((prevBid) => {
                        if (!prevBid || latestBid.bidAmount > prevBid.bidAmount) {
                            setTimer(Math.floor(remainingTime));
                            return latestBid;
                        }
                        return prevBid;
                    });
                }
            } catch (error) {
                console.error("Error fetching latest bid:", error);
            }
        };

        const fetchBidHistory = async () => {
            try {
                const data = await bidService.getBidHistory(auctionId, items[currentItemIndex].itemId);
                setBidHistory(data || []);
            } catch (error) {
                console.error("Error fetching bid history:", error);
            }
        };
    
        fetchLatestBid();
        fetchBidHistory();
        const id = setInterval(() => {
            fetchLatestBid();
            fetchBidHistory();
        }, 1000);
        setIntervalId(id);
    
        return () => clearInterval(id);
    }, [currentItemIndex, items]);
    
    useEffect(() => {
        if (timer === 0) {
            sellItem();
        }
        const timerId = setInterval(() => setTimer(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(timerId);
    }, [timer]);

    const handleBidChange = (amount) => {
        setBidAmount(amount);
    };

    const quickBid = (increment) => {
        const bidAmountValue = currentBid 
            ? currentBid.bidAmount + increment
            : currentItem.startingPrice + increment;
        placeBidWithAmount(increment);
    };

    const placeBid = async () => {
        const bidIncrement = parseFloat(bidAmount);
        if (isNaN(bidIncrement) || bidIncrement <= 0) {
            toast.warning("Please enter a valid bid increment.");
            return;
        }
        await placeBidWithAmount(bidIncrement);
    };

    const placeBidWithAmount = async (bidIncrement) => {
        if (isPlacingBid) return;
        
        setIsPlacingBid(true);
        const bidAmountValue = currentBid 
            ? currentBid.bidAmount + bidIncrement
            : currentItem.startingPrice + bidIncrement;
    
        try {
            await bidService.placeBid({
                item: { itemId: items[currentItemIndex].itemId },
                auction: { auctionId: auctionId },
                bidder: { userId: userId },
                bidAmount: bidAmountValue
            });
            toast.success(`Bid placed: $${bidAmountValue}`);
            setBidAmount("");
        } catch (error) {
            console.error("Error placing bid:", error);
            toast.error("Failed to place bid.");
        } finally {
            setIsPlacingBid(false);
        }
    };

    const sellItem = async () => {
        if (!currentBid) return;
        console.log("Sell item called");
        try {
            await bidService.sellItem(items[currentItemIndex].itemId, {
                bidderId: currentBid.bidderId,
                bidAmount: currentBid.bidAmount,
            });
            toast.success("Item sold successfully!");
            moveToNextItem();
        } catch (error) {
            console.error("Error selling item:", error);
            toast.error("Failed to sell item.");
        }
    };

    const moveToNextItem = () => {
        console.log("Move to next Item called")
        clearInterval(intervalId);
        if (currentItemIndex + 1 < items.length) {
            setCurrentItemIndex(currentItemIndex + 1);
            setCurrentBid(null);
            setTimer(3600);
            setBidHistory([]);
        } else {
            setAllSold(true);
        }
    };

    if (allSold) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Auction Complete!</h2>
                    <p className="text-gray-600">All items have been sold.</p>
                </div>
            </div>
            </>
        );
    }
    
    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }
    
    const currentItem = items[currentItemIndex];

    return (
        <>
            <Navbar />
            <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 gap-6">
            {/* Main Auction Panel */}
            <div className="w-full lg:w-2/3 max-w-2xl">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">{name}</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Item {currentItemIndex + 1} of {items.length}</span>
                            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${timer < 10 ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
                                ⏱ {timer}s
                            </span>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentItem.name}</h3>
                            <p className="text-gray-600">{currentItem.description}</p>
                        </div>

                        {/* Current Bid Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                                <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                                <p className="text-3xl font-bold text-green-600">
                                    ${currentBid ? currentBid.bidAmount : currentItem.startingPrice}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">Leading Bidder</p>
                                <p className="text-lg font-semibold text-blue-600 truncate">
                                    {currentBid ? currentBid.bidderName : "No bids yet"}
                                </p>
                            </div>
                        </div>

                        {/* Quick Bid Buttons */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Quick Bid</p>
                            <div className="grid grid-cols-4 gap-2">
                                {[10, 25, 50, 100].map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => quickBid(amount)}
                                        disabled={isPlacingBid}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +${amount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Bid Input */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-gray-700">Custom Bid Increment</label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={bidAmount}
                                    onChange={(e) => handleBidChange(e.target.value)}
                                    className="flex-1 border-2 border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={placeBid}
                                    disabled={isPlacingBid}
                                    className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPlacingBid ? "Placing..." : "Place Bid"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bid History Sidebar */}
            <div className="w-full lg:w-1/3 max-w-md">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                        <h3 className="text-xl font-bold flex items-center justify-between">
                            <span>Bid History</span>
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{bidHistory.length} bids</span>
                        </h3>
                    </div>
                    <div className="p-4 max-h-[600px] overflow-y-auto">
                        {bidHistory.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>No bids yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {bidHistory.slice().reverse().map((bid, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-3 rounded-lg border-l-4 ${
                                            index === 0 
                                                ? 'bg-green-50 border-green-500' 
                                                : 'bg-gray-50 border-gray-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-gray-800">{bid.bidderName}</span>
                                            <span className={`font-bold ${index === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                                ${bid.bidAmount}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(bid.bidtime).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default BidderPanel;
