import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/design-system.css';
import ProtectedRoute from './components/ProtectedRoute';

// Neumorphic Pages (Primary)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BidderDashboard from './pages/BidderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuctionsListPage from './pages/AuctionsListPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import ItemBiddingPage from './pages/ItemBiddingPage';
import MyAuctionsPage from './pages/MyAuctionsPage';
import CreateAuctionPage from './pages/CreateAuctionPage';

// Backend-Connected Pages (To be transformed)
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BidderPanel from './pages/BidderPanel';
import Purchases from './pages/Purchases';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Bidder Routes - Neumorphic Design */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <BidderDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/auctions" element={
          <ProtectedRoute>
            <AuctionsListPage />
          </ProtectedRoute>
        } />
        
        <Route path="/auctions/:auctionId" element={
          <ProtectedRoute>
            <AuctionDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="/auctions/:auctionId/items/:itemId" element={
          <ProtectedRoute>
            <ItemBiddingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/my-auctions" element={
          <ProtectedRoute>
            <MyAuctionsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/purchases" element={
          <ProtectedRoute>
            <Purchases />
          </ProtectedRoute>
        } />
        
        {/* Live Bidding - Legacy (will be merged into ItemBiddingPage) */}
        <Route path="/live/:auctionId/:name/:userId" element={
          <ProtectedRoute>
            <BidderPanel />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes - Neumorphic Design */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/create-auction" element={
          <ProtectedRoute>
            <CreateAuctionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/auctions" element={
          <ProtectedRoute>
            <AuctionsListPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/auctions/:auctionId" element={
          <ProtectedRoute>
            <AuctionDetailPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
