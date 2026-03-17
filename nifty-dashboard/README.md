# Nifty 50 Live Trading Data Dashboard

A professional, modern web dashboard that displays real-time Nifty 50 market data using React, Tailwind V4, and Vite. Features a dark professional trading dashboard theme and fetches live trading data directly from Yahoo Finance.

## Features

- **Live Data**: Fetches real-time open, high, low, previous close, current price, and volume from Yahoo Finance.
- **Auto Refresh**: Updates market data seamlessly every 15 seconds.
- **Market Status Indicators**: Accurately detects and displays whether the market is open or closed, preventing errors when markets are closed.
- **Real-Time Intraday Chart**: High-performance interactive chart built with Recharts, showing current day price movements.
- **Professional Analytics UI**: Inspired by advanced platforms like TradingView with a clean interface, subtle animations, and sleek design.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: Yahoo Finance API (Queried via Vercel proxy configuration to prevent CORS)

## Running Locally

1. **Install dependencies:**
   ```bash
   # Required to resolve react dependencies correctly with latest Vite
   npm install --legacy-peer-deps
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View the app:**
   Open `http://localhost:5173` in your browser.

## Deployment to Vercel

This project is tailored for zero-config deployment to Vercel, including proxy configuration for the data-fetching API.

1. Create a new GitHub repository and push your project code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/nifty-dashboard.git
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com/) and create a **New Project**.
3. Import your GitHub repository.
4. **Framework Preset** should automatically be detected as **Vite**.
5. Click **Deploy**.

Vercel will successfully build (`npm run build`) and correctly route `/api/yahoo` API calls to Yahoo Finance using the included `vercel.json` rewrite strategy without triggering CORS issues.

## Preview

The dashboard layout features 3 primary column grids containing live Nifty ticker, index derivatives links, interactive real-time area chart, and bottom features section simulating standard prop-firm tooling dashboards.
