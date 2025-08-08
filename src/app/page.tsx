'use client';

import React, { useEffect, useState } from "react";
import Schedule from "../components/Schedule";
import StatsChart from "../components/StatsChart";
import EnhancedLiveMatch from "../components/EnhancedLiveMatch";
import EnhancedPointsTable from "../components/EnhancedPointsTable";
import QuickActionsPanel from "../components/QuickActionsPanel";
import { LiveMatchSkeleton, PointsTableSkeleton, ScheduleSkeleton, StatsSkeleton } from "../components/SkeletonLoaders";

interface Match {
  id: string;
  date: string;
  time: string;
  teams: [string, string];
  venue: string;
  status: "upcoming" | "live" | "completed";
  score?: {
    [team: string]: string;
  };
  result?: string;
  matchOrder?: string;
}

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

interface IPLData {
  matches: Match[];
  pointsTable: PointsTableEntry[];
  schedule: Match[];
  results: Match[];
}

const TABS = [
  { key: "live", label: "Live/Upcoming" },
  { key: "points", label: "Points Table" },
  { key: "schedule", label: "Schedule" },
  { key: "past", label: "Past Matches" },
  { key: "stats", label: "Stats" },
];

function useIPLData() {
  const [data, setData] = useState<IPLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      
      const res = await fetch("/api/scrape", {
        next: { revalidate: 60 }
      });
      
      if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
      const json = await res.json();
      
      setData(json);
      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    isRefreshing, 
    refetch: () => fetchData(true),
    setError,
    setLoading,
    setData
  };
}

