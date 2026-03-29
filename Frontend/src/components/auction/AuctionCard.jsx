import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  
  const getStatusVariant = (status) => {
    const statusMap = {
      'LIVE': 'live',
      'UPCOMING': 'upcoming',
      'COMPLETED': 'completed'
    };
    return statusMap[status] || 'default';
  };
  
  const getTypeVariant = (type) => {
    const typeMap = {
      'CRICKET': 'cricket',
      'ANTIQUES': 'antiques',
      'REAL_ESTATE': 'real_estate',
      'KABADDI': 'kabaddi'
    };
    return typeMap[type] || 'default';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card hover className="overflow-hidden group">
      {/* Header with gradient overlay */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--color-accent-primary)]/20 to-[var(--color-accent-gradient-end)]/20 overflow-hidden rounded-t-[var(--radius-2xl)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjYzNDgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={getStatusVariant(auction.status)} pulse={auction.status === 'LIVE'}>
            {auction.status}
          </Badge>
          <Badge variant={getTypeVariant(auction.auctionType)}>
            {auction.auctionType}
          </Badge>
        </div>
        
        {/* Gavel Icon */}
        <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-20 h-20 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
      </div>
      
      {/* Content */}
      <Card.Body className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
            {auction.name}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">
            {auction.description || 'No description available'}
          </p>
        </div>
        
        {/* Date & Time */}
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{formatDate(auction.dateTime)}</span>
        </div>
        
        {/* Items Count */}
        {auction.itemCount !== undefined && (
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium">{auction.itemCount} Items</span>
          </div>
        )}
      </Card.Body>
      
      {/* Footer */}
      <Card.Footer className="bg-[var(--color-bg-elevated)]">
        <Button 
          variant="primary" 
          className="w-full"
          onClick={() => navigate(`/auctions/${auction.id}`)}
        >
          View Auction
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default AuctionCard;
