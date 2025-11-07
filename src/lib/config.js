/**
 * Application Configuration
 *
 * This file centralizes configuration that can be used throughout the app.
 * For server-side only values (like API keys), use environment variables directly.
 */

// AI Model Configuration
export const AI_MODELS = {
  modelA: {
    id: 'modelA',
    name: process.env.NEXT_PUBLIC_LLM_MODEL_A_NAME || 'Claude',
    code: process.env.NEXT_PUBLIC_LLM_MODEL_A_CODE || 'anthropic/claude-3.5-sonnet',
    color: 'purple', // UI color theme
  },
  modelB: {
    id: 'modelB',
    name: process.env.NEXT_PUBLIC_LLM_MODEL_B_NAME || 'GPT-4',
    code: process.env.NEXT_PUBLIC_LLM_MODEL_B_CODE || 'openai/gpt-4o',
    color: 'green', // UI color theme
  },
};

// Default portfolio settings
export const INITIAL_PORTFOLIO = {
  cash: 10000,
  shares: 0,
  history: [],
  lastPrice: 0,
};

// Trading rules
export const TRADING_RULES = {
  maxTradeSize: 10, // Maximum shares per transaction
  minPrice: 0.01, // Minimum stock price
};
