'use client';

import React, { useState } from 'react';

interface QuickActionsPanelProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ 
  onRefresh, 
  isRefreshing, 
  currentTab, 
  onTabChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    { 
      id: 'refresh', 
      icon: '🔄', 
      label: 'Refresh', 
      action: onRefresh,
      isLoading: isRefreshing 
    },
    { 
      id: 'share', 
      icon: '📤', 
      label: 'Share', 
      action: () => navigator.share?.({ title: 'IPL Dashboard', url: window.location.href }) 
    }
  ];

  const quickTabs = [
    { id: 'live', icon: '🏏', label: 'Live' },
    { id: 'points', icon: '📊', label: 'Table' },
    { id: 'schedule', icon: '🗓️', label: 'Schedule' },
    { id: 'stats', icon: '📈', label: 'Stats' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-2">
          {/* Quick Tab Switcher */}
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Quick Tabs</h3>
            <div className="grid grid-cols-2 gap-1">
              {quickTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsExpanded(false);
                  }}
                  className={`p-2 rounded-lg transition-all duration-200 text-xs ${
                    currentTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  title={tab.label}
                >
                  <div className="text-sm">{tab.icon}</div>
                  <div className="text-xs font-medium mt-1">{tab.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Actions</h3>
            <div className="flex gap-1">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.action();
                    if (action.id !== 'refresh') setIsExpanded(false);
                  }}
                  disabled={action.isLoading}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-200 disabled:opacity-50 text-xs"
                  title={action.label}
                >
                  <div className={`text-sm ${action.isLoading ? 'animate-spin' : ''}`}>
                    {action.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Small Floating Action Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${isExpanded ? 'rotate-45' : ''}`}
        aria-label="Quick Actions"
        title="Quick Actions"
      >
        <span className="text-sm">{isExpanded ? '✕' : '⚡'}</span>
      </button>
    </div>
  );
};

export default QuickActionsPanel;
