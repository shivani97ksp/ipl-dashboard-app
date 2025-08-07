This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Step-by-Step Deployment Guide

#### 1. Prerequisites
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to your Vercel account
vercel login
```

#### 2. Deploy from Command Line
```bash
# Navigate to your project directory
cd c:\demo\ipl-dashboard-app

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? [your-username]
# - Link to existing project? [y/N] N
# - Project name: ipl-dashboard-app
# - Directory: ./
# - Override settings? [y/N] N
```

#### 3. Alternative: Deploy via Vercel Dashboard
1. Visit [vercel.com/new](https://vercel.com/new)
2. Connect your GitHub repository
3. Import the `ipl-dashboard-app` project
4. Configure build settings (usually auto-detected for Next.js)
5. Click "Deploy"

#### 4. Environment Configuration
Since the app uses Puppeteer for web scraping, add these environment variables in Vercel:
```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

#### 5. Vercel Configuration (vercel.json)
The app may need a `vercel.json` file for Puppeteer compatibility:
```json
{
  "functions": {
    "app/api/scrape/route.ts": {
      "maxDuration": 30
    }
  }
}
```

#### 6. Production Considerations
- **Puppeteer on Vercel**: May require serverless-friendly alternatives like Playwright or chrome-aws-lambda
- **API Timeouts**: Scraping functions have 10s timeout, compatible with Vercel's limits
- **Caching**: Built-in 60s cache reduces API calls and improves performance
- **Fallback Data**: Comprehensive dummy data ensures app works even if scraping fails

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## IPL Data Scraping Implementation

### Current Scraping Status
The app successfully scrapes **real IPL data** for:
- ✅ **Points Table**: Live data from `https://www.iplt20.com/points-table/`
- ✅ **Match Results**: Live data from `https://www.iplt20.com/matches/results` (first 20 results)

### Dummy Data Used For:
- ❌ **Live Matches & Schedule**: Could not locate reliable selectors on iplt20.com for live updates and fixture schedules
- ❌ **Upcoming Matches**: Using sample dummy data with realistic IPL team matchups

### Technical Implementation
- **Web Scraping**: Uses Puppeteer for headless browser automation
- **Data Sources**: Official IPL website (iplt20.com)
- **Caching**: 60-second cache duration with error tracking and fallback mechanisms
- **Fallback Strategy**: If scraping fails, falls back to comprehensive dummy data
- **Error Handling**: Robust timeout handling (10s max) with graceful degradation

### Scraped Data Details
- **Points Table**: Team standings, played/won/lost stats, NRR, points, recent form
- **Match Results**: Team codes, scores, overs, match results, venue information, match order (Final, Qualifier, etc.)
- **Data Volume**: Up to 20 recent match results, complete points table (8+ teams)

### Sample Dummy Data
When scraping fails, the app provides realistic sample data including:
- IPL playoff structure (Final, Qualifier 1/2, Eliminator matches)
- Authentic team codes (RCB, CSK, MI, KKR, SRH, DC, RR, PBKS)
- Realistic scores and match scenarios
- Comprehensive points table with NRR and recent form indicators

### Performance & Reliability
- **Cache Duration**: 60 seconds for fresh data
- **Scraping Timeout**: 10 seconds maximum per request
- **Error Recovery**: Automatic fallback to dummy data on failures
- **Headers**: Cache-busting headers ensure fresh data reaches frontend
