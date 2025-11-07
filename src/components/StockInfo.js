'use client';

/**
 * StockInfo Component
 * Displays current candle data and technical indicators
 *
 * Props:
 * - currentCandle: Current candle object with OHLCV and indicators
 * - isRunning: Boolean indicating if simulation is running
 * - speed: Current simulation speed in milliseconds
 * - onPlayPause: Callback to toggle play/pause
 * - onSpeedChange: Callback to change speed
 * - onReset: Callback to reset simulation
 */
export default function StockInfo({
  currentCandle,
  isRunning,
  speed,
  onPlayPause,
  onSpeedChange,
  onReset
}) {
  if (!currentCandle) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-gray-400">Loading stock data...</p>
      </div>
    );
  }

  const priceChange = currentCandle.close - currentCandle.open;
  const priceChangePercent = ((priceChange / currentCandle.open) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  // Format timestamp
  const date = new Date(currentCandle.timestamp);
  const timeString = date.toLocaleTimeString();

  // Speed presets (time between candles in milliseconds)
  const speedPresets = [
    { label: '10s', value: 10000 },  // 10 seconds per day
    { label: '30s', value: 30000 },  // 30 seconds per day
    { label: '60s', value: 60000 },  // 60 seconds per day
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {/* Header with Price */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">TSLA</h1>
            <p className="text-gray-400 text-xs">{timeString}</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              ${currentCandle.close.toFixed(2)}
            </div>
            <div className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent}%)
            </div>
          </div>
        </div>
      </div>

      {/* OHLCV Data + Technical Indicators */}
      <div className="grid grid-cols-7 gap-3">
        <div>
          <div className="text-gray-400 text-xs mb-1">Open</div>
          <div className="text-white font-medium text-sm">${currentCandle.open.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">High</div>
          <div className="text-white font-medium text-sm">${currentCandle.high.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">Low</div>
          <div className="text-white font-medium text-sm">${currentCandle.low.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">Close</div>
          <div className="text-white font-medium text-sm">${currentCandle.close.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">Volume</div>
          <div className="text-white font-medium text-sm">{(currentCandle.volume / 1000000).toFixed(1)}M</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">SMA20</div>
          <div className="text-white font-medium text-sm">${currentCandle.sma20?.toFixed(2) || 'N/A'}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">SMA50</div>
          <div className="text-white font-medium text-sm">${currentCandle.sma50?.toFixed(2) || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}
