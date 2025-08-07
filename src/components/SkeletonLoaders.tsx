'use client';

import React from 'react';

// Enhanced shimmer effect
const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const LiveMatchSkeleton = () => (
  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-blue-100 dark:border-blue-900">
    <div className="absolute top-4 right-4">
      <div className={`w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full ${shimmerClass}`}></div>
    </div>
    
    {/* Team 1 */}
    <div className="flex flex-col items-center flex-1 space-y-3">
      <div className={`w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-700 rounded-full ${shimmerClass}`}></div>
      <div className={`w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ${shimmerClass}`}></div>
      <div className={`w-24 h-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded ${shimmerClass}`}></div>
    </div>
    
    {/* VS */}
    <div className="flex flex-col items-center justify-center">
      <div className={`w-12 h-8 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-lg ${shimmerClass} flex items-center justify-center`}>
        <span className="text-purple-400 font-bold text-sm">VS</span>
      </div>
    </div>
    
    {/* Team 2 */}
    <div className="flex flex-col items-center flex-1 space-y-3">
      <div className={`w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 rounded-full ${shimmerClass}`}></div>
      <div className={`w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ${shimmerClass}`}></div>
      <div className={`w-24 h-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded ${shimmerClass}`}></div>
    </div>
    
    {/* Match Info */}
    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-4">
      <div className={`w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ${shimmerClass}`}></div>
      <div className={`w-16 h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ${shimmerClass}`}></div>
      <div className={`w-32 h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ${shimmerClass}`}></div>
    </div>
  </div>
);

export const PointsTableSkeleton = () => (
  <div className="overflow-x-auto">
    <div className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      {/* Enhanced Header */}
      <div className="flex gap-2 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-t-xl border-b border-blue-200 dark:border-blue-700">
        {['POS', 'TEAM', 'P', 'W', 'L', 'NR', 'NRR', 'FOR', 'AGAINST', 'PTS', 'FORM'].map((header, i) => (
          <div key={i} className={`flex-1 min-w-16 h-5 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-600 rounded ${shimmerClass}`}>
            <span className="text-xs text-blue-600 dark:text-blue-300 opacity-50 font-semibold">{header}</span>
          </div>
        ))}
      </div>
      
      {/* Enhanced Rows */}
      {[...Array(8)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          {/* Position */}
          <div className={`w-8 h-5 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-700 dark:to-yellow-600 rounded-full ${shimmerClass}`}></div>
          {/* Team with logo */}
          <div className="flex items-center gap-2 flex-1 min-w-32">
            <div className={`w-6 h-6 bg-gradient-to-br from-red-200 to-red-300 dark:from-red-700 dark:to-red-600 rounded-full ${shimmerClass}`}></div>
            <div className={`w-16 h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded ${shimmerClass}`}></div>
          </div>
          {/* Stats */}
          {[...Array(9)].map((_, cellIndex) => (
            <div key={cellIndex} className={`flex-1 min-w-12 h-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded ${shimmerClass}`}></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ScheduleSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-4 border border-blue-100 dark:border-blue-900">
        <div className="flex justify-between items-start mb-4">
          <div className="w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Team 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
            <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          
          {/* Team 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
            <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-32 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    ))}
  </div>
);
