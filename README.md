# 🏏 IPL T20 Live Dashboard

A responsive, real-time IPL T20 cricket dashboard that displays live match information, points table, and match schedules sourced directly from the official IPL website (iplt20.com). Built with Next.js, TypeScript, and Tailwind CSS with mobile-first design principles.

![IPL Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC)

## 🎯 Project Overview

This dashboard application fulfills the requirements of building a comprehensive IPL T20 information system with:

- **Real-time Data Scraping**: Live data extraction from iplt20.com using Puppeteer
- **Mobile-first Design**: Responsive UI optimized for all devices
- **Live Match Display**: Current match status with scores and timings
- **Points Table**: Interactive standings with team performance metrics
- **Match Schedule**: Complete fixture list with venues and timings
- **Performance Optimization**: Smart caching and fallback mechanisms

## ✨ Key Features

### Core Functionality
- 🔴 **Live/Upcoming Matches**: Real-time match status with countdown timers
- 📊 **Interactive Points Table**: Sortable standings with NRR, recent form, and qualification status
- 📅 **Match Schedule**: Complete fixture calendar with team matchups
- 📈 **Data Visualization**: Charts and statistics for team performance
- 🔄 **Auto-refresh**: Updates every 60 seconds for fresh data

### Technical Features
- ⚡ **Real-time Scraping**: Puppeteer-based data extraction
- 💾 **Smart Caching**: 60-second cache with error tracking
- 🛡️ **Fallback System**: Comprehensive dummy data when scraping fails
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🌙 **Dark Mode**: Full dark/light theme support
- ⚙️ **Error Handling**: Robust timeout and retry mechanisms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/shivani97ksp/ipl-dashboard-app.git
cd ipl-dashboard-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000) in your browser

The application will automatically start scraping data from iplt20.com and display the dashboard.

> **⚠️ Important Note**: Sometimes scraping may not work due to website restrictions or network issues. If you encounter loading issues:
> - **Try opening the application in incognito/private browsing mode**
> - **Use the "Load Demo Data" button** to continue with realistic dummy data
> - The app will automatically fallback to demo data if scraping fails

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.5, React 19.1.0, TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Web Scraping**: Puppeteer 24.16.0
- **Data Visualization**: Chart.js 4.5.0 with React-ChartJS-2
- **Deployment**: Vercel (optimized serverless functions)
- **Caching**: In-memory caching with error tracking
## 📋 Application Structure

```
src/
├── app/
│   ├── api/scrape/route.ts     # Main scraping API endpoint
│   ├── layout.tsx              # App layout with metadata
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Global styles
├── components/
│   ├── EnhancedLiveMatch.tsx   # Live match display component
│   ├── EnhancedPointsTable.tsx # Interactive points table
│   ├── Schedule.tsx            # Match schedule component
│   ├── StatsChart.tsx          # Data visualization
│   ├── SkeletonLoaders.tsx     # Loading state components
│   └── QuickActionsPanel.tsx   # Action buttons and controls
└── public/
    └── ipl-logos/              # Team logo assets
```

## 🔧 Data Scraping Implementation

### Scraping Methodology

The application uses **Puppeteer** for headless browser automation to extract real-time data from the official IPL website (iplt20.com). The scraping system is designed with reliability and performance in mind.

#### Successfully Scraped Data ✅
- **Points Table**: Live team standings from `https://www.iplt20.com/points-table/`
  - Team names, matches played/won/lost, net run rate, points
  - Recent form indicators (W/L sequence)
  - Position changes (up/down/same)
  - For/Against runs data
  
- **Match Results**: Recent match data from `https://www.iplt20.com/matches/results`
  - Team codes and full scores with overs
  - Match results and winners
  - Venue information
  - Match classification (Final, Qualifier, Eliminator, etc.)
  - Up to 20 most recent matches

#### Dummy Data Fallback ⚠️
When scraping fails or for unavailable data, the system uses realistic dummy data:
- **Live Matches & Schedule**: Sample data with authentic team matchups
- **Upcoming Matches**: Placeholder fixtures with proper IPL team codes
- **Match Scenarios**: Realistic scores and playoff structure representation

### Technical Implementation Details

#### Scraping Configuration
```javascript
// Browser launch options optimized for serverless environments
{
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
}
```

#### Data Extraction Process
1. **Points Table Scraping**:
   - Target selectors: `.ih-td-tab`, `#pointsdata tr`
   - Extract team standings with NRR calculations
   - Parse recent form from `.rf` elements
   - Handle position change indicators

2. **Match Results Scraping**:
   - Target selectors: `#team_archive li`
   - Extract match details including scores and overs
   - Parse venue and date/time information
   - Classify match types (playoffs, league matches)

