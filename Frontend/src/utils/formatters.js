// Currency formatter
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

// Compact currency formatter (e.g., ₹1.5Cr)
export const formatCurrencyCompact = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount);
};

// Date formatter
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', defaultOptions);
};

// Date and time formatter
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Relative time formatter (e.g., "2 minutes ago")
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

// Number formatter with commas
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    LIVE: 'emerald',
    UPCOMING: 'blue',
    COMPLETED: 'slate',
    AVAILABLE: 'emerald',
    SOLD: 'red'
  };
  return colors[status] || 'slate';
};

// Get auction type color
export const getAuctionTypeColor = (type) => {
  const colors = {
    CRICKET: 'orange',
    ANTIQUES: 'amber',
    REAL_ESTATE: 'cyan',
    KABADDI: 'pink'
  };
  return colors[type] || 'slate';
};
