import { NextResponse } from "next/server";

/**
 * API Route: /api/trade
 * Calls OpenRouter API to get AI trading decision
 *
 * STUDENT TASK: Implement the AI trading API integration
 *
 * You will build:
 * - Request parsing and validation
 * - OpenRouter API integration
 * - Trading prompt construction
 * - Response parsing and error handling
 */

// =============================================================================
// TODO 1: Implement the POST handler
// =============================================================================
// This function handles POST requests to /api/trade
//
// Steps:
// 1. Parse the request body using await request.json()
// 2. Destructure: model, currentCandle, previousCandles, portfolio, previousMessages
// 3. Validate required fields (model, currentCandle, portfolio)
// 4. Check for API key (process.env.OPENROUTER_API_KEY)
//    - If missing: return getMockResponse(currentCandle, portfolio)
// 5. Build the trading prompt using buildTradingPrompt function
// 6. Call OpenRouter API with fetch:
//    - URL: 'https://openrouter.ai/api/v1/chat/completions'
//    - Method: POST
//    - Headers:
//      * Authorization: `Bearer ${apiKey}`
//      * Content-Type: 'application/json'
//      * HTTP-Referer: 'https://github.com/yourusername/ai-trading-sim'
//      * X-Title: 'AI Trading Simulation'
//    - Body: JSON.stringify with model, messages array, temperature: 0.7, max_tokens: 500
//      * messages: [
//          { role: 'system', content: aggressive trading system prompt },
//          { role: 'user', content: prompt }
//        ]
// 7. Check if response is ok, parse JSON
// 8. Extract AI response from data.choices[0].message.content
// 9. Parse JSON from AI response (use try-catch, handle errors with getMockResponse)
// 10. Validate decision has action and message
// 11. Normalize decision (lowercase action, set defaults for amount and price)
// 12. Return NextResponse.json(decision)
// 13. Wrap everything in try-catch for error handling
//
// System prompt for aggressive trading:
// "You are an AGGRESSIVE trading AI with a high-risk, high-reward strategy.
//  You actively seek trading opportunities and make bold moves.
//  You prefer action over caution. Always respond with valid JSON only."
//
// Your code here:
export async function POST(request) {
  // Your implementation
  const data = await request.json();

  return NextResponse.json({
    action: "buy",
    data: data,
  });
}

// =============================================================================
// TODO 2: Implement buildTradingPrompt function
// =============================================================================
// This function constructs the prompt to send to the AI model.
//
// Parameters:
// - currentCandle: object with open, high, low, close, volume, sma20, sma50
// - previousCandles: array of previous candle objects
// - portfolio: object with cash, shares, value
// - previousMessages: array of previous trading decisions
//
// Steps:
// 1. Get last 10 candles: previousCandles.slice(-10)
// 2. Get last 10 messages: previousMessages.slice(-10)
// 3. Build a prompt string that includes:
//    a. Opening statement: "You are an AGGRESSIVE day trader..."
//    b. Current candle data (open, high, low, close, volume, sma20, sma50)
//    c. Previous 10 candles with close, sma20, sma50
//    d. Portfolio status (cash, shares, current value)
//    e. Previous messages/decisions (if available)
//    f. Trading strategy guidelines (be AGGRESSIVE, use full buying power, etc.)
//    g. Rules (cash requirements, share requirements, max trade size: 10)
//    h. JSON response format specification
// 4. Return the complete prompt string
//
// HINT: Use template literals with ${} for formatting
// HINT: Use .map().join('\n') for formatting arrays
//
// Example structure:
// ```
// You are an AGGRESSIVE day trader competing to maximize profits...
//
// Current Candle:
// - Open: $250.00
// - High: $255.00
// ...
//
// Previous 10 Candles:
// 1. Close: $248.00, SMA20: $245.00, SMA50: $240.00
// ...
//
// Your Portfolio:
// - Cash: $10000.00
// - Shares: 0
// - Current Value: $10000.00
//
// Your Last 5 Decisions:
// 1. BUY 10 shares @ $245.00 - "Bullish trend..."
// ...
//
// Trading Strategy:
// - You are AGGRESSIVE...
// ...
//
// Respond ONLY with valid JSON...
// ```
//
// Your code here:
function buildTradingPrompt(
  currentCandle,
  previousCandles,
  portfolio,
  previousMessages
) {
  // Your implementation
}

// =============================================================================
// PROVIDED: getMockResponse function
// =============================================================================
// This function generates mock trading decisions when OpenRouter API is unavailable.
// It implements an aggressive SMA-based trading strategy.
//
// NO CHANGES NEEDED - This is complete and working!
function getMockResponse(currentCandle, portfolio) {
  const close = currentCandle.close;
  const sma20 = currentCandle.sma20;
  const sma50 = currentCandle.sma50;

  // Aggressive trading logic - always look for opportunities
  let action = "hold";
  let amount = 0;
  let message = "Monitoring for entry point.";

  // Aggressive buy: Any bullish signal - max out position
  if (close >= sma20 && portfolio.cash >= close * 10) {
    action = "buy";
    amount = 10; // Max size
    message = `AGGRESSIVE BUY: Price $${close.toFixed(
      2
    )} at/above SMA20. Going all-in with 10 shares!`;
  }
  // Buy with remaining cash
  else if (close >= sma20 && portfolio.cash >= close * 5) {
    action = "buy";
    amount = Math.min(10, Math.floor(portfolio.cash / close));
    message = `Buying ${amount} shares - price trending above SMA20. Deploying capital aggressively!`;
  }
  // Quick exit on any bearish signal
  else if (close < sma20 && portfolio.shares >= 10) {
    action = "sell";
    amount = 10; // Sell maximum
    message = `QUICK SELL: Price $${close.toFixed(
      2
    )} below SMA20. Exiting full position to preserve capital!`;
  }
  // Sell any remaining shares on downtrend
  else if (close < sma20 && portfolio.shares > 0) {
    action = "sell";
    amount = Math.min(10, portfolio.shares);
    message = `Selling ${amount} shares - cutting losses on downtrend. Don't fight the trend!`;
  }
  // Rare hold scenario
  else if (portfolio.shares > 0 && portfolio.cash < close) {
    message = `Holding position. Waiting to sell on next downturn or buy more on uptick.`;
  } else if (portfolio.cash >= close) {
    // Have cash but waiting
    action = "buy";
    amount = Math.min(10, Math.floor(portfolio.cash / close));
    message = `Deploying available capital - ${amount} shares. Can't let cash sit idle!`;
  }

  return {
    action,
    amount,
    price: close,
    message,
  };
}
