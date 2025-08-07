import React from 'react';
import Image from 'next/image';

interface LiveMatchProps {
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

const getLogo = (team: string) => `/ipl-logos/${team.toLowerCase()}.svg`;

const LiveMatch: React.FC<LiveMatchProps> = ({ match }) => {
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-blue-100 dark:border-blue-900">
      {/* LIVE/UPCOMING badge top right */}
      <div className="absolute top-4 right-4 z-10">
        {isLive && (
          <span className="px-3 py-1 bg-red-600 text-white rounded-full font-bold text-xs shadow animate-pulse">LIVE</span>
        )}
        {isUpcoming && (
          <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full font-bold text-xs shadow">UPCOMING</span>
        )}
      </div>
      {/* Team 1 */}
      <div className="flex flex-col items-center flex-1">
        <Image
          src={getLogo(match.teams[0])}
          alt={match.teams[0]}
          width={64}
          height={64}
          className="w-16 h-16 object-contain rounded-full border mb-2 bg-white"
        />
        <span className="font-bold text-lg sm:text-xl uppercase tracking-wide text-blue-900 dark:text-blue-200">
          {match.teams[0]}
        </span>
        {isLive && match.score && (
          <span className="mt-1 text-blue-700 font-mono text-base font-bold animate-pulse">
            {match.score[match.teams[0]]}
          </span>
        )}
      </div>
      {/* VS */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-400 mb-2">VS</span>
      </div>
      {/* Team 2 */}
      <div className="flex flex-col items-center flex-1">
        <Image
          src={getLogo(match.teams[1])}
          alt={match.teams[1]}
          width={64}
          height={64}
          className="w-16 h-16 object-contain rounded-full border mb-2 bg-white"
        />
        <span className="font-bold text-lg sm:text-xl uppercase tracking-wide text-blue-900 dark:text-blue-200">
          {match.teams[1]}
        </span>
        {isLive && match.score && (
          <span className="mt-1 text-blue-700 font-mono text-base font-bold animate-pulse">
            {match.score[match.teams[1]]}
          </span>
        )}
      </div>
      {/* Match Info */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="inline-block">📅 {match.date}</span>
          <span className="inline-block">⏰ {match.time}</span>
          <span className="inline-block">📍 {match.venue}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMatch;