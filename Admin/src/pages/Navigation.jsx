import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = localStorage.getItem("admin");
        if (user) {
            setIsAuthenticated(true);
        } else {
            navigate('/login');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="bg-[var(--color-bg-card)] shadow-[var(--shadow-neu-md)] sticky top-0 z-50 border-b border-[var(--color-bg-elevated)]">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-sm)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">Admin Panel</span>
                    </Link>
                    
                    {isAuthenticated && (
                        <ul className="flex items-center gap-2">
                            <li>
                                <Link 
                                    to="/nextAuctions" 
                                    className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded-[var(--radius-md)] transition-all duration-200 font-medium"
                                >
                                    Upcoming
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/liveAuctions" 
                                    className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded-[var(--radius-md)] transition-all duration-200 font-medium flex items-center gap-1"
                                >
                                    <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                                    Live
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/completedAuctions" 
                                    className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded-[var(--radius-md)] transition-all duration-200 font-medium"
                                >
                                    Completed
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/createAuction" 
                                    className="px-4 py-2 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white rounded-[var(--radius-md)] shadow-[var(--shadow-neu-sm)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-200 font-medium flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    className="px-4 py-2 bg-[var(--color-bg-inset)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-neu-inset-sm)] hover:shadow-[var(--shadow-neu-inset-md)] transition-all duration-200 font-medium flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
