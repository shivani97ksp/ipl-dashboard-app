import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Types for IPL data
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

// Enhanced in-memory cache with error tracking
let cache: { 
  data: IPLData; 
  timestamp: number; 
  lastSuccessful: number;
  errorCount: number;
} | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds
const FALLBACK_CACHE_DURATION = 300 * 1000; // 5 minutes on error
const SCRAPING_TIMEOUT = 30000; // 30 seconds max for scraping (increased from 10s)

// Enhanced dummy data with more realistic content
const dummyData: IPLData = {
  matches: [
    {
      id: '1',
      date: '2025-08-07',
      time: '19:30',
      teams: ['MI', 'CSK'],
      venue: 'Wankhede Stadium, Mumbai',
      status: 'upcoming',
    },
    {
      id: '2',
      date: '2025-08-06',
      time: '19:30',
      teams: ['RCB', 'KKR'],
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      status: 'live',
      score: {
        RCB: '156/4 (18.3)',
        KKR: '142/8 (20)',
      },
    },
    {
      id: '3',
      date: '2025-08-05',
      time: '19:30',
      teams: ['SRH', 'DC'],
      venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad',
      status: 'completed',
      score: {
        SRH: '180/5 (20)',
        DC: '165/9 (20)',
      },
    },
  ],
  pointsTable: [
    {
      team: 'CSK',
      played: 12,
      won: 9,
      lost: 3,
      nr: 0,
      nrr: 1.456,
      points: 18,
      for: '2250/240.0',
      against: '2100/240.0',
      recentForm: ['W', 'W', 'L', 'W', 'W'],
      posChange: 'up',
    },
    {
      team: 'MI',
      played: 12,
      won: 8,
      lost: 4,
      nr: 0,
      nrr: 0.892,
      points: 16,
      for: '2180/240.0',
      against: '2120/240.0',
      recentForm: ['L', 'W', 'W', 'L', 'W'],
      posChange: 'same',
    },
    {
      team: 'RCB',
      played: 12,
      won: 7,
      lost: 5,
      nr: 0,
      nrr: 0.245,
      points: 14,
      for: '2080/240.0',
      against: '2090/240.0',
      recentForm: ['L', 'L', 'W', 'W', 'L'],
      posChange: 'down',
    },
    {
      team: 'KKR',
      played: 12,
      won: 6,
      lost: 6,
      nr: 0,
      nrr: -0.123,
      points: 12,
      for: '2000/240.0',
      against: '2050/240.0',
      recentForm: ['W', 'L', 'L', 'L', 'W'],
      posChange: 'same',
    },
    {
      team: 'SRH',
      played: 12,
      won: 5,
      lost: 7,
      nr: 0,
      nrr: -0.567,
      points: 10,
      for: '1950/240.0',
      against: '2100/240.0',
      recentForm: ['L', 'W', 'L', 'W', 'L'],
      posChange: 'down',
    },
    {
      team: 'DC',
      played: 12,
      won: 4,
      lost: 8,
      nr: 0,
      nrr: -0.789,
      points: 8,
      for: '1900/240.0',
      against: '2150/240.0',
      recentForm: ['L', 'L', 'L', 'W', 'L'],
      posChange: 'down',
    },
    {
      team: 'RR',
      played: 12,
      won: 3,
      lost: 9,
      nr: 0,
      nrr: -1.234,
      points: 6,
      for: '1850/240.0',
      against: '2200/240.0',
      recentForm: ['L', 'L', 'W', 'L', 'L'],
      posChange: 'down',
    },
    {
      team: 'PBKS',
      played: 12,
      won: 2,
      lost: 10,
      nr: 0,
      nrr: -1.567,
      points: 4,
      for: '1800/240.0',
      against: '2250/240.0',
      recentForm: ['L', 'L', 'L', 'L', 'W'],
      posChange: 'down',
    },
  ],
  schedule: [
    {
      id: '1',
      date: '2025-08-07',
      time: '19:30',
      teams: ['MI', 'CSK'],
      venue: 'Wankhede Stadium, Mumbai',
      status: 'upcoming',
    },
    {
      id: '2',
      date: '2025-08-06',
      time: '19:30',
      teams: ['RCB', 'KKR'],
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      status: 'live',
      score: {
        RCB: '156/4 (18.3)',
        KKR: '142/8 (20)',
      },
    },
    {
      id: '3',
      date: '2025-08-08',
      time: '15:30',
      teams: ['SRH', 'DC'],
      venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad',
      status: 'upcoming',
    },
    {
      id: '4',
      date: '2025-08-09',
      time: '19:30',
      teams: ['RR', 'PBKS'],
      venue: 'Sawai Mansingh Stadium, Jaipur',
      status: 'upcoming',
    },
    {
      id: '5',
      date: '2025-08-10',
      time: '19:30',
      teams: ['CSK', 'RCB'],
      venue: 'M. A. Chidambaram Stadium, Chennai',
      status: 'upcoming',
    },
  ],
  results: [
    {
      id: 'result_1',
      date: '2025-08-03',
      time: '19:30',
      teams: ['RCB', 'PBKS'],
      venue: 'Narendra Modi Stadium, Ahmedabad',
      status: 'completed',
      score: {
        RCB: '190/9 (20.0 OV)',
        PBKS: '184/7 (20.0 OV)',
      },
      result: 'Royal Challengers Bengaluru Won by 6 Runs (Winners)',
      matchOrder: 'Final',
    },
    {
      id: 'result_2',
      date: '2025-08-01',
      time: '19:30',
      teams: ['PBKS', 'MI'],
      venue: 'Narendra Modi Stadium, Ahmedabad',
      status: 'completed',
      score: {
        PBKS: '207/5 (19.0 OV)',
        MI: '203/6 (20.0 OV)',
      },
      result: 'Punjab Kings Won by 5 Wickets (Qualified)',
      matchOrder: 'Qualifier 2',
    },
    {
      id: 'result_3',
      date: '2025-05-30',
      time: '19:30',
      teams: ['GT', 'MI'],
      venue: 'New PCA Stadium, Chandigarh',
      status: 'completed',
      score: {
        GT: '208/6 (20.0 OV)',
        MI: '228/5 (20.0 OV)',
      },
      result: 'Mumbai Indians Won by 20 Runs (Qualified)',
      matchOrder: 'Eliminator',
    },
    {
      id: 'result_4',
      date: '2025-05-29',
      time: '19:30',
      teams: ['RCB', 'DC'],
      venue: 'New PCA Stadium, Chandigarh',
      status: 'completed',
      score: {
        RCB: '187/4 (18.2 OV)',
        DC: '185/8 (20.0 OV)',
      },
      result: 'Royal Challengers Bengaluru Won by 8 Wickets (Qualified)',
      matchOrder: 'Qualifier 1',
    },
    {
      id: 'result_5',
      date: '2025-05-28',
      time: '19:30',
      teams: ['CSK', 'KKR'],
      venue: 'Eden Gardens, Kolkata',
      status: 'completed',
      score: {
        CSK: '176/8 (20.0 OV)',
        KKR: '180/4 (19.1 OV)',
      },
      result: 'Kolkata Knight Riders Won by 6 Wickets',
      matchOrder: 'Match 70',
    },
    {
      id: 'result_6',
      date: '2025-05-27',
      time: '15:30',
      teams: ['SRH', 'RR'],
      venue: 'Rajiv Gandhi Intl. Stadium, Hyderabad',
      status: 'completed',
      score: {
        SRH: '201/7 (20.0 OV)',
        RR: '187/9 (20.0 OV)',
      },
      result: 'Sunrisers Hyderabad Won by 14 Runs',
      matchOrder: 'Match 69',
    },
    {
      id: 'result_7',
      date: '2025-05-26',
      time: '19:30',
      teams: ['MI', 'LSG'],
      venue: 'Wankhede Stadium, Mumbai',
      status: 'completed',
      score: {
        MI: '214/6 (20.0 OV)',
        LSG: '196/5 (20.0 OV)',
      },
      result: 'Mumbai Indians Won by 18 Runs',
      matchOrder: 'Match 68',
    },
  ],
};

