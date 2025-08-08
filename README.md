# 🏏 IPL T20 Live Dashboard

A responsive dashboard application that displays **real-time IPL T20 match information** including live/upcoming matches, the latest points table, and the full match schedule.  
Built with **Next.js, TypeScript, and Tailwind CSS**.

## 🌐 Live Demo
**[🚀 View Live Application](https://ipl-dashboard-app-theta-ten.vercel.app/)**  

---

## 🚀 Tech Stack
- **Next.js** — Server-Side Rendering (SSR) / Static Site Generation (SSG)  
- **TypeScript** — Type-safe development  
- **Tailwind CSS** — Utility-first styling  
- **Node.js API Routes** — Data scraping/fetching  
- **Cheerio / Axios** — For HTML parsing & data fetching (if scraping implemented)  

---

## 📂 Features
- **Live Match Display** — Shows current live match details if available  
- **Upcoming Matches** — Displays next scheduled matches with timing, teams, and venue  
- **Points Table** — Latest standings including wins, losses, points, and NRR  
- **Full Match Schedule** — User-friendly match listing  
- **Mobile-First Design** — Fully responsive UI for smartphones, tablets, and desktops  

---

## 🔧 Scraping Implementation & Challenges

### Scraping Methodology
The application uses **Puppeteer** for headless browser automation to extract real-time data from the official IPL website (iplt20.com). The scraping system is designed with reliability and performance in mind.

#### Successfully Scraped Data ✅
- **Points Table**: Live team standings from `https://www.iplt20.com/points-table/`
  - Team names, matches played/won/lost, net run rate, points
  - Recent form indicators (W/L sequence) 
  - Position tracking and qualification status
  
- **Past Match Results**: Historical match data from `https://www.iplt20.com/matches/results`
  - Team scores with overs played
  - Match winners and results
  - Venue and date information
  - Match classifications (Final, Qualifier, etc.)

#### Challenges Faced & Solutions

**1. Limited Data Availability**
- **Challenge**: Live matches and upcoming schedule selectors were not available on iplt20.com
- **Solution**: Implemented comprehensive dummy data fallback system with realistic IPL team matchups and scenarios

**2. Dynamic Content Loading**
- **Challenge**: IPL website uses JavaScript-rendered content that requires waiting for elements to load
- **Solution**: Used `waitUntil: 'networkidle2'` and specific element waiting strategies

**3. Vercel Deployment Issues**
- **Challenge**: Puppeteer compatibility with serverless functions and npm registry authentication errors
- **Solution**: 
  - Optimized browser launch arguments for serverless environments
  - Extended timeout to 30 seconds for scraping operations
  - Fixed npm registry conflicts by forcing public registry usage
  - Created `.npmrc` file to resolve deployment authentication issues

**4. Reliability & Error Handling**
- **Challenge**: Website structure changes and network issues could break scraping
- **Solution**: Implemented robust error handling with automatic fallback to dummy data
- **Fallback Strategy**: When scraping fails, seamlessly switches to realistic sample data

#### Technical Implementation
```javascript
// Puppeteer configuration for serverless deployment
{
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
}
```

#### Data Reliability
- **Smart Caching**: 60-second cache duration to reduce server load
- **Graceful Degradation**: Automatic fallback ensures app functionality
- **User Transparency**: Clear indicators when using demo vs live data

---

## ⚙️ Installation & Setup
```bash
# 1. Clone the repository
git clone https://github.com/shivani97ksp/ipl-dashboard-app.git
cd ipl-t20-dashboard

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
http://localhost:3000
```

---

## ⚠️ Important Note
**If data scraping doesn't work or you see loading issues:**
- **Try opening the application in incognito/private browsing mode**
- This helps bypass browser restrictions and cache issues that may prevent data loading
- The app includes fallback demo data to ensure functionality even when scraping fails
