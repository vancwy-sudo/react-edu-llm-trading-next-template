# Stock Data Fetcher

This script generates sample historical stock data for the AI trading simulation.

## Usage

```bash
node scripts/fetch_stock_data.js
```

No additional dependencies needed - uses built-in Node.js modules and axios (already installed).

## What it does

1. Generates realistic TSLA 5-minute candle data (120 candles = ~10 hours)
2. Calculates technical indicators for each candle:
   - RSI (Relative Strength Index, 14-period)
   - MACD (Moving Average Convergence Divergence)
3. Exports to `src/data/tsla-5min.json`

## Output Format

```json
[
  {
    "timestamp": 1699999999000,
    "open": 248.50,
    "high": 249.20,
    "low": 248.10,
    "close": 248.80,
    "volume": 123456,
    "rsi": 45.23,
    "macd": 1.23,
    "macd_signal": 1.10,
    "macd_diff": 0.13
  }
]
```

## For Production Use

This script generates **sample data** for educational purposes. To use real stock data:

1. **Alpha Vantage** (Free tier: 500 calls/day)
   - Get API key: https://www.alphavantage.co/support/#api-key
   - Update script to call their API

2. **Yahoo Finance**
   - Use a library like `yahoo-finance2` npm package
   - No API key required but rate limited

## Technical Indicators Explained

- **RSI**: Measures momentum (0-100). Below 30 = oversold, above 70 = overbought
- **MACD**: Trend indicator. Positive = bullish, negative = bearish
- **MACD Signal**: Smoothed MACD line for comparison
- **MACD Diff**: Histogram showing difference between MACD and signal