// Real web scraping functions
async function scrapeIPLResults(): Promise<Match[]> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    page.setDefaultTimeout(30000);

    await page.goto('https://www.iplt20.com/matches/results', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    await page.waitForSelector('#team_archive li, ul#team_archive', { timeout: 15000 });

    const results = await page.evaluate(() => {
      const listItems = document.querySelectorAll('#team_archive li');
      const extractedResults: Match[] = [];
      
      const itemsToProcess = Math.min(listItems.length, 20);
      
      for (let i = 0; i < itemsToProcess; i++) {
        try {
          const item = listItems[i];
          
          const matchOrderElement = item.querySelector('.vn-matchOrder');
          const matchOrder = matchOrderElement?.textContent?.trim() || '';
          
          const venueElement = item.querySelector('.vn-venueDet p');
          const venue = venueElement?.textContent?.trim() || 'TBD';
          
          const dateTimeElement = item.querySelector('.vn-matchDateTime');
          const dateTime = dateTimeElement?.textContent?.trim() || '';
          
          const resultElement = item.querySelector('.vn-ticketTitle');
          const result = resultElement?.textContent?.trim() || '';
          
          const homeTeamCodeElement = item.querySelector('.vn-shedTeam .vn-teamCode h3');
          const homeTeamCode = homeTeamCodeElement?.textContent?.trim() || '';
          
          const awayTeamCodeElement = item.querySelector('.vn-shedTeam.vn-team-2 .vn-teamCode h3');
          const awayTeamCode = awayTeamCodeElement?.textContent?.trim() || '';
          
          const homeScoreElement = item.querySelector('.vn-shedTeam p');
          const homeScore = homeScoreElement?.textContent?.trim() || '';
          
          const awayScoreElement = item.querySelector('.vn-shedTeam.vn-team-2 p');
          const awayScore = awayScoreElement?.textContent?.trim() || '';
          
          const homeOversElement = item.querySelector('.vn-shedTeam .ov-display');
          const homeOvers = homeOversElement?.textContent?.trim() || '';
          
          const awayOversElement = item.querySelector('.vn-shedTeam.vn-team-2 .ov-display');
          const awayOvers = awayOversElement?.textContent?.trim() || '';
          
          if (homeTeamCode && awayTeamCode) {
            const matchDate = new Date().toISOString().split('T')[0];
            
            let matchTime = '19:30';
            const timeMatch = dateTime.match(/(\d{1,2}:\d{2})\s*(am|pm)/i);
            if (timeMatch) {
              matchTime = timeMatch[1];
            }
            
            const matchData: Match = {
              id: `result_${i}`,
              date: matchDate,
              time: matchTime,
              teams: [homeTeamCode, awayTeamCode] as [string, string],
              venue: venue.replace(/,\s*$/, ''),
              status: 'completed' as const,
              score: {},
              result: result,
              matchOrder: matchOrder
            };
            
            if (homeScore) {
              const fullHomeScore = homeScore + (homeOvers ? ' ' + homeOvers : '');
              matchData.score![homeTeamCode] = fullHomeScore;
            }
            
            if (awayScore) {
              const fullAwayScore = awayScore + (awayOvers ? ' ' + awayOvers : '');
              matchData.score![awayTeamCode] = fullAwayScore;
            }
            
            extractedResults.push(matchData);
          }
        } catch {
          // Continue processing other items
        }
      }
      
      return extractedResults;
    });
    
    return results;

  } catch {
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function scrapeIPLPointsTable(): Promise<PointsTableEntry[]> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    page.setDefaultTimeout(30000);

    await page.goto('https://www.iplt20.com/points-table/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    await page.waitForSelector('.ih-td-tab, table', { timeout: 15000 });

    const pointsTable = await page.evaluate(() => {
      const rows = document.querySelectorAll('#pointsdata tr, .ih-td-tab tbody tr');
      const extractedData: PointsTableEntry[] = [];
      
      rows.forEach((row) => {
        try {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 10) {
            const statusCell = cells[1];
            const statusSpan = statusCell?.querySelector('.posStatus');
            let posChange: 'up' | 'down' | 'same' = 'same';
            if (statusSpan?.classList.contains('pts-up')) posChange = 'up';
            else if (statusSpan?.classList.contains('pts-down')) posChange = 'down';
            
            const teamCell = cells[2];
            const teamName = teamCell?.querySelector('.ih-pt-cont, h2')?.textContent?.trim() || '';
            
            const played = parseInt(cells[3]?.textContent?.trim() || '0');
            const won = parseInt(cells[4]?.textContent?.trim() || '0');
            const lost = parseInt(cells[5]?.textContent?.trim() || '0');
            const nr = parseInt(cells[6]?.textContent?.trim() || '0');
            const nrr = parseFloat(cells[7]?.textContent?.trim() || '0');
            const forRuns = cells[8]?.textContent?.trim() || '';
            const againstRuns = cells[9]?.textContent?.trim() || '';
            const points = parseInt(cells[10]?.textContent?.trim() || '0');
            
            const formCell = cells[11];
            const formSpans = formCell?.querySelectorAll('.rf');
            const recentForm: string[] = [];
            formSpans?.forEach(span => {
              const result = span.textContent?.trim();
              if (result === 'W' || result === 'L' || result === 'N') {
                recentForm.push(result);
              }
            });
            
            if (teamName && played > 0) {
              extractedData.push({
                team: teamName,
                played,
                won,
                lost,
                nr,
                nrr,
                points,
                for: forRuns,
                against: againstRuns,
                recentForm: recentForm.length > 0 ? recentForm : undefined,
                posChange
              });
            }
          }
        } catch {
          // Continue processing other rows
        }
      });
      
      return extractedData;
    });

    return pointsTable;

  } catch {
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function scrapeIPLData(): Promise<IPLData | null> {
  try {
    const scrapedPointsTable = await scrapeIPLPointsTable();
    const scrapedResults = await scrapeIPLResults();

    const pointsTableToUse = scrapedPointsTable.length > 0 ? scrapedPointsTable : dummyData.pointsTable;
    const resultsToUse = scrapedResults.length > 0 ? scrapedResults : dummyData.results;

    return {
      matches: dummyData.matches,
      pointsTable: pointsTableToUse,
      schedule: dummyData.schedule,
      results: resultsToUse
    };

  } catch {
    return null;
  }
}

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  if (cache && cache.errorCount > 2 && Date.now() - cache.lastSuccessful < FALLBACK_CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  let data: IPLData;
  let scrapingSuccessful = false;

  try {
    const scrapingPromise = scrapeIPLData();
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Scraping timeout')), SCRAPING_TIMEOUT)
    );
    
    const scrapedData = await Promise.race([scrapingPromise, timeoutPromise]);
    
    if (scrapedData) {
      data = scrapedData;
      scrapingSuccessful = true;
    } else {
      throw new Error('Scraping returned null');
    }
  } catch {
    data = dummyData;
  }

  if (scrapingSuccessful) {
    cache = { 
      data, 
      timestamp: Date.now(),
      lastSuccessful: Date.now(),
      errorCount: 0
    };
  } else {
    cache = {
      data,
      timestamp: Date.now(),
      lastSuccessful: cache?.lastSuccessful || Date.now(),
      errorCount: (cache?.errorCount || 0) + 1
    };
  }
  
  const response = NextResponse.json(data);
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}