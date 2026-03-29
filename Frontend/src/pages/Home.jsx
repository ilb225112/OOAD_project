// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with Frontend/src/pages/AuctionsListPage.jsx
// @owner Brunda
// @feature Auction browsing and registration
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from '../services/apiService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user exists in localStorage
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    navigate("/login");
    return null;
  }

  const userId = JSON.parse(storedUser).userId;

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    // Filter auctions based on search term
    const filtered = auctions.filter(auction =>
      auction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAuctions(filtered);
  }, [searchTerm, auctions]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const data = await userService.getUnregisteredAuctions(userId);
      setAuctions(data);
      setFilteredAuctions(data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  const registerForAuction = async (auctionId) => {
    const confirmRegister = window.confirm("Do you want to register for this auction?");
    if (!confirmRegister) return;
    try {
      await userService.registerForAuction(userId, auctionId);
      toast.success("Successfully registered for auction!");
      fetchAuctions();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Try again!");
    }
  };

  const getTimeUntilAuction = (auctionDate) => {
    const now = new Date();
    const auction = new Date(auctionDate);
    const diff = auction - now;
    
    if (diff < 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
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
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upcoming Auctions
        </h1>
        <p className="text-center text-gray-600 mb-6">Discover and register for exciting upcoming auctions</p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">
            {searchTerm ? "No auctions match your search" : "No auctions available"}
          </p>
          <Link 
            to="/bidderAuctions" 
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            View My Registered Auctions
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
                <h2 className="text-xl font-semibold text-gray-800 flex-1">{auction.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Upcoming
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
                
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Starts in: {getTimeUntilAuction(auction.auctionDate)}</span>
                </div>
              </div>

              <button
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                onClick={() => registerForAuction(auction.auctionId)}
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
