/**
 * Stock Data Fetcher for AI Trading Simulation
 * Generates historical TSLA daily data with technical indicators
 *
 * Usage: node fetch_stock_data.js
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Calculate RSI (Relative Strength Index)
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50; // Default neutral RSI

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains = changes.map((c) => (c > 0 ? c : 0));
  const losses = changes.map((c) => (c < 0 ? Math.abs(c) : 0));

  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return rsi;
}

// Calculate SMA (Simple Moving Average)
function calculateSMA(prices, period) {
  if (prices.length < period) {
    return prices.reduce((a, b) => a + b, 0) / prices.length;
  }

  const recentPrices = prices.slice(-period);
  return recentPrices.reduce((a, b) => a + b, 0) / period;
}

// Calculate EMA (Exponential Moving Average)
function calculateEMA(prices, period) {
  if (prices.length < period) return prices[prices.length - 1];

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

// Calculate EMA array for signal line
function calculateEMAArray(values, period) {
  if (values.length < period) return values[values.length - 1] || 0;

  const multiplier = 2 / (period + 1);
  let ema = values.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema;
  }

  return ema;
}

// Calculate MACD (Moving Average Convergence Divergence)
function calculateMACD(
  allPrices,
  macdHistory = [],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  if (allPrices.length < slowPeriod) {
    return { macd: 0, signal: 0, histogram: 0 };
  }

  const emaFast = calculateEMA(allPrices, fastPeriod);
  const emaSlow = calculateEMA(allPrices, slowPeriod);
  const macd = emaFast - emaSlow;

  // Build MACD history for signal calculation
  const macdValues = [...macdHistory, macd];

  // Calculate signal line as EMA of MACD values
  const signal =
    macdValues.length >= signalPeriod
      ? calculateEMAArray(macdValues, signalPeriod)
      : macd;

  const histogram = macd - signal;

  return {
    macd: macd,
    signal: signal,
    histogram: histogram,
  };
}

// Fetch data from Yahoo Finance API (using a free alternative endpoint)
async function fetchStockData() {
  console.log("📊 Generating TSLA daily historical data...");

  try {
    // Using Alpha Vantage free API as an alternative
    // Note: For educational purposes, we'll create sample data
    // In production, students should use a real API with their own key

    console.log("⚠️  Note: Using sample data for educational purposes");
    console.log("   In production, use Alpha Vantage or Yahoo Finance API");

    // Generate realistic sample data for TSLA
    const data = generateSampleData();

    console.log(`✅ Generated ${data.length} sample candles`);

    return data;
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    throw error;
  }
}

// Generate sample TSLA data for educational purposes
function generateSampleData() {
  const data = [];
  const startPrice = 250; // Starting price around $250
  const startTime = Date.now() - 120 * 24 * 60 * 60 * 1000; // 120 days ago

  let currentPrice = startPrice;
  const prices = [currentPrice];
  const macdHistory = []; // Track MACD values for signal line calculation

  for (let i = 0; i < 120; i++) {
    const timestamp = startTime + i * 24 * 60 * 60 * 1000; // Daily intervals (1 day = 24 hours)

    // Generate realistic price movement with wider daily fluctuations
    const change = (Math.random() - 0.48) * 10; // Wider daily price swings ($0-$10 per day)
    currentPrice = Math.max(50, currentPrice + change); // Don't go below $50

    // Generate OHLC data with wider intraday range
    const open = i === 0 ? startPrice : data[i - 1].close;
    const high = open + Math.random() * 8; // Up to $8 high
    const low = open - Math.random() * 8; // Down to $8 low
    const close = currentPrice;
    const volume = Math.floor(5000000 + Math.random() * 10000000); // Higher daily volume

    prices.push(close);

    // Calculate indicators
    const rsi = calculateRSI(prices);
    const sma20 = calculateSMA(prices, 20); // 20-period SMA
    const sma50 = calculateSMA(prices, 50); // 50-period SMA
    const macd = calculateMACD(prices, macdHistory);

    // Add current MACD to history
    macdHistory.push(macd.macd);

    data.push({
      timestamp: timestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume,
      rsi: parseFloat(rsi.toFixed(2)),
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      macd: parseFloat(macd.macd.toFixed(2)),
      macd_signal: parseFloat(macd.signal.toFixed(2)),
      macd_diff: parseFloat(macd.histogram.toFixed(2)),
    });
  }

  return data;
}

// Main function
async function main() {
  console.log("=".repeat(60));
  console.log("AI Trading Simulation - Stock Data Fetcher");
  console.log("=".repeat(60));
  console.log();

  try {
    // Fetch and process data
    const data = await fetchStockData();

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, "..", "src", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file
    const outputPath = path.join(dataDir, "tsla.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(
      `\n✅ Successfully saved ${data.length} candles to src/data/tsla.json`
    );

    const startDate = new Date(data[0].timestamp);
    const endDate = new Date(data[data.length - 1].timestamp);
    console.log(
      `📅 Date range: ${startDate.toLocaleString()} to ${endDate.toLocaleString()}`
    );
    console.log(
      `💰 Price range: $${data[0].close.toFixed(2)} to $${data[
        data.length - 1
      ].close.toFixed(2)}`
    );

    // Print sample data
    console.log("\n📋 Sample data (first candle):");
    console.log(JSON.stringify(data[0], null, 2));

    console.log("\n🎉 Data generation complete! Ready for Phase 3.");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log(
      "\n💡 This script generates sample data for educational purposes."
    );
    console.log("   To use real data, get a free API key from:");
    console.log(
      "   - Alpha Vantage: https://www.alphavantage.co/support/#api-key"
    );
    console.log("   - Or use Yahoo Finance with yfinance library");
    process.exit(1);
  }
}

// Run the script
main();
