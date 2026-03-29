// @status MOCK - uses placeholder data. Needs real API wiring before submission.
// @owner Bhavini
// @api-needed GET /api/auctions/upcoming, GET /api/auctions/live, GET /api/auctions/completed, GET /api/users/all
// @feature Admin monitoring and dashboards
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalAuctions: 45,
    liveAuctions: 8,
    totalBidders: 1250,
    itemsSold: 342,
    revenue: 15750000
  });
  
  const [recentAuctions, setRecentAuctions] = useState([
    {
      id: 1,
      name: 'IPL 2024 Memorabilia',
      type: 'CRICKET',
      status: 'LIVE',
      items: 45,
      bidders: 128,
      revenue: 2500000
    },
    {
      id: 2,
      name: 'Vintage Antiques Collection',
      type: 'ANTIQUES',
      status: 'LIVE',
      items: 28,
      bidders: 85,
      revenue: 1800000
    },
    {
      id: 3,
      name: 'Premium Real Estate',
      type: 'REAL_ESTATE',
      status: 'UPCOMING',
      items: 12,
      bidders: 45,
      revenue: 0
    },
    {
      id: 4,
      name: 'Pro Kabaddi League Items',
      type: 'KABADDI',
      status: 'COMPLETED',
      items: 35,
      bidders: 92,
      revenue: 1200000
    }
  ]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: amount >= 10000000 ? 'compact' : 'standard'
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
      <Navbar user={{ name: 'Admin User', email: 'admin@auctionhub.com' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-[var(--color-text-secondary)]">Manage auctions, items, and monitor platform activity</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/auctions')}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            >
              Manage Auctions
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/create-auction')}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Create Auction
            </Button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Auctions"
            value={stats.totalAuctions}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            }
            color="indigo"
            trend="up"
            trendValue="+5 this month"
          />
          <StatsCard
            title="Live Auctions"
            value={stats.liveAuctions}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            color="emerald"
          />
          <StatsCard
            title="Total Bidders"
            value={stats.totalBidders}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="blue"
            trend="up"
            trendValue="+125 this week"
          />
          <StatsCard
            title="Items Sold"
            value={stats.itemsSold}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
            color="amber"
            trend="up"
            trendValue="+28 today"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue)}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="pink"
            trend="up"
            trendValue="+12% this month"
          />
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Auctions Table */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Auctions</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/auctions')}>
                  View All
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50 border-b border-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Auction
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Bidders
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {recentAuctions.map((auction) => (
                        <tr key={auction.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-white">{auction.name}</p>
                              <Badge variant={auction.type.toLowerCase()} size="sm" className="mt-1">
                                {auction.type}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={auction.status.toLowerCase()} pulse={auction.status === 'LIVE'}>
                              {auction.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-[var(--color-text-primary)]">{auction.items}</td>
                          <td className="px-6 py-4 text-[var(--color-text-primary)]">{auction.bidders}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-emerald-400">
                              {auction.revenue > 0 ? formatCurrency(auction.revenue) : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/admin/auctions/${auction.id}`)}
                                className="p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] rounded-lg transition-all"
                                title="View"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => navigate(`/admin/auctions/${auction.id}/edit`)}
                                className="p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] rounded-lg transition-all"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <h3 className="font-bold text-white">Quick Actions</h3>
              </Card.Header>
              <Card.Body className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/create-auction')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Create New Auction
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/add-items')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  }
                >
                  Add Items
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/reports')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  View Reports
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                >
                  Manage Users
                </Button>
              </Card.Body>
            </Card>
            
            {/* Platform Stats */}
            <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
              <Card.Header>
                <h3 className="font-bold text-white">Platform Health</h3>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-secondary)]">Active Users</span>
                    <span className="text-white font-semibold">892 / 1250</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '71%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-secondary)]">Server Load</span>
                    <span className="text-emerald-400 font-semibold">Low</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-secondary)]">Storage Used</span>
                    <span className="text-white font-semibold">45 / 100 GB</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
