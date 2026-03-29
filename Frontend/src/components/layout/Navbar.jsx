import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Navbar = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Auctions', path: '/auctions', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )},
    { name: 'My Auctions', path: '/my-auctions', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    )},
    { name: 'My Purchases', path: '/purchases', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )},
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-primary)] shadow-[var(--shadow-neu-md)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group py-4">
            <div className="p-2.5 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] group-hover:shadow-[var(--shadow-neu-hover)] transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] bg-clip-text text-transparent">
              AuctionHub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-all
                  hover:bg-[var(--color-bg-card)] hover:shadow-[var(--shadow-neu-sm)]
                  active:shadow-[var(--shadow-neu-active)]"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button 
              aria-label="View notifications"
              className="relative p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-full transition-all
              bg-[var(--color-bg-card)] shadow-[var(--shadow-neu-sm)]
              hover:shadow-[var(--shadow-neu-md)]
              active:shadow-[var(--shadow-neu-active)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--color-error)] rounded-full shadow-[0_0_8px_var(--shadow-glow-accent)]"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                aria-label="Open user menu"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 pr-4 rounded-[var(--radius-xl)] transition-all
                  bg-[var(--color-bg-card)] shadow-[var(--shadow-neu-sm)]
                  hover:shadow-[var(--shadow-neu-md)]
                  active:shadow-[var(--shadow-neu-active)]"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] flex items-center justify-center text-white font-bold shadow-[var(--shadow-neu-sm)]">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <svg className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[var(--color-bg-card)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)] overflow-hidden">
                  <div className="p-4 border-b border-[var(--color-bg-elevated)]">
                    <p className="font-semibold text-[var(--color-text-primary)]">{user?.name || 'User'}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-all
                      hover:bg-[var(--color-bg-elevated)] hover:shadow-[var(--shadow-neu-sm)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>

                  </div>
                  <div className="p-2 border-t border-[var(--color-bg-elevated)]">
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)] text-[var(--color-error)] hover:text-[#C0392B] font-medium transition-all w-full
                        hover:bg-[var(--color-error)]/10 hover:shadow-[var(--shadow-neu-sm)]"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-lg)] transition-all
                bg-[var(--color-bg-card)] shadow-[var(--shadow-neu-sm)]
                hover:shadow-[var(--shadow-neu-md)]"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-bg-elevated)] bg-[var(--color-bg-primary)]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-all
                  hover:bg-[var(--color-bg-card)] hover:shadow-[var(--shadow-neu-sm)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
