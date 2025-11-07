'use client';

import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { AI_MODELS } from '@/lib/config';

/**
 * TradingChart Component
 * Displays two charts: portfolio chart (1/3 height) and price chart (2/3 height)
 *
 * Props:
 * - data: Array of candle data with OHLCV
 * - currentIndex: Current candle index being displayed
 * - aiPortfolios: Object with portfolio data for each AI
 */
export default function TradingChart({ data, currentIndex, aiPortfolios }) {
  // Price chart refs
  const priceChartContainerRef = useRef(null);
  const priceChartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  // Portfolio chart refs
  const portfolioChartContainerRef = useRef(null);
  const portfolioChartRef = useRef(null);
  const portfolioLinesRef = useRef({});

  // Initialize charts on mount
  useEffect(() => {
    if (!priceChartContainerRef.current || !portfolioChartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      autoSize: true,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        barSpacing: 20, // 2x wider candlesticks (was 10)
        minBarSpacing: 10, // Minimum spacing when zoomed in (was 5)
      },
    };

    // ===== PORTFOLIO CHART (Top 1/3) =====
    const portfolioChart = createChart(portfolioChartContainerRef.current, chartOptions);

    // Add portfolio value lines
    portfolioLinesRef.current.modelA = portfolioChart.addSeries(LineSeries, {
      color: '#8b5cf6',
      lineWidth: 2,
      title: `${AI_MODELS.modelA.name} Portfolio`,
    });

    portfolioLinesRef.current.modelB = portfolioChart.addSeries(LineSeries, {
      color: '#10b981',
      lineWidth: 2,
      title: `${AI_MODELS.modelB.name} Portfolio`,
    });

    portfolioChartRef.current = portfolioChart;

    // ===== PRICE CHART (Bottom 2/3) =====
    const priceChart = createChart(priceChartContainerRef.current, chartOptions);

    // Create volume series FIRST on separate scale
    const volumeSeries = priceChart.addSeries(HistogramSeries, {
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    // Create candlestick series SECOND so it renders on top
    const candleSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Configure the main price scale (for candlesticks on right)
    priceChart.priceScale('right').applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
    });

    // Configure volume scale to be at the bottom
    priceChart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    priceChartRef.current = priceChart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Cleanup
    return () => {
      portfolioChart.remove();
      priceChart.remove();
    };
  }, []);

  // Update chart data when currentIndex or data changes
  useEffect(() => {
    if (!candleSeriesRef.current || !portfolioLinesRef.current.modelA || !data || data.length === 0) return;

    // Get data up to current index
    const visibleData = data.slice(0, currentIndex + 1);

    // Format data for candlestick chart
    const candleData = visibleData.map(candle => ({
      time: Math.floor(candle.timestamp / 1000),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    // Format data for volume chart
    const volumeData = visibleData.map(candle => ({
      time: Math.floor(candle.timestamp / 1000),
      value: candle.volume,
      color: candle.close >= candle.open ? '#10b98130' : '#ef444430',
    }));

    // Update price chart series
    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);

    // Update portfolio value lines
    if (aiPortfolios.modelA && aiPortfolios.modelA.history.length > 0) {
      const modelAData = aiPortfolios.modelA.history.map(point => ({
        time: Math.floor(point.timestamp / 1000),
        value: point.value,
      }));
      portfolioLinesRef.current.modelA.setData(modelAData);
    }

    if (aiPortfolios.modelB && aiPortfolios.modelB.history.length > 0) {
      const modelBData = aiPortfolios.modelB.history.map(point => ({
        time: Math.floor(point.timestamp / 1000),
        value: point.value,
      }));
      portfolioLinesRef.current.modelB.setData(modelBData);
    }

    // Auto-scroll both charts to show the latest data
    if (priceChartRef.current && portfolioChartRef.current && visibleData.length > 0) {
      priceChartRef.current.timeScale().scrollToPosition(0, false);
      portfolioChartRef.current.timeScale().scrollToPosition(0, false);
    }
  }, [data, currentIndex, aiPortfolios]);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4 flex flex-col gap-3">
      {/* Portfolio Chart - 1/3 height */}
      <div className="h-1/3 min-h-0">
        <div className="text-gray-400 text-xs mb-1 px-2">Portfolio Value</div>
        <div ref={portfolioChartContainerRef} className="w-full h-full" />
      </div>

      {/* Price Chart - 2/3 height */}
      <div className="h-2/3 min-h-0">
        <div className="text-gray-400 text-xs mb-1 px-2">Price & Volume</div>
        <div ref={priceChartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
