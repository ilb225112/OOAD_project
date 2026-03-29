// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with Frontend/src/pages/MyAuctionsPage.jsx
// @owner Chirag
// @feature Registered auctions, bidder onboarding, and purchases
import { useEffect, useState } from "react";
import { userService } from '../services/apiService';
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

const BidderAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedUser?.userId;

  useEffect(() => {
    fetchRegisteredAuctions();
  }, []);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredAuctions(auctions);
    } else {
      setFilteredAuctions(auctions.filter(auction => auction.status === statusFilter));
    }
  }, [statusFilter, auctions]);

  const fetchRegisteredAuctions = async () => {
    try {
      setLoading(true);
      const data = await userService.getRegisteredAuctions(userId);
      setAuctions(data);
      setFilteredAuctions(data);
    } catch (error) {
      console.error("Error fetching registered auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE": return "text-green-600 bg-green-100";
      case "UPCOMING": return "text-blue-600 bg-blue-100";
      case "COMPLETED": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getActionButton = (auction) => {
    switch (auction.status) {
      case "LIVE":
        return (
          <Link 
            to={`/live/${auction.auctionId}/${auction.auctionName}/${userId}`} 
            className="w-full block text-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg animate-pulse"
          >
            🔴 Join Live Auction
          </Link>
        );
      case "UPCOMING":
        return (
          <Link 
            to={`/auctionItems/${auction.auctionId}/${auction.auctionName}`} 
            className="w-full block text-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            View Items
          </Link>
        );
      case "COMPLETED":
        return (
          <Link 
            to={`/purchases/${auction.auctionId}/${auction.auctionName}/${userId}`} 
            className="w-full block text-center px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            View Purchases
          </Link>
        );
      default:
        return null;
    }
  };

  const getStatusStats = () => {
    return {
      all: auctions.length,
      live: auctions.filter(a => a.status === "LIVE").length,
      upcoming: auctions.filter(a => a.status === "UPCOMING").length,
      completed: auctions.filter(a => a.status === "COMPLETED").length
    };
  };

  const stats = getStatusStats();

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
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Registered Auctions
        </h1>
        <p className="text-center text-gray-600 mb-6">Track and participate in your registered auctions</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold text-purple-600">{stats.all}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Live</p>
            <p className="text-2xl font-bold text-green-600">{stats.live}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Upcoming</p>
            <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-500">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["All", "LIVE", "UPCOMING", "COMPLETED"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                statusFilter === status 
                  ? "bg-blue-600 text-white shadow-lg scale-105" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">
            {statusFilter === "All" 
              ? "You have not registered for any auctions" 
              : `No ${statusFilter.toLowerCase()} auctions`}
          </p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Discover Auctions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <div 
              key={auction.auctionId} 
              className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800 flex-1">{auction.auctionName}</h2>
                <span className={`${getStatusColor(auction.status)} text-xs font-semibold px-3 py-1 rounded-full`}>
                  {auction.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{new Date(auction.auctionDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              {getActionButton(auction)}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BidderAuctions;
