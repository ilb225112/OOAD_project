// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with No active replacement; this was a development showcase page
// @owner Bhavini
// @feature UI showcase and admin design experimentation
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import StatsCard from '../components/ui/StatsCard';

const ComponentShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131827] to-[#0a0e1a]">
      <Navbar user={{ name: 'Demo User', email: 'demo@example.com' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Component Showcase</h1>
          <p className="text-slate-400 text-lg">Preview all UI components</p>
        </div>
        
        <div className="space-y-12">
          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Buttons</h2>
            <Card>
              <Card.Body className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="xl">Extra Large</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                    With Icon
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </section>
          
          {/* Badges */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Badges</h2>
            <Card>
              <Card.Body>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="live" pulse>LIVE</Badge>
                  <Badge variant="upcoming">UPCOMING</Badge>
                  <Badge variant="completed">COMPLETED</Badge>
                  <Badge variant="sold">SOLD</Badge>
                  <Badge variant="available">AVAILABLE</Badge>
                  <Badge variant="cricket">CRICKET</Badge>
                  <Badge variant="antiques">ANTIQUES</Badge>
                  <Badge variant="real_estate">REAL ESTATE</Badge>
                  <Badge variant="kabaddi">KABADDI</Badge>
                </div>
              </Card.Body>
            </Card>
          </section>
          
          {/* Inputs */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Form Inputs</h2>
            <Card>
              <Card.Body className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error="Password is required"
                />
                <Select
                  label="Auction Type"
                  options={[
                    { value: 'cricket', label: 'Cricket' },
                    { value: 'antiques', label: 'Antiques' },
                    { value: 'real_estate', label: 'Real Estate' }
                  ]}
                  placeholder="Select type"
                />
              </Card.Body>
            </Card>
          </section>
          
          {/* Stats Cards */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Stats Cards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Auctions"
                value={45}
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
                color="indigo"
                trend="up"
                trendValue="+5 this month"
              />
              <StatsCard
                title="Live Auctions"
                value={8}
                icon={<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                color="emerald"
              />
            </div>
          </section>
          
          {/* Modal & Toast */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Modal & Toast</h2>
            <Card>
              <Card.Body className="space-y-4">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Show Modal
                </Button>
                <Button variant="secondary" onClick={() => setShowToast(true)}>
                  Show Toast
                </Button>
              </Card.Body>
            </Card>
          </section>
          
          {/* Loading States */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Loading States</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>
          
          {/* Empty State */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Empty State</h2>
            <Card>
              <EmptyState
                title="No items found"
                description="Try adjusting your filters or search query"
                actionLabel="Browse Auctions"
                action={() => alert('Action clicked')}
              />
            </Card>
          </section>
        </div>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>Confirm</Button>
          </div>
        }
      >
        <p className="text-slate-300">This is an example modal with custom content and footer.</p>
      </Modal>
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message="This is a success message!"
            type="success"
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ComponentShowcase;
