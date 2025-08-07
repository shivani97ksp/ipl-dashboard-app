'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface EnhancedLiveMatchProps {
  match: {
    id: string;
    date: string;
    time: string;
    teams: [string, string];
    venue: string;
    status: 'upcoming' | 'live' | 'completed';
    score?: {
      [team: string]: string;
    };
  };
}

const teamColors: Record<string, { primary: string; secondary: string }> = {
  CSK: { primary: '#FDB913', secondary: '#1F2937' },
  MI: { primary: '#004BA0', secondary: '#FFD700' },
  RCB: { primary: '#EC1E24', secondary: '#FFD700' },
  KKR: { primary: '#3A225D', secondary: '#FFD700' },
  SRH: { primary: '#FF822A', secondary: '#000000' },
  DC: { primary: '#282968', secondary: '#FFD700' },
  RR: { primary: '#EA1A85', secondary: '#FFD700' },
  PBKS: { primary: '#DD1F2D', secondary: '#FFD700' },
};

const getLogo = (team: string) => `/ipl-logos/${team.toLowerCase()}.svg`;

const EnhancedLiveMatch: React.FC<EnhancedLiveMatchProps> = ({ match }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  useEffect(() => {
    if (match.status === 'upcoming') {
      const interval = setInterval(() => {
        const now = new Date();
        const matchTime = new Date(`${match.date} ${match.time}`);
        const diff = matchTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft('Starting soon');
        }
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [match.date, match.time, match.status]);

  const team1Color = teamColors[match.teams[0]] || { primary: '#3B82F6', secondary: '#FFD700' };
  const team2Color = teamColors[match.teams[1]] || { primary: '#EF4444', secondary: '#FFD700' };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-4 right-4 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Live Badge */}
      {match.status === 'live' && (
        <div className="absolute top-6 right-6 z-20">
          <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="font-bold text-sm">LIVE</span>
          </div>
        </div>
      )}

      {/* Upcoming Badge */}
      {match.status === 'upcoming' && (
        <div className="absolute top-6 right-6 z-20">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-lg">⏰</span>
            <span className="font-bold text-sm">{timeLeft || 'UPCOMING'}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 p-8">
        {/* Match Header */}
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
            {match.status === 'live' ? 'Live Match' : 'Upcoming Match'}
          </h3>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span>📅</span> {new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <span>⏰</span> {match.time}
            </span>
          </div>
        </div>

        {/* Teams Section */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-8">
          {/* Team 1 */}
          <div className="flex flex-col items-center group">
            <div 
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{ 
                background: `linear-gradient(135deg, ${team1Color.primary}, ${team1Color.primary}80)`,
                boxShadow: `0 10px 30px ${team1Color.primary}40`
              }}
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Image
                  src={getLogo(match.teams[0])}
                  alt={match.teams[0]}
                  width={60}
                  height={60}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold mb-2" style={{ color: team1Color.primary }}>
              {match.teams[0]}
            </h4>
            {match.status === 'live' && match.score && (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-mono font-bold text-gray-800 dark:text-gray-200 animate-pulse">
                  {match.score[match.teams[0]] || '0/0'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Current Score</div>
              </div>
            )}
          </div>

          {/* VS Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-float">
                <span className="text-white font-bold text-lg">VS</span>
              </div>
              {match.status === 'live' && (
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-ping"></div>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center group">
            <div 
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{ 
                background: `linear-gradient(135deg, ${team2Color.primary}, ${team2Color.primary}80)`,
                boxShadow: `0 10px 30px ${team2Color.primary}40`
              }}
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Image
                  src={getLogo(match.teams[1])}
                  alt={match.teams[1]}
                  width={60}
                  height={60}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold mb-2" style={{ color: team2Color.primary }}>
              {match.teams[1]}
            </h4>
            {match.status === 'live' && match.score && (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-mono font-bold text-gray-800 dark:text-gray-200 animate-pulse">
                  {match.score[match.teams[1]] || '0/0'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Current Score</div>
              </div>
            )}
          </div>
        </div>

        {/* Match Info Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="text-lg">🏟️</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{match.venue}</span>
          </div>
        </div>

        {/* Live Match Extra Info */}
        {match.status === 'live' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">15.2</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Overs</div>
            </div>
            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">8.5</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Run Rate</div>
            </div>
            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">28</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Balls Left</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLiveMatch;
