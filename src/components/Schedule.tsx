import React from 'react';
import Image from 'next/image';

interface Match {
  id: string;
  date: string;
  time: string;
  teams: [string, string];
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: {
    [team: string]: string;
  };
}

interface ScheduleProps {
  matches: Match[];
}

const getLogo = (team: string) => `/ipl-logos/${team.toLowerCase()}.svg`;

const statusBadge = (status: string) => {
  if (status === 'live') return <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse">LIVE</span>;
  if (status === 'upcoming') return <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold">UPCOMING</span>;
  return <span className="px-2 py-0.5 bg-gray-400 text-white rounded-full text-xs font-bold">COMPLETED</span>;
};

// Group matches by date
function groupByDate(matches: Match[]) {
  return matches.reduce((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);
}

const Schedule: React.FC<ScheduleProps> = ({ matches }) => {
  const grouped = groupByDate(matches);
  const dates = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-8">
      {dates.map(date => (
        <div key={date}>
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-100/60 to-pink-100/60 dark:from-blue-900/60 dark:to-pink-900/60 px-2 py-1 rounded-t-xl mb-2 shadow text-blue-900 dark:text-blue-100 font-bold text-base">
            📅 {date}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[date].map(match => (
              <div
                key={match.id}
                className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-lg p-4 flex flex-col gap-2 border border-blue-100 dark:border-blue-900 hover:scale-[1.025] transition-transform duration-200"
              >
                <div className="absolute top-4 right-4">{statusBadge(match.status)}</div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  {/* Team 1 */}
                  <div className="flex flex-col items-center flex-1">
                    <Image
                      src={getLogo(match.teams[0])}
                      alt={match.teams[0]}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain rounded-full border bg-white"
                    />
                    <span className="font-bold text-sm uppercase tracking-wide text-blue-900 dark:text-blue-200">
                      {match.teams[0]}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-400">VS</span>
                  {/* Team 2 */}
                  <div className="flex flex-col items-center flex-1">
                    <Image
                      src={getLogo(match.teams[1])}
                      alt={match.teams[1]}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain rounded-full border bg-white"
                    />
                    <span className="font-bold text-sm uppercase tracking-wide text-blue-900 dark:text-blue-200">
                      {match.teams[1]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-700 dark:text-gray-300 mt-2">
                  <span className="inline-block">⏰ {match.time}</span>
                  <span className="inline-block">📍 {match.venue}</span>
                </div>
                {match.status === 'live' && match.score && (
                  <div className="flex justify-between mt-2 text-blue-700 font-mono text-xs font-bold animate-pulse">
                    <span>{match.teams[0]}: {match.score[match.teams[0]]}</span>
                    <span>{match.teams[1]}: {match.score[match.teams[1]]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Schedule;