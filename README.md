# AI Trading Simulation - Student Template

An educational Next.js project where you build a real-time trading simulation powered by AI models competing to maximize portfolio value.

![AI Trading Simulation](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwindcss)

## 📖 About This Project

This is a **student template** for learning React hooks, API integration, and state management by building an engaging AI trading simulation.

### What You'll Build

- ⚛️ State management with `useState` and `useEffect`
- 🔄 Real-time simulation with intervals
- 🤖 AI integration via OpenRouter API
- 📈 Portfolio management logic
- 💹 Buy/sell trade execution

### What's Provided

All UI components, styling, market data, and configuration are **complete**. You focus on learning React concepts!

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Add your OpenRouter API key to .env.local
# Get free key at: https://openrouter.ai/keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Learning Path

Follow the step-by-step instructions in **[INSTRUCTIONS.md](./INSTRUCTIONS.md)**

### Part 1: State Management
- Set up useState hooks
- Load market data
- Implement event handlers

### Part 2: Simulation Loop
- Create interval-based simulation
- Advance through candles
- Call AI models

### Part 3: Trading Logic
- Execute buy/sell trades
- Update portfolios
- Validate transactions

### Part 4: AI Integration
- Call OpenRouter API
- Build trading prompts
- Parse AI responses

## 🛠️ Tech Stack

- **Next.js 16.0** - React framework with App Router
- **React 19.0** - UI library with hooks
- **TailwindCSS 4.0** - Utility-first styling
- **lightweight-charts** - TradingView charts
- **OpenRouter** - AI model API

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # 🎯 YOUR TASK: Main simulation logic
│   ├── api/trade/
│   │   └── route.js         # 🎯 YOUR TASK: AI API integration
│   ├── layout.js            # ✅ Complete
│   └── globals.css          # ✅ Complete
├── components/
│   ├── TradingChart.js      # ✅ Complete - Chart visualization
│   ├── StockInfo.js         # ✅ Complete - Price display
│   └── AIChatroom.js        # ✅ Complete - AI decisions chat
├── lib/
│   └── config.js            # ✅ Complete - Constants
└── data/
    └── tsla.json            # ✅ Complete - Market data (120 days)
```

## 🎯 Your Tasks

Files marked with 🎯 contain TODOs for you to complete:

### `src/app/page.js` (8 TODOs)
1. Set up state with useState
2. Load market data with useEffect
3. Create simulation loop
4. Implement makeAIDecisions
5. Implement getAIDecision
6. Implement executeTrade
7. Implement event handlers
8. Render UI components

### `src/app/api/trade/route.js` (2 TODOs)
1. Implement POST handler
2. Implement buildTradingPrompt

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🎓 What You'll Learn

### React Hooks
- `useState` for managing application state
- `useEffect` for side effects and cleanup
- Dependency arrays and re-renders
- State immutability patterns

### API Integration
- Calling REST APIs with `fetch`
- Async/await error handling
- Request/response parsing
- Environment variables

### Trading Logic
- Portfolio calculations
- Buy/sell validation
- Transaction history
- Real-time updates

## 📊 Features

- **Real-Time Simulation**: Watch candles advance every 5-60 seconds
- **Dual AI Competition**: Two models compete with different strategies
- **Interactive Chart**: Candlestick price data + portfolio value overlay
- **Live Chat**: See AI reasoning for each decision
- **Configurable Speed**: Adjust simulation speed (5s, 10s, 30s, 60s)
- **Progress Tracking**: Visual progress bar
- **Reset Capability**: Start over anytime

## 🌟 Bonus Challenges

After completing the main tasks:

1. **Customize Strategy**: Modify prompt to change AI behavior
2. **Add Statistics**: Track total trades, win rate, profit/loss
3. **New Indicators**: Implement EMA, Bollinger Bands
4. **Third Competitor**: Add a 3rd AI model
5. **Persistent Storage**: Save results to localStorage
6. **Enhanced Charts**: Add indicator overlays

## 📖 Resources

- **Instructions**: [INSTRUCTIONS.md](./INSTRUCTIONS.md) - Detailed step-by-step guide
- **React Docs**: https://react.dev/reference/react
- **Next.js Docs**: https://nextjs.org/docs
- **OpenRouter**: https://openrouter.ai/docs
- **Solution**: `main` branch has complete working code

## 🐛 Troubleshooting

### Environment Variables Not Working
- Ensure file is named `.env.local` (not `.env.local.example`)
- Restart dev server after changes
- Client variables need `NEXT_PUBLIC_` prefix

### API Errors
- Check `.env.local` has valid OpenRouter API key
- Verify internet connection
- Check browser console for error details
- Mock responses work without API key

### Chart Not Updating
- Check `marketData` state has data
- Verify `currentIndex` is incrementing
- Ensure `aiPortfolios` state is updating

### State Not Updating
- Never mutate state directly (use spread operators)
- Always create new arrays/objects
- Check dependency arrays in useEffect

## 🤝 Contributing

This is an educational template. Feel free to:
- Fork and customize for your students
- Submit issues for improvements
- Share your teaching experiences

## 📄 License

MIT License - Free to use for education

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [lightweight-charts](https://tradingview.github.io/lightweight-charts/)
- [OpenRouter](https://openrouter.ai)

---

**Happy Learning! 🚀**

For detailed instructions, see [INSTRUCTIONS.md](./INSTRUCTIONS.md)
# react-edu-llm-trading-next-template
