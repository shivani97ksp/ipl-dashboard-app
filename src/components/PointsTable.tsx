import React from 'react';
import Image from 'next/image';

interface PointsTableEntry {
  team: string;
  teamName?: string;
  played: number;
  won: number;
  lost: number;
  nr: number;
  nrr: number;
  for?: string;
  against?: string;
  points: number;
  logoUrl?: string;
  recentForm?: string[];
  posChange?: 'up' | 'down' | 'same';
}

interface PointsTableProps {
  table: PointsTableEntry[];
}

const getLogo = (team: string) => `/ipl-logos/${team.toLowerCase()}.svg`;

const posArrow = (change?: 'up' | 'down' | 'same') => {
  if (change === 'up') return <span className="text-green-600">▲</span>;
  if (change === 'down') return <span className="text-red-600">▼</span>;
  return <span className="text-gray-400">–</span>;
};

const PointsTable: React.FC<PointsTableProps> = ({ table }) => {
  return (
    <div className="overflow-x-auto w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
      <table className="min-w-full text-xs sm:text-sm text-left border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="p-2 font-semibold text-center">POS</th>
            <th className="p-2 font-semibold">TEAM</th>
            <th className="p-2 font-semibold text-center">P</th>
            <th className="p-2 font-semibold text-center">W</th>
            <th className="p-2 font-semibold text-center">L</th>
            <th className="p-2 font-semibold text-center">NR</th>
            <th className="p-2 font-semibold text-center">NRR</th>
            <th className="p-2 font-semibold text-center">FOR</th>
            <th className="p-2 font-semibold text-center">AGAINST</th>
            <th className="p-2 font-semibold text-center">PTS</th>
            <th className="p-2 font-semibold text-center">RECENT FORM</th>
          </tr>
        </thead>
        <tbody>
          {table.map((entry, idx) => (
            <tr
              key={entry.team}
              className={`transition border-b border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 shadow-sm ${idx < 4 ? 'border-l-4 border-blue-400 bg-blue-50/40 dark:bg-blue-900/40' : ''}`}
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
            >
              <td className="p-2 text-center align-middle font-bold">
                {idx + 1}
                <span className="ml-1 align-middle">{posArrow(entry.posChange)}</span>
              </td>
              <td className="p-2 font-medium flex items-center gap-1">
                <span className="inline-block w-6 h-6 mr-1">
                  <Image
                    src={getLogo(entry.team)}
                    alt={entry.team + ' logo'}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain rounded-full border bg-white"
                  />
                  {/* fallback emoji if image fails */}
                </span>
                <span className="font-bold text-base uppercase">{entry.team}</span>
                {entry.teamName && <span className="text-xs text-gray-500 ml-1 hidden sm:inline">{entry.teamName}</span>}
              </td>
              <td className="p-2 text-center">{entry.played}</td>
              <td className="p-2 text-center">{entry.won}</td>
              <td className="p-2 text-center">{entry.lost}</td>
              <td className="p-2 text-center">{entry.nr ?? 0}</td>
              <td className="p-2 text-center font-mono text-green-700 flex items-center justify-center gap-1">
                <span>📈</span>{entry.nrr.toFixed(3)}
              </td>
              <td className="p-2 text-center font-mono">{entry.for ?? '-'}</td>
              <td className="p-2 text-center font-mono">{entry.against ?? '-'}</td>
              <td className="p-2 text-center font-bold">{entry.points}</td>
              <td className="p-2 text-center">
                <div className="flex gap-1 justify-center">
                  {(entry.recentForm || ['W', 'L', 'W', 'W', 'L']).map((res, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border text-xs font-bold transition-transform duration-200 hover:scale-110
                        ${res === 'W' ? 'bg-green-100 text-green-700 border-green-400' :
                          res === 'L' ? 'bg-red-100 text-red-700 border-red-400' :
                          'bg-gray-100 text-gray-700 border-gray-400'}`}
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;