#### Error Handling & Resilience
- **Timeout Management**: 30-second maximum per scraping operation
- **Graceful Degradation**: Automatic fallback to dummy data
- **Error Tracking**: Comprehensive error counting and recovery
- **Cache Strategy**: Smart caching with error state management

### Challenges Faced & Solutions

#### 1. **Dynamic Content Loading**
**Challenge**: IPL website uses dynamic JavaScript-rendered content
**Solution**: Implemented `waitUntil: 'networkidle2'` and specific element waiting

#### 2. **Selector Reliability**
**Challenge**: Website structure changes could break scraping
**Solution**: Multiple selector fallbacks and robust error handling

#### 3. **Rate Limiting & Performance**
**Challenge**: Avoiding being blocked by the target website
**Solution**: Implemented smart caching (60s duration) and request optimization

#### 4. **Live Match Data Availability**
**Challenge**: Live match selectors not consistently available on iplt20.com
**Solution**: Hybrid approach with realistic dummy data for live matches

#### 5. **Serverless Deployment Issues**
**Challenge**: Puppeteer compatibility with Vercel serverless functions
**Solution**: Optimized browser launch arguments and extended timeout to 30s

#### 6. **Website Access Restrictions**
**Challenge**: Target website may block automated requests or have CORS restrictions
**Solution**: **If scraping doesn't work, try opening the app in incognito mode or use the "Load Demo Data" feature** for continued functionality with realistic sample data

### Data Reliability & User Experience
- **Automatic Fallback**: Seamless transition to dummy data when scraping fails
- **User Notification**: Clear indicators when using demo vs live data
- **Manual Override**: "Load Demo Data" button for immediate access to sample data
- **Incognito Mode**: Recommended for bypassing browser-specific restrictions

## 🚀 Deployment & Production

### Vercel Deployment

#### Quick Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy the project
vercel

# Follow the prompts for project setup
```

#### Environment Variables
For production deployment, configure these environment variables in Vercel:
```env
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

#### Vercel Configuration
The project includes `vercel.json` for optimal performance:
```json
{
  "functions": {
    "src/app/api/scrape/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Performance Optimizations
- **Serverless Function Timeout**: Extended to 30s for reliable scraping
- **Caching Strategy**: 60-second cache with intelligent error recovery
- **Image Optimization**: Next.js automatic image optimization for team logos
- **Code Splitting**: Automatic component-level code splitting

### 🚨 Deployment Troubleshooting

#### Common Issue: npm Registry Authentication Error

**Problem**: Vercel deployment fails with error:
```
npm error code E401
npm error Incorrect or missing password.
npm error If you were trying to login, change your password, or update your user account, please use 'npm login'
```

**Root Cause**: This typically occurs when your local npm configuration or `package-lock.json` points to a private/corporate registry (like JFrog Artifactory) that Vercel cannot authenticate with.

**Solution Steps**:

1. **Create `.npmrc` file** in your project root:
```bash
registry=https://registry.npmjs.org/
```

2. **Delete and regenerate package-lock.json**:
```bash
rm package-lock.json
npm cache clean --force
npm install
```

3. **Ensure favicon is in correct location**:
```bash
# Move favicon from src/app/ to public/ if needed
mv src/app/favicon.ico public/favicon.ico
```

4. **Verify local build works**:
```bash
npm run build
```

5. **Commit and push changes**:
```bash
git add .
git commit -m "Fix npm registry for Vercel deployment"
git push origin main
```

**Prevention**: Always use public npm registry for projects intended for deployment on platforms like Vercel, Netlify, or Heroku.

#### Other Deployment Issues

**Build Timeouts**:
- Ensure `vercel.json` has proper timeout configuration (30s for scraping functions)
- Consider implementing build-time optimizations for large dependencies

**Puppeteer Issues**:
- Verify Puppeteer environment variables are set correctly
- Test scraping functionality locally before deployment

**Memory Issues**:
- Monitor Vercel function memory usage
- Consider implementing data pagination for large datasets

## 🏆 IPL Teams Supported

| Team Code | Full Name | Primary Color |
|-----------|-----------|---------------|
| CSK | Chennai Super Kings | #FDB913 |
| MI | Mumbai Indians | #004BA0 |
| RCB | Royal Challengers Bangalore | #EC1E24 |
| KKR | Kolkata Knight Riders | #3A225D |
| SRH | Sunrisers Hyderabad | #FF822A |
| DC | Delhi Capitals | #282968 |
| RR | Rajasthan Royals | #EA1A85 |
| PBKS | Punjab Kings | #DD1F2D |

## 🧪 Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

---

**Built with ❤️ for cricket fans worldwide** 🏏
