// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with Frontend/src/components/layout/Navbar.jsx
// @owner Chirag
// @feature Navigation for login, profile, and bidder flows
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUserId(JSON.parse(user).userId);
            setIsAuthenticated(true);
            setUserName(JSON.parse(user).name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="text-white text-2xl font-bold flex items-center hover:text-blue-200 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        AuctionHub
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex space-x-1 items-center">
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link 
                                        to="/login" 
                                        className={`px-4 py-2 rounded-md transition ${isActive('/login') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/register" 
                                        className={`px-4 py-2 rounded-md transition ${isActive('/register') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link 
                                        to="/" 
                                        className={`px-4 py-2 rounded-md transition ${isActive('/') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/bidderAuctions" 
                                        className={`px-4 py-2 rounded-md transition ${isActive('/bidderAuctions') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                    >
                                        My Auctions
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to={`/profile/${userId}`} 
                                        className={`px-4 py-2 rounded-md transition flex items-center ${location.pathname.includes('/profile') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {userName}
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={handleLogout} 
                                        className="px-4 py-2 rounded-md text-white hover:bg-red-500 transition flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMobileMenu}
                        className="md:hidden text-white focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <ul className="space-y-2">
                            {!isAuthenticated ? (
                                <>
                                    <li>
                                        <Link 
                                            to="/login" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2 rounded-md transition ${isActive('/login') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/register" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2 rounded-md transition ${isActive('/register') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link 
                                            to="/" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2 rounded-md transition ${isActive('/') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/bidderAuctions" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2 rounded-md transition ${isActive('/bidderAuctions') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                        >
                                            My Auctions
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to={`/profile/${userId}`} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2 rounded-md transition ${location.pathname.includes('/profile') ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-500'}`}
                                        >
                                            Profile ({userName})
                                        </Link>
                                    </li>
                                    <li>
                                        <button 
                                            onClick={handleLogout} 
                                            className="w-full text-left px-4 py-2 rounded-md text-white hover:bg-red-500 transition"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
