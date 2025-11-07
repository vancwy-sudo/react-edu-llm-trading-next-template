"use client";

import { useState, useEffect } from "react";
import TradingChart from "@/components/TradingChart";
import StockInfo from "@/components/StockInfo";
import AIChatroom from "@/components/AIChatroom";
import marketDataJson from "@/data/tsla.json";
import { AI_MODELS, INITIAL_PORTFOLIO } from "@/lib/config";

/**
 * Main Trading Simulation Page
 *
 * STUDENT TASK: Implement the trading simulation logic
 *
 * You will build:
 * - State management with useState
 * - Side effects with useEffect
 * - Simulation loop
 * - Trading logic
 * - Event handlers
 *
 * The UI components (TradingChart, StockInfo, AIChatroom) are provided.
 * Focus on learning React hooks and application logic!
 */
export default function Home() {
  // =============================================================================
  // TODO 1: Set up state variables using useState
  // =============================================================================
  // Create the following state variables:
  // 1. marketData - array to store candle data (initial: [])
  // 2. currentIndex - number for current candle position (initial: 0)
  // 3. isRunning - boolean for simulation state (initial: false)
  // 4. speed - number in milliseconds per candle (initial: 30000)
  // 5. aiPortfolios - object with modelA and modelB portfolios (initial: see below)
  // 6. chatMessages - array for all chat messages (initial: [])
  // 7. aiMessages - object to track messages per AI (initial: { modelA: [], modelB: [] })
  //
  // HINT: For aiPortfolios initial value:
  // {
  //   modelA: { ...INITIAL_PORTFOLIO },
  //   modelB: { ...INITIAL_PORTFOLIO },
  // }
  //
  // Your code here:
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

  // =============================================================================
  // TODO 2: Load market data when component mounts
  // =============================================================================
  // Use useEffect to load market data once when the component first renders.
  //
  // Steps:
  // 1. Use useEffect with an empty dependency array []
  // 2. Inside the effect, set marketData to marketDataJson
  // 3. (Optional) Log how many candles were loaded
  //
  // HINT: Empty dependency [] means "run once on mount"
  //
  // Your code here:
  useEffect(() => {
    setMarketData(marketDataJson);
  }, []);

  // =============================================================================
  // TODO 3: Create the simulation loop
  // =============================================================================
  // Use useEffect to run the simulation at the specified speed.
  //
  // Steps:
  // 1. Check if simulation should run (isRunning && marketData.length > 0)
  // 2. Create an interval using setInterval that:
  //    a. Checks if we reached the end (currentIndex >= marketData.length - 1)
  //    b. If at end: stop simulation, call showFinalResults(), return
  //    c. Otherwise: increment currentIndex and call makeAIDecisions(nextIndex)
  // 3. Return a cleanup function that calls clearInterval
  // 4. Add proper dependencies: [isRunning, currentIndex, speed, marketData]
  //
  // HINT: Use async/await for makeAIDecisions since it calls APIs
  //
  // Your code here:

  useEffect(() => {
    if (!isRunning || marketData.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex >= marketData.length - 1) {
        setIsRunning(false);
        return;
      }

      //Calculate next candle index
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      //
      makeAIDecisions(nextIndex);
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, currentIndex, speed, marketData]);

  // =============================================================================
  // TODO 4: Implement makeAIDecisions function
  // =============================================================================
  // This function calls both AI models to make trading decisions for a candle.
  //
  // Parameters:
  // - index: the current candle index
  //
  // Steps:
  // 1. Get currentCandle from marketData[index]
  // 2. Get previousCandles: marketData.slice(Math.max(0, index - 10), index)
  // 3. Call getAIDecision for modelA with AI_MODELS.modelA.code
  // 4. Call getAIDecision for modelB with AI_MODELS.modelB.code
  // 5. (Optional) Log current candle info
  //
  // HINT: Use await for both getAIDecision calls
  //
  // Your code here:
  async function makeAIDecisions(index) {
    const currentCandle = marketData[index];
    const previousCandles = marketData.slice(Math.max(0, index - 10), index);

    await getAIDecision(
      "modelA",
      AI_MODELS.modelA.code,
      currentCandle,
      previousCandles
    );
    await getAIDecision(
      "modelB",
      AI_MODELS.modelB.code,
      currentCandle,
      previousCandles
    );
  }

  // =============================================================================
  // TODO 5: Implement getAIDecision function
  // =============================================================================
  // This function calls the AI API to get a trading decision.
  //
  // Parameters:
  // - aiName: 'modelA' or 'modelB'
  // - model: the model code string (e.g., 'anthropic/claude-3.5-sonnet')
  // - currentCandle: the current candle object
  // - previousCandles: array of previous 10 candles
  //
  // Steps:
  // 1. Get the portfolio for this AI from aiPortfolios[aiName]
  // 2. Calculate portfolioValue = portfolio.cash + (portfolio.shares * currentCandle.close)
  // 3. Get previousMessages for this AI from aiMessages[aiName]
  // 4. Call fetch to '/api/trade' with POST method:
  //    - Headers: { 'Content-Type': 'application/json' }
  //    - Body: JSON.stringify with model, currentCandle, previousCandles,
  //            portfolio (cash, shares, value), and previousMessages (last 10)
  // 5. Check if response is ok, parse JSON
  // 6. Call executeTrade(aiName, decision, currentCandle)
  // 7. Wrap in try-catch and log errors
  //
  // HINT: Remember to await fetch and response.json()
  //
  // Your code here:
  async function getAIDecision(aiName, model, currentCandle, previousCandles) {
    /* */
    const portfolio = aiPortfolios[aiName];
    const portfolioValue =
      portfolio.cash + portfolio.shares * currentCandle.close;
    const previousMessages = aiMessages[aiName].slice(-10);

    const response = await fetch(`/api/trade`, {
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
    /**/
    //TODO: execute the trade decision
    executeTrade(aiName, "buy", currentCandle);
  }

  // =============================================================================
  // TODO 6: Implement executeTrade function
  // =============================================================================
  // This function executes a trade and updates the portfolio.
  //
  // Parameters:
  // - aiName: 'modelA' or 'modelB'
  // - decision: { action: 'buy'|'sell'|'hold', amount: number, message: string }
  // - currentCandle: the current candle object
  //
  // Steps:
  // 1. Use setAiPortfolios to update the portfolio
  // 2. Inside the updater function:
  //    a. Copy the portfolio: { ...prev[aiName] }
  //    b. Get action, amount, and price from decision and currentCandle
  //    c. If action is 'buy':
  //       - Calculate cost = amount * price
  //       - Check if portfolio.cash >= cost
  //       - If yes: deduct cash, add shares
  //       - If no: set decision.action to 'hold' with error message
  //    d. If action is 'sell':
  //       - Check if portfolio.shares >= amount
  //       - If yes: add cash, deduct shares
  //       - If no: set decision.action to 'hold' with error message
  //    e. Calculate new portfolio value
  //    f. IMPORTANT: Create NEW history array (don't mutate):
  //       portfolio.history = [...portfolio.history, { timestamp, value }]
  //    g. Set portfolio.lastPrice = price
  //    h. Return updated portfolios object
  // 3. Create message object with ai, timestamp, action, amount, price, message
  // 4. Add to chatMessages using setChatMessages
  // 5. Add to aiMessages[aiName] using setAiMessages
  //
  // CRITICAL: Always create NEW arrays/objects. Never mutate state!
  //
  // Your code here:
  function executeTrade(aiName, decision, currentCandle) {
    // Your implementation
    setAiPortfolios((prev) => {
      const portfolio = { ...prev[aiName] };

      const randomPrice = Math.round(Math.random() * 100 + 200); //Random from 200 to 3000
      portfolio.cash += randomPrice;
      portfolio.shares += 1;
      portfolio.history = [
        ...portfolio.history,
        {
          timestamp: new Date(),
          value: randomPrice,
        },
      ];
      portfolio.lastPrice = randomPrice;

      return {
        ...prev,
        [aiName]: portfolio,
      };
    });
  }

  // =============================================================================
  // TODO 7: Implement event handler functions
  // =============================================================================
  // Implement these three event handlers:
  //
  // 1. handlePlayPause() - toggles isRunning between true/false
  //    HINT: setIsRunning(prev => !prev)
  //
  // 2. handleSpeedChange(newSpeed) - updates speed to newSpeed
  //    HINT: setSpeed(newSpeed)
  //
  // 3. handleReset() - resets all state to initial values:
  //    - isRunning: false
  //    - currentIndex: 0
  //    - aiPortfolios: reset to INITIAL_PORTFOLIO for both models
  //    - chatMessages: []
  //    - aiMessages: { modelA: [], modelB: [] }
  //
  // Your code here:
  function handlePlayPause() {
    // Your implementation
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
        message: `🏆 Simulation Complete! ${winner} wins with $${winnerValue.toFixed(
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
