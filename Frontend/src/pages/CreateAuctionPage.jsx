// @status MOCK - uses placeholder data. Needs real API wiring before submission.
// @owner Brunda
// @api-needed POST /api/auctions/createAuction, POST /api/auctions/addItem/:auctionId
// @feature Auction creation and add-item flow
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CreateAuctionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    auctionType: 'CRICKET',
    dateTime: '',
    description: ''
  });
  
  const auctionTypes = [
    { value: 'CRICKET', label: 'Cricket', icon: '🏏', color: 'orange' },
    { value: 'ANTIQUES', label: 'Antiques', icon: '🏺', color: 'amber' },
    { value: 'REAL_ESTATE', label: 'Real Estate', icon: '🏢', color: 'cyan' },
    { value: 'KABADDI', label: 'Kabaddi', icon: '🤼', color: 'pink' }
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add API call here
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/auctions');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
      <Navbar user={{ name: 'Admin User', email: 'admin@auctionhub.com' }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Auction</h1>
          <p className="text-slate-400 text-lg">Set up a new auction and start adding items</p>
        </div>
        
        <Card glass>
          <form onSubmit={handleSubmit}>
            <Card.Body className="p-8 space-y-6">
              <Input
                label="Auction Name"
                type="text"
                placeholder="e.g., IPL 2024 Memorabilia Auction"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                }
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Auction Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {auctionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, auctionType: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.auctionType === type.value
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium text-white">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <Input
                label="Date & Time"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe your auction..."
                  required
                />
              </div>
            </Card.Body>
            
            <Card.Footer className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Create Auction
              </Button>
            </Card.Footer>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
