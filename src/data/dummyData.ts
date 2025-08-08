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

export const dummyIPLData: IPLData = {
  matches: [
    { 
      id: '1', 
      date: '2025-08-08', 
      time: '19:30', 
      teams: ['MI', 'CSK'], 
      venue: 'Wankhede Stadium, Mumbai', 
      status: 'live',
      score: { MI: '178/6 (19.2)', CSK: '156/4 (18.0)' }
    },
    { 
      id: '2', 
      date: '2025-08-08', 
      time: '15:30', 
      teams: ['RCB', 'KKR'], 
      venue: 'M. Chinnaswamy Stadium, Bangalore', 
      status: 'upcoming' 
    },
    { 
      id: '3', 
      date: '2025-08-09', 
      time: '19:30', 
      teams: ['SRH', 'DC'], 
      venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad', 
      status: 'upcoming' 
    }
  ],
  pointsTable: [
    { 
      team: 'CSK', 
      played: 14, 
      won: 10, 
      lost: 4, 
      nr: 0, 
      nrr: 1.456, 
      points: 20,
      for: '2156/187.4',
      against: '2045/188.2',
      recentForm: ['W', 'W', 'L', 'W', 'W'],
      posChange: 'same' as const
    },
    { 
      team: 'MI', 
      played: 14, 
      won: 9, 
      lost: 5, 
      nr: 0, 
      nrr: 0.892, 
      points: 18,
      for: '2089/186.3',
      against: '1998/189.1',
      recentForm: ['W', 'L', 'W', 'W', 'L'],
      posChange: 'up' as const
    },
    { 
      team: 'RCB', 
      played: 14, 
      won: 8, 
      lost: 6, 
      nr: 0, 
      nrr: 0.245, 
      points: 16,
      for: '2134/188.5',
      against: '2089/187.8',
      recentForm: ['L', 'W', 'W', 'L', 'W'],
      posChange: 'down' as const
    },
    { 
      team: 'KKR', 
      played: 14, 
      won: 8, 
      lost: 6, 
      nr: 0, 
      nrr: -0.123, 
      points: 16,
      for: '1987/189.2',
      against: '2012/188.6',
      recentForm: ['W', 'W', 'L', 'L', 'W'],
      posChange: 'up' as const
    },
    { 
      team: 'SRH', 
      played: 14, 
      won: 7, 
      lost: 7, 
      nr: 0, 
      nrr: 0.456, 
      points: 14,
      for: '2078/187.1',
      against: '2034/188.9',
      recentForm: ['L', 'W', 'L', 'W', 'L'],
      posChange: 'same' as const
    },
    { 
      team: 'DC', 
      played: 14, 
      won: 7, 
      lost: 7, 
      nr: 0, 
      nrr: -0.234, 
      points: 14,
      for: '1945/189.8',
      against: '1998/187.4',
      recentForm: ['W', 'L', 'L', 'W', 'W'],
      posChange: 'down' as const
    },
    { 
      team: 'RR', 
      played: 14, 
      won: 6, 
      lost: 8, 
      nr: 0, 
      nrr: -0.567, 
      points: 12,
      for: '1876/188.7',
      against: '1945/186.9',
      recentForm: ['L', 'L', 'W', 'L', 'L'],
      posChange: 'down' as const
    },
    { 
      team: 'PBKS', 
      played: 14, 
      won: 5, 
      lost: 9, 
      nr: 0, 
      nrr: -0.789, 
      points: 10,
      for: '1823/189.4',
      against: '1923/186.8',
      recentForm: ['L', 'W', 'L', 'L', 'W'],
      posChange: 'same' as const
    }
  ],
  schedule: [
    { 
      id: 'sch_1', 
      date: '2025-08-08', 
      time: '19:30', 
      teams: ['MI', 'CSK'], 
      venue: 'Wankhede Stadium, Mumbai', 
      status: 'live' as const
    },
    { 
      id: 'sch_2', 
      date: '2025-08-08', 
      time: '15:30', 
      teams: ['RCB', 'KKR'], 
      venue: 'M. Chinnaswamy Stadium, Bangalore', 
      status: 'upcoming' as const
    },
    { 
      id: 'sch_3', 
      date: '2025-08-09', 
      time: '19:30', 
      teams: ['SRH', 'DC'], 
      venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad', 
      status: 'upcoming' as const
    },
    { 
      id: 'sch_4', 
      date: '2025-08-10', 
      time: '15:30', 
      teams: ['RR', 'PBKS'], 
      venue: 'Sawai Mansingh Stadium, Jaipur', 
      status: 'upcoming' as const
    },
    { 
      id: 'sch_5', 
      date: '2025-08-11', 
      time: '19:30', 
      teams: ['CSK', 'RCB'], 
      venue: 'M.A. Chidambaram Stadium, Chennai', 
      status: 'upcoming' as const
    },
    { 
      id: 'sch_6', 
      date: '2025-08-12', 
      time: '19:30', 
      teams: ['MI', 'KKR'], 
      venue: 'Eden Gardens, Kolkata', 
      status: 'upcoming' as const
    },
    { 
      id: 'sch_7', 
      date: '2025-08-13', 
      time: '15:30', 
      teams: ['DC', 'SRH'], 
      venue: 'Arun Jaitley Stadium, Delhi', 
      status: 'upcoming' as const
    },
    { 
      id: 'sch_8', 
      date: '2025-08-14', 
      time: '19:30', 
      teams: ['PBKS', 'RR'], 
      venue: 'PCA Stadium, Mohali', 
      status: 'upcoming' as const
    }
  ],
  results: [
    { 
      id: 'result_1', 
      date: '2025-08-07', 
      time: '19:30', 
      teams: ['RCB', 'PBKS'], 
      venue: 'M. Chinnaswamy Stadium, Bangalore', 
      status: 'completed' as const, 
      score: { RCB: '190/8 (20)', PBKS: '184/7 (20)' }, 
      result: 'RCB Won by 6 Runs', 
      matchOrder: 'Match 67' 
    },
    { 
      id: 'result_2', 
      date: '2025-08-06', 
      time: '19:30', 
      teams: ['CSK', 'MI'], 
      venue: 'M.A. Chidambaram Stadium, Chennai', 
      status: 'completed' as const, 
      score: { CSK: '178/4 (20)', MI: '156/8 (20)' }, 
      result: 'CSK Won by 22 Runs', 
      matchOrder: 'Match 66' 
    },
    { 
      id: 'result_3', 
      date: '2025-08-05', 
      time: '15:30', 
      teams: ['KKR', 'SRH'], 
      venue: 'Eden Gardens, Kolkata', 
      status: 'completed' as const, 
      score: { KKR: '145/9 (20)', SRH: '146/3 (18.2)' }, 
      result: 'SRH Won by 7 Wickets', 
      matchOrder: 'Match 65' 
    },
    { 
      id: 'result_4', 
      date: '2025-08-04', 
      time: '19:30', 
      teams: ['DC', 'RR'], 
      venue: 'Arun Jaitley Stadium, Delhi', 
      status: 'completed' as const, 
      score: { DC: '167/7 (20)', RR: '165/8 (20)' }, 
      result: 'DC Won by 2 Runs', 
      matchOrder: 'Match 64' 
    },
    { 
      id: 'result_5', 
      date: '2025-08-03', 
      time: '15:30', 
      teams: ['MI', 'RCB'], 
      venue: 'Wankhede Stadium, Mumbai', 
      status: 'completed' as const, 
      score: { MI: '198/5 (20)', RCB: '172/9 (20)' }, 
      result: 'MI Won by 26 Runs', 
      matchOrder: 'Match 63' 
    },
    { 
      id: 'result_6', 
      date: '2025-08-02', 
      time: '19:30', 
      teams: ['PBKS', 'CSK'], 
      venue: 'PCA Stadium, Mohali', 
      status: 'completed' as const, 
      score: { PBKS: '142/8 (20)', CSK: '143/3 (17.4)' }, 
      result: 'CSK Won by 7 Wickets', 
      matchOrder: 'Match 62' 
    },
    { 
      id: 'result_7', 
      date: '2025-08-01', 
      time: '19:30', 
      teams: ['SRH', 'KKR'], 
      venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad', 
      status: 'completed' as const, 
      score: { SRH: '189/6 (20)', KKR: '175/7 (20)' }, 
      result: 'SRH Won by 14 Runs', 
      matchOrder: 'Match 61' 
    },
    { 
      id: 'result_8', 
      date: '2025-07-31', 
      time: '15:30', 
      teams: ['RR', 'DC'], 
      venue: 'Sawai Mansingh Stadium, Jaipur', 
      status: 'completed' as const, 
      score: { RR: '156/7 (20)', DC: '158/4 (19.1)' }, 
      result: 'DC Won by 6 Wickets', 
      matchOrder: 'Match 60' 
    },
    { 
      id: 'result_9', 
      date: '2025-07-30', 
      time: '19:30', 
      teams: ['CSK', 'RCB'], 
      venue: 'M.A. Chidambaram Stadium, Chennai', 
      status: 'completed' as const, 
      score: { CSK: '173/8 (20)', RCB: '176/7 (19.5)' }, 
      result: 'RCB Won by 3 Wickets', 
      matchOrder: 'Match 59' 
    },
    { 
      id: 'result_10', 
      date: '2025-07-29', 
      time: '19:30', 
      teams: ['MI', 'PBKS'], 
      venue: 'Wankhede Stadium, Mumbai', 
      status: 'completed' as const, 
      score: { MI: '192/4 (20)', PBKS: '183/9 (20)' }, 
      result: 'MI Won by 9 Runs', 
      matchOrder: 'Match 58' 
    }
  ]
};
