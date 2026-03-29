import api from './api';

// ─── Auction Service ───────────────────────────────────────────────────────────
export const auctionService = {
  getUpcoming: () => api.get('/api/auctions/upcoming').then(r => r.data),
  getLive: () => api.get('/api/auctions/live').then(r => r.data),
  getCompleted: () => api.get('/api/auctions/completed').then(r => r.data),
  getDetails: (auctionId) => api.get(`/api/auctions/details/${auctionId}`).then(r => r.data),
  createAuction: (data) => api.post('/api/auctions/createAuction', data).then(r => r.data),
  addItem: (auctionId, item) => api.post(`/api/auctions/addItem/${auctionId}`, item).then(r => r.data),
  getItems: (auctionId) => api.get(`/api/auctions/auctionItems/${auctionId}`).then(r => r.data),
};

// ─── Bid Service ───────────────────────────────────────────────────────────────
export const bidService = {
  getLatestBid: (auctionId, itemId) =>
    api.get(`/api/bids/latestBid/${auctionId}/${itemId}`).then(r => r.status === 204 ? null : r.data),
  getBidHistory: (auctionId, itemId) =>
    api.get(`/api/bids/bidHistory/${auctionId}/${itemId}`).then(r => r.data),
  placeBid: (bidData) => api.post('/api/bids/placeBid', bidData).then(r => r.data),
  sellItem: (itemId, data) => api.post(`/api/bids/sellItem/${itemId}`, data).then(r => r.data),
};

// ─── User Service ──────────────────────────────────────────────────────────────
export const userService = {
  register: (user) => api.post('/api/users/register', user).then(r => r.data),
  login: (credentials) => api.post('/api/users/login', credentials).then(r => r.data),
  getAll: () => api.get('/api/users/all').then(r => r.data),
  getUnregisteredAuctions: (userId) =>
    api.get(`/api/users/unregistered/${userId}`).then(r => r.data),
  registerForAuction: (userId, auctionId) =>
    api.post('/api/users/registerAuction', { userId, auctionId }).then(r => r.data),
  getRegisteredAuctions: (userId) =>
    api.get(`/api/users/registered/${userId}`).then(r => r.data),
  getPurchases: (userId, auctionId) =>
    api.get(`/api/users/purchases/${userId}/${auctionId}`).then(r => r.data),
  changePassword: (userId, oldPassword, newPassword) =>
    api.post(`/api/users/changePassword/${userId}`, { oldPassword, newPassword }).then(r => r.data),
};

// ─── Admin Service ─────────────────────────────────────────────────────────────
export const adminService = {
  getBidders: (auctionId) => api.get(`/api/admin/bidders/${auctionId}`).then(r => r.data),
  deleteBidder: (auctionId, userId) =>
    api.delete(`/api/admin/deleteBidder/${auctionId}/${userId}`).then(r => r.data),
};
