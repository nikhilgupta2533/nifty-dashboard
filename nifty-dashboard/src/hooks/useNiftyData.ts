import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export interface MarketData {
  currentPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
  isMarketOpen: boolean;
  chartData: { time: string; price: number }[];
  timestamp: Date;
}

type UseMarketDataOptions = {
  /** Yahoo chart symbol, e.g. ^NSEI, ^NSEBANK */
  symbol: string;
  /** Refresh interval in ms */
  refreshMs?: number;
  /** Chart params */
  interval?: string;
  range?: string;
};

export function useMarketData({
  symbol,
  refreshMs = 15000,
  interval = '1m',
  range = '1d',
}: UseMarketDataOptions) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Using vite proxy in dev, vercel rewrite in prod
      const response = await axios.get(`/api/yahoo/${encodeURIComponent(symbol)}?interval=${encodeURIComponent(interval)}&range=${encodeURIComponent(range)}`);
      const result = response.data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators.quote[0];
      
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose || meta.previousClose;
      const timestampArr = result.timestamp || [];
      const closeArr = quote.close || [];
      const highArr = quote.high || [];
      const lowArr = quote.low || [];
      const volumeArr = quote.volume || [];

      // Calculate max/min from arrays since meta doesn't always have reliable day high/low
      const validHighs = highArr.filter((h: number | null) => h !== null);
      const validLows = lowArr.filter((l: number | null) => l !== null);
      const validVolumes = volumeArr.filter((v: number | null) => v !== null);
      
      const high = validHighs.length ? Math.max(...validHighs) : currentPrice;
      const low = validLows.length ? Math.min(...validLows) : currentPrice;
      const volume = validVolumes.reduce((a: number, b: number) => a + b, 0);
      const open = quote.open && quote.open[0] ? quote.open[0] : previousClose;

      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      const chartData = timestampArr.map((ts: number, index: number) => {
        const date = new Date(ts * 1000);
        return {
          time: date.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' }),
          price: closeArr[index] !== null ? closeArr[index] : (index > 0 ? closeArr[index-1] : currentPrice),
        };
      }).filter((d: { time: string; price: number | null | undefined }) => d.price !== null && d.price !== undefined) as { time: string; price: number }[];

      // Check if market is open (9:15 AM - 3:30 PM IST, Monday - Friday)
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', hour12: false, weekday: 'short', hour: 'numeric', minute: 'numeric' };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(now);
      
      let weekday = '';
      let hour = 0;
      let minute = 0;
      for (const part of parts) {
        if (part.type === 'weekday') weekday = part.value;
        if (part.type === 'hour') hour = parseInt(part.value, 10);
        if (part.type === 'minute') minute = parseInt(part.value, 10);
      }

      const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday);
      const timeInMinutes = hour * 60 + minute;
      const isMarketTime = timeInMinutes >= (9 * 60 + 15) && timeInMinutes <= (15 * 60 + 30);
      const isMarketOpen = isWeekday && isMarketTime;
      
      setData({
        currentPrice,
        previousClose,
        open,
        high,
        low,
        volume,
        change,
        changePercent,
        isMarketOpen,
        chartData,
        timestamp: new Date()
      });
      setError(null);
    } catch (err: unknown) {
      console.error('Error fetching Nifty data:', err);
      // Keep existing data, set error if needed
      setError('Unable to refresh market data. Showing last valid data.');
    } finally {
      setLoading(false);
    }
  }, [interval, range, symbol]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, refreshMs);
    return () => clearInterval(intervalId);
  }, [fetchData, refreshMs]);

  return { data, loading, error };
}

export function useNiftyData() {
  return useMarketData({ symbol: '^NSEI' });
}
