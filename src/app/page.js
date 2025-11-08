"use client";

import { useState, useEffect } from "react";
import TradingChart from "@/components/TradingChart";
import StockInfo from "@/components/StockInfo";
import AIChatroom from "@/components/AIChatroom";
import marketDataJson from "@/data/tsla.json";
import { AI_MODELS, INITIAL_PORTFOLIO } from "@/lib/config";

export default function Home() {
  const [marketData, setMarketData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(30000);
  const [aiPortfolios, setAiPortfolios] = useState({
    modelA: { ...INITIAL_PORTFOLIO },
    modelB: { ...INITIAL_PORTFOLIO },
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState({
    modelA: [],
    modelB: [],
  });

  useEffect(() => {
    setMarketData(marketDataJson);
  }, []);

  useEffect(() => {
    if (!isRunning || marketData.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex >= marketData.length - 1) {
        setIsRunning(false);
        return;
      }

      // Calculate next candle index
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      //
      makeAIDecisions(nextIndex);
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, currentIndex, speed, marketData]);

  async function makeAIDecisions(index) {
    const currentCandle = marketData[index];
    const previousCandles = marketData.slice(Math.max(0, index - 10), index);

    await Promise.all([
      getAIDecision(
        "modelA",
        AI_MODELS.modelA.code,
        currentCandle,
        previousCandles
      ),
      getAIDecision(
        "modelB",
        AI_MODELS.modelB.code,
        currentCandle,
        previousCandles
      ),
    ]);
  }

  async function getAIDecision(aiName, model, currentCandle, previousCandles) {
    const portfolio = aiPortfolios[aiName];
    const portfolioValue =
      portfolio.cash + portfolio.shares * currentCandle.close;
    const previousMessages = aiMessages[aiName].slice(-10); // Get last 10 messages from the AI bot

    const response = await fetch("/api/trade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        currentCandle: currentCandle,
        previousCandles: previousCandles,
        portfolio: {
          cash: portfolio.cash,
          shares: portfolio.shares,
          value: portfolioValue,
        },
        previousMessages: previousMessages,
      }),
    });

    const decision = await response.json();

    // TODO: execute the trade decision
    executeTrade(aiName, decision, currentCandle);
  }

  function executeTrade(aiName, decision, currentCandle) {
    setAiPortfolios((prev) => {
      const portfolio = { ...prev[aiName] };

      if (decision.action === "buy") {
        const cost = decision.amount * currentCandle.close;

        if (cost <= portfolio.cash) {
          portfolio.cash -= cost;
          portfolio.shares += decision.amount;
        }
      } else if (decision.action === "sell") {
        if (decision.amount <= portfolio.shares) {
          portfolio.cash += decision.amount * currentCandle.close;
          portfolio.shares -= decision.amount;
        }
      }

      portfolio.history = [
        ...portfolio.history,
        {
          timestamp: new Date(),
          value: portfolio.cash + portfolio.shares * currentCandle.close,
        },
      ];

      portfolio.lastPrice = currentCandle.close;

      return {
        ...prev,
        [aiName]: portfolio,
      };
    });
  }

  function handlePlayPause() {
    setIsRunning(!isRunning);
  }

  function handleSpeedChange(newSpeed) {
    setSpeed(newSpeed);
  }

  function handleReset() {
    // Your implementation
  }

  // =============================================================================
  // PROVIDED: showFinalResults function
  // =============================================================================
  // This function is provided for you. It displays final results when simulation ends.
  function showFinalResults() {
    const finalPrice = marketData[marketData.length - 1].close;
    const modelATotal =
      aiPortfolios.modelA.cash + aiPortfolios.modelA.shares * finalPrice;
    const modelBTotal =
      aiPortfolios.modelB.cash + aiPortfolios.modelB.shares * finalPrice;

    const winner =
      modelATotal > modelBTotal ? AI_MODELS.modelA.name : AI_MODELS.modelB.name;
    const winnerValue = Math.max(modelATotal, modelBTotal);

    console.log("=== FINAL RESULTS ===");
    console.log(`${AI_MODELS.modelA.name}: $${modelATotal.toFixed(2)}`);
    console.log(`${AI_MODELS.modelB.name}: $${modelBTotal.toFixed(2)}`);
    console.log(`Winner: ${winner} with $${winnerValue.toFixed(2)}`);

    setChatMessages((prev) => [
      ...prev,
      {
        ai: "system",
        timestamp: Date.now(),
        action: "hold",
        amount: 0,
        price: finalPrice,
        message: `�� Simulation Complete! ${winner} wins with $${winnerValue.toFixed(
          2
        )}!`,
      },
    ]);
  }

  // =============================================================================
  // TODO 8: Render the UI
  // =============================================================================
  // The JSX below is provided, but you need to ensure you pass the correct props!
  //
  // Required props:
  // - StockInfo: currentCandle, isRunning, speed, onPlayPause, onSpeedChange, onReset
  // - TradingChart: data, currentIndex, aiPortfolios
  // - AIChatroom: messages, aiPortfolios, isRunning, speed, onPlayPause, onSpeedChange, onReset
  //
  // Get current candle
  const currentCandle = marketData[currentIndex];

  return (
    <div className="h-screen bg-black text-white p-4 overflow-hidden flex flex-col">
      {/* Main Layout - Single row */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left Column: Chart and Info */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Stock Info Panel */}
          <StockInfo
            currentCandle={currentCandle}
            isRunning={isRunning}
            speed={speed}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            onReset={handleReset}
          />

          {/* Trading Chart */}
          <div className="flex-1 min-h-0">
            <TradingChart
              data={marketData}
              currentIndex={currentIndex}
              aiPortfolios={aiPortfolios}
            />
          </div>

          {/* Progress Indicator */}
          {marketData.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>
                  {currentIndex + 1} / {marketData.length} days
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / marketData.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Chatroom */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <AIChatroom
            messages={chatMessages}
            aiPortfolios={aiPortfolios}
            isRunning={isRunning}
            speed={speed}
            onPlayPause={handlePlayPause}
            onSpeedChange={handleSpeedChange}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