export default function Home() {
  const { data, loading, error, isRefreshing, refetch, setError, setLoading, setData } = useIPLData();
  const [tab, setTab] = useState("live");
  const [showToast, setShowToast] = useState(false);
  const [eventToast, setEventToast] = useState<string | null>(null);

  const loadDemoData = () => {
    setError(null);
    setLoading(false);
    setData({
      matches: [
        { id: '1', date: '2025-08-07', time: '19:30', teams: ['MI', 'CSK'], venue: 'Wankhede Stadium, Mumbai', status: 'upcoming' },
        { id: '2', date: '2025-08-06', time: '19:30', teams: ['RCB', 'KKR'], venue: 'M. Chinnaswamy Stadium, Bangalore', status: 'live', score: { RCB: '156/4 (18.3)', KKR: '142/8 (20)' } }
      ],
      pointsTable: [
        { team: 'CSK', played: 12, won: 9, lost: 3, nr: 0, nrr: 1.456, points: 18 },
        { team: 'MI', played: 12, won: 8, lost: 4, nr: 0, nrr: 0.892, points: 16 },
        { team: 'RCB', played: 12, won: 7, lost: 5, nr: 0, nrr: 0.245, points: 14 }
      ],
      schedule: [
        { id: '1', date: '2025-08-07', time: '19:30', teams: ['MI', 'CSK'], venue: 'Wankhede Stadium, Mumbai', status: 'upcoming' },
        { id: '2', date: '2025-08-08', time: '15:30', teams: ['SRH', 'DC'], venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad', status: 'upcoming' }
      ],
      results: [
        { id: 'result_1', date: '2025-08-03', time: '19:30', teams: ['RCB', 'PBKS'], venue: 'Stadium', status: 'completed', score: { RCB: '190/9', PBKS: '184/7' }, result: 'RCB Won by 6 Runs', matchOrder: 'Final' }
      ]
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        const tabIndex = parseInt(e.key) - 1;
        if (TABS[tabIndex]) {
          setTab(TABS[tabIndex].key);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  useEffect(() => {
    if (tab === 'live' && data?.matches.some(m => m.status === "live")) {
      const timeout = setTimeout(() => {
        setEventToast("WICKET! Big moment in the live match.");
        setTimeout(() => setEventToast(null), 4000);
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [tab, data]);

  useEffect(() => {
    if (data?.matches.some(m => m.status === "live")) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          {/* Animated Cricket Ball */}
          <div className="relative mb-8">
            <div className="animate-bounce text-8xl">🏏</div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>
          
          {/* Loading Text with Typewriter Effect */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Loading IPL Dashboard
          </h2>
          
          {/* Progress Steps */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span>Fetching live match data...</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              This may take a few seconds while we gather the latest IPL information
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
          
          {/* Tips */}
          <div className="text-xs text-gray-500 dark:text-gray-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            💡 <strong>Tip:</strong> We&apos;re scraping live data from official sources. First load may take longer!
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-red-900 dark:via-black dark:to-red-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="text-6xl mb-6">🏏⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Unable to Load IPL Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We&apos;re having trouble fetching the latest IPL information. This could be due to network issues or high traffic.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Don&apos;t worry!</strong> We&apos;ll keep trying to fetch fresh data in the background.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔄</span> Try Again
            </button>
            <button 
              onClick={() => {
                loadDemoData();
                setTab("live");
              }} 
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
            >
              Continue with Demo Data
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">No data available</span>
      </div>
    );
  }

  const liveMatch = data.matches.find((m) => m.status === "live") ||
    data.matches.find((m) => m.status === "upcoming");

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-black dark:to-gray-800 p-0 sm:p-0 flex flex-col items-center font-sans">
      {/* Enhanced Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-500 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 animate-slide-in max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🏏</span>
            <div>
              <div className="font-bold text-sm">Live Match Alert!</div>
              <div className="text-xs opacity-90">An IPL match is happening now</div>
            </div>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Enhanced Event Notification */}
      {eventToast && (
        <div className="fixed top-24 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border border-yellow-300 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 animate-slide-in max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">⚡</span>
            <div>
              <div className="font-bold text-sm">Match Update!</div>
              <div className="text-xs opacity-80">{eventToast}</div>
            </div>
          </div>
          <button 
            onClick={() => setEventToast(null)}
            className="ml-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
      {/* Enhanced Landing/Intro Section */}
      <section className="w-full mb-6">
        <div className="relative w-full rounded-none sm:rounded-2xl shadow-xl bg-gradient-to-br from-blue-700/90 via-purple-600/80 to-blue-400/80 p-4 sm:p-6 flex flex-col items-center justify-center text-center overflow-hidden backdrop-blur-lg">
          {/* Animated Background */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
          
          {/* Live Match Indicator */}
          {data?.matches.some(m => m.status === "live") && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full shadow-lg animate-pulse-glow">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              <span className="font-bold text-xs">LIVE</span>
            </div>
          )}
          
          <span className="text-4xl sm:text-5xl mb-3 animate-float">🏏</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-xl mb-2 tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            IPL T20 Dashboard
          </h1>
          <p className="text-sm sm:text-base text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
            Real-time IPL action with live scores, points table, and statistics
          </p>
          
          {/* Quick Stats - Compact Version */}
          {data && (
            <div className="grid grid-cols-3 gap-4 mb-4 text-white/90">
              <div className="text-center">
                <div className="text-lg font-bold">{data.matches.filter(m => m.status === 'live').length}</div>
                <div className="text-xs uppercase tracking-wider">Live</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{data.pointsTable.length}</div>
                <div className="text-xs uppercase tracking-wider">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{data.schedule.length}</div>
                <div className="text-xs uppercase tracking-wider">Fixtures</div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-2 px-6 py-2 bg-white/95 hover:bg-white text-blue-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-sm hover:scale-105 cursor-pointer"
          >
            <span>🚀</span>
            <span>Explore Dashboard</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>
      {/* Main Dashboard */}
      <div id="dashboard" className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl flex-1 flex flex-col gap-8">
        {/* Enhanced Tabs with Icons and Better UX */}
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex w-full">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`relative flex-1 py-3 px-2 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  tab === t.key 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onClick={() => setTab(t.key)}
              >
                <span className="relative z-10">{t.label}</span>
                {tab === t.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-90"></div>
                )}
              </button>
            ))}
          </div>
        </nav>
        {tab === "live" && (
          <section className="mb-6">
            {data && liveMatch ? <EnhancedLiveMatch match={liveMatch} /> : <LiveMatchSkeleton />}
          </section>
        )}
        {tab === "points" && (
          <section className="mb-6">
            {data ? <EnhancedPointsTable table={data.pointsTable} /> : <PointsTableSkeleton />}
          </section>
        )}
        {tab === "schedule" && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-6 h-6 text-pink-500">🗓️</span>
              <h2 className="text-xl font-bold tracking-tight">Schedule</h2>
              {isRefreshing && (
                <div className="animate-spin w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full ml-2"></div>
              )}
            </div>
            {data ? <Schedule matches={data.schedule} /> : <ScheduleSkeleton />}
          </section>
        )}
        {tab === "past" && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-6 h-6 text-gray-500">⏳</span>
              <h2 className="text-xl font-bold tracking-tight">Past Matches</h2>
            </div>
            {loading ? (
              <ScheduleSkeleton />
            ) : (
              <div className="flex flex-col gap-4">
                {data?.results && data.results.length > 0 ? (
                  data.results.map((m) => (
                    <div key={m.id} className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow p-4 flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1 flex flex-col items-center sm:items-start">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-base uppercase text-blue-900 dark:text-blue-200">{m.teams[0]}</span>
                          <span className="text-xs text-gray-400">vs</span>
                          <span className="font-bold text-base uppercase text-blue-900 dark:text-blue-200">{m.teams[1]}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{m.date} | {m.venue}</div>
                        {m.matchOrder && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">{m.matchOrder}</div>
                        )}
                        {m.result && (
                          <div className="text-sm font-semibold text-green-700 dark:text-green-400">{m.result}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500">Score</span>
                        <span className="font-mono text-blue-700 dark:text-blue-300">{m.teams[0]}: {m.score?.[m.teams[0]] || 'N/A'}</span>
                        <span className="font-mono text-blue-700 dark:text-blue-300">{m.teams[1]}: {m.score?.[m.teams[1]] || 'N/A'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No past match results available</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
        {tab === "stats" && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block w-6 h-6 text-green-500">📈</span>
              <h2 className="text-xl font-bold tracking-tight">Stats & Visualization</h2>
              {isRefreshing && (
                <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full ml-2"></div>
              )}
            </div>
            {data ? <StatsChart pointsTable={data.pointsTable} /> : <StatsSkeleton />}
          </section>
        )}
      </div>
      
      {/* Enhanced Footer with Status */}
      <footer className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {isRefreshing ? 'Updating...' : 'Live Data'}
            </span>
          </div>
          
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          <span className="text-xs text-gray-500 dark:text-gray-500">
            Auto-refresh every 60s
          </span>
          
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          <span className="text-xs text-gray-500 dark:text-gray-500">
            Source: iplt20.com
          </span>
        </div>
      </footer>
      {/* Quick Actions Panel */}
      <QuickActionsPanel 
        onRefresh={refetch}
        isRefreshing={isRefreshing}
        currentTab={tab}
        onTabChange={setTab}
      />
    </div>
  );
}
