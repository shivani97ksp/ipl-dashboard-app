'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface PointsTableEntry {
  team: string;
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

interface StatsChartProps {
  pointsTable: PointsTableEntry[];
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

const StatsChart: React.FC<StatsChartProps> = ({ pointsTable }) => {
  // Win/Loss Bar Chart Data
  const winLossData = {
    labels: pointsTable.map(team => team.team),
    datasets: [
      {
        label: 'Wins',
        data: pointsTable.map(team => team.won),
        backgroundColor: pointsTable.map(team => teamColors[team.team] || '#4F46E5'),
        borderColor: pointsTable.map(team => teamColors[team.team] || '#4F46E5'),
        borderWidth: 1,
      },
      {
        label: 'Losses',
        data: pointsTable.map(team => team.lost),
        backgroundColor: pointsTable.map(team => `${teamColors[team.team] || '#EF4444'}80`),
        borderColor: '#EF4444',
        borderWidth: 1,
      },
    ],
  };

  // Points Distribution Pie Chart
  const pointsData = {
    labels: pointsTable.map(team => team.team),
    datasets: [
      {
        label: 'Points',
        data: pointsTable.map(team => team.points),
        backgroundColor: pointsTable.map(team => teamColors[team.team] || '#4F46E5'),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Net Run Rate Line Chart
  const nrrData = {
    labels: pointsTable.map(team => team.team),
    datasets: [
      {
        label: 'Net Run Rate',
        data: pointsTable.map(team => team.nrr),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: pointsTable.map(team => teamColors[team.team] || '#10B981'),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          color: '#374151',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4F46E5',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 11,
          },
          color: '#374151',
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4F46E5',
        borderWidth: 1,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10B981',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            return typeof value === 'number' ? value.toFixed(2) : value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Win/Loss Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className="text-blue-500">📊</span>
          Wins vs Losses
        </h3>
        <div className="h-64">
          <Bar data={winLossData} options={chartOptions} />
        </div>
      </div>

      {/* Points Distribution Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className="text-yellow-500">🏆</span>
          Points Distribution
        </h3>
        <div className="h-64">
          <Doughnut data={pointsData} options={pieOptions} />
        </div>
      </div>

      {/* Net Run Rate Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 lg:col-span-2 xl:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className="text-green-500">📈</span>
          Net Run Rate
        </h3>
        <div className="h-64">
          <Line data={nrrData} options={lineOptions} />
        </div>
      </div>

      {/* Team Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className="text-purple-500">🎯</span>
          Team Performance Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pointsTable.slice(0, 4).map((team) => (
            <div 
              key={team.team} 
              className="text-center p-3 rounded-lg border"
              style={{ 
                borderColor: teamColors[team.team] || '#4F46E5',
                backgroundColor: `${teamColors[team.team] || '#4F46E5'}10`
              }}
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: teamColors[team.team] || '#4F46E5' }}
              >
                {team.team}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {team.points} pts
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {team.won}W - {team.lost}L
              </div>
              <div className="text-xs font-mono text-gray-500 dark:text-gray-500">
                NRR: {team.nrr.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
