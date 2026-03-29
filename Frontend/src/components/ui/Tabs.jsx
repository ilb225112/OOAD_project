// @status LEGACY - not routed in current app. Safe to delete after team review.
// @replace-with No direct replacement; use page-specific navigation controls
// @owner Bhavini
// @feature Reusable UI navigation controls
import React, { useState } from 'react';

const Tabs = ({ tabs, defaultTab, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onChange) onChange(value);
  };
  
  return (
    <div className={className}>
      <div className="flex gap-2 p-2 bg-[var(--color-bg-inset)] rounded-[var(--radius-xl)] shadow-[var(--shadow-neu-inset-md)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`flex items-center gap-2 px-6 py-3 font-semibold whitespace-nowrap rounded-[16px] transition-all ${
              activeTab === tab.value
                ? 'bg-[#2d3436] text-[#ff6348] shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.03)]'
                : 'text-[#747d8c] hover:text-[#a4b0be]'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.value
                  ? 'bg-gradient-to-br from-[#ff6348] to-[#ff9f43] text-white'
                  : 'bg-[#2d3436] text-[#747d8c]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
