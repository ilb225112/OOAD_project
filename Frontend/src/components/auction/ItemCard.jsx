import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const ItemCard = ({ item, auctionId, auctionStatus }) => {
  const navigate = useNavigate();
  const [currentBid, setCurrentBid] = useState(null);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const isLive = auctionStatus === 'LIVE';
  const isSold = item.status === 'SOLD';
  const isAvailable = item.status === 'AVAILABLE';
  
  return (
    <Card hover className="overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-[#2d3436] to-[#1e272e] overflow-hidden rounded-t-3xl">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-24 h-24 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={isSold ? 'sold' : 'available'} size="sm">
            {item.status}
          </Badge>
        </div>
        
        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-[#fc5c65] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white font-bold text-lg">SOLD</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <Card.Body className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-[#e1e8ed] mb-1 line-clamp-1 group-hover:text-[#ff6348] transition-colors">
            {item.name}
          </h3>
          <p className="text-[#a4b0be] text-sm line-clamp-2">
            {item.description}
          </p>
        </div>
        
        {/* Pricing Section */}
        <div className="space-y-2 pt-2 border-t border-[#2d3436]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wide font-semibold">Starting Price</span>
            <span className="text-sm font-bold text-[#a4b0be]">{formatCurrency(item.startingPrice)}</span>
          </div>
          
          {currentBid && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--color-text-secondary)] uppercase tracking-wide font-semibold">Current Bid</span>
              <span className="text-lg font-bold text-[#26de81]">{formatCurrency(currentBid.bidAmount)}</span>
            </div>
          )}
          
          {isSold && item.finalPrice && (
            <div className="flex justify-between items-center bg-gradient-to-br from-[#fc5c65]/10 to-[#eb3b5a]/10 -mx-6 px-6 py-2 border-y border-[#fc5c65]/20 rounded-[20px]">
              <span className="text-sm text-[var(--color-error)] uppercase tracking-wide font-bold">Final Price</span>
              <span className="text-xl font-bold text-[#fc5c65]">{formatCurrency(item.finalPrice)}</span>
            </div>
          )}
        </div>
      </Card.Body>
      
      {/* Footer */}
      <Card.Footer className="bg-[var(--color-bg-elevated)]">
        {isLive && isAvailable ? (
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => navigate(`/auctions/${auctionId}/items/${item.itemId}`)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Place Bid
          </Button>
        ) : isSold ? (
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => navigate(`/auctions/${auctionId}/items/${item.itemId}`)}
          >
            View Details
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(`/auctions/${auctionId}/items/${item.itemId}`)}
          >
            View Item
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ItemCard;
