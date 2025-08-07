'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PointsTableEntry {
  team: string;
  teamName?: string;
  played: number;
  won: number;
  lost: number;
  nr: number;
  nrr: number;
  points: number;
  for?: string;
  against?: string;
  recentForm?: string[];
  posChange?: 'up' | 'down' | 'same';
}

interface EnhancedPointsTableProps {
  table: PointsTableEntry[];
}

const teamColors: Record<string, string> = {
  CSK: '#FDB913',
  MI: '#004BA0',
  RCB: '#EC1E24',
  KKR: '#3A225D',
  SRH: '#FF822A',
  DC: '#282968',
  RR: '#EA1A85',
  PBKS: '#DD1F2D',
};

const teamNames: Record<string, string> = {
  CSK: 'Chennai Super Kings',
  MI: 'Mumbai Indians',
  RCB: 'Royal Challengers Bangalore',
  KKR: 'Kolkata Knight Riders',
  SRH: 'Sunrisers Hyderabad',
  DC: 'Delhi Capitals',
  RR: 'Rajasthan Royals',
  PBKS: 'Punjab Kings',
};

const getLogo = (team: string) => `/ipl-logos/${team.toLowerCase()}.svg`;

const positionChange = (change?: 'up' | 'down' | 'same') => {
  if (change === 'up') return { icon: '↗️', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
  if (change === 'down') return { icon: '↘️', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
  return { icon: '➡️', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' };
};

const EnhancedPointsTable: React.FC<EnhancedPointsTableProps> = ({ table }) => {
  const [sortBy, setSortBy] = useState<string>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedTable = [...table].sort((a, b) => {
    const aValue = a[sortBy as keyof PointsTableEntry] as number;
    const bValue = b[sortBy as keyof PointsTableEntry] as number;
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with Championship Visual */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">IPL 2025 Points Table</h2>
              <p className="text-blue-100 text-sm">League Stage Standings</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{table.length}</div>
            <div className="text-xs text-blue-100">Teams</div>
          </div>
        </div>
      </div>

      {/* Qualification Info */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Top 4 qualify for Playoffs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Elimination Zone</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">POS</th>
              <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm min-w-64">TEAM</th>
              <th 
                className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('played')}
              >
                P {sortBy === 'played' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('won')}
              >
                W {sortBy === 'won' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('lost')}
              >
                L {sortBy === 'lost' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">NR</th>
              <th 
                className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('nrr')}
              >
                NRR {sortBy === 'nrr' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSort('points')}
              >
                PTS {sortBy === 'points' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">RECENT FORM</th>
            </tr>
          </thead>
          <tbody>
            {sortedTable.map((entry, idx) => {
              const position = idx + 1;
              const isQualified = position <= 4;
              const isElimination = position > 6;
              const change = positionChange(entry.posChange);
              const teamColor = teamColors[entry.team] || '#3B82F6';
              
              return (
                <tr
                  key={entry.team}
                  className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group ${
                    isQualified ? 'bg-green-50/50 dark:bg-green-900/10' : 
                    isElimination ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isQualified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        isElimination ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {position}
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${change.bg}`}>
                        <span className={change.color}>{change.icon}</span>
                      </div>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full p-1 shadow-lg"
                        style={{ backgroundColor: teamColor }}
                      >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <Image
                            src={getLogo(entry.team)}
                            alt={`${entry.team} logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-lg" style={{ color: teamColor }}>
                          {entry.team}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {teamNames[entry.team] || entry.team}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="p-4 text-center font-semibold">{entry.played}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm font-semibold">
                      {entry.won}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-sm font-semibold">
                      {entry.lost}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-sm">{entry.nr}</td>
                  <td className="p-4 text-center">
                    <span className={`font-mono font-bold ${
                      entry.nrr > 0 ? 'text-green-600 dark:text-green-400' : 
                      entry.nrr < 0 ? 'text-red-600 dark:text-red-400' : 
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {entry.nrr > 0 ? '+' : ''}{entry.nrr.toFixed(3)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-bold">
                      {entry.points}
                    </span>
                  </td>

                  {/* Recent Form */}
                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      {(entry.recentForm || ['W', 'L', 'W', 'W', 'L']).map((result, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-transform hover:scale-110 ${
                            result === 'W' 
                              ? 'bg-green-500 text-white' 
                              : result === 'L'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {table.reduce((sum, team) => sum + team.played, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {table.filter(team => team.points >= 14).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Strong Teams</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {table.reduce((sum, team) => sum + team.won, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Wins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.max(...table.map(team => team.nrr)).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Best NRR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPointsTable;
