'use client';

import { useEffect, useRef } from 'react';
import { AI_MODELS } from '@/lib/config';

/**
 * AIChatroom Component
 * Displays AI trading decisions and reasoning in real-time
 *
 * Props:
 * - messages: Array of chat messages from AIs
 * - aiPortfolios: Object with portfolio data for each AI
 * - isRunning: Boolean indicating if simulation is running
 * - speed: Current simulation speed
 * - onPlayPause: Callback to toggle play/pause
 * - onSpeedChange: Callback to change speed
 * - onReset: Callback to reset simulation
 */
export default function AIChatroom({ messages, aiPortfolios, isRunning, speed, onPlayPause, onSpeedChange, onReset }) {
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getAIColor = (ai) => {
    return ai === 'modelA' ? AI_MODELS.modelA.color : AI_MODELS.modelB.color;
  };

  const getAIName = (ai) => {
    return ai === 'modelA' ? AI_MODELS.modelA.name : AI_MODELS.modelB.name;
  };

  const getActionBadge = (action) => {
    const colors = {
      buy: 'bg-green-500/20 text-green-400 border-green-500/30',
      sell: 'bg-red-500/20 text-red-400 border-red-500/30',
      hold: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[action] || colors.hold;
  };

  const getActionEmoji = (action) => {
    const emojis = {
      buy: '📈',
      sell: '📉',
      hold: '⏸',
    };
    return emojis[action] || '⏸';
  };

  // Speed presets
  const speedPresets = [
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '60s', value: 60000 },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 flex flex-col h-full">
      {/* Header with Controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">AI Trading Room</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayPause}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRunning ? '⏸' : '▶'}
            </button>
            <button
              onClick={onReset}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              ↻
            </button>
            {speedPresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => onSpeedChange(preset.value)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  speed === preset.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Model A Portfolio */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
            <div className="text-purple-400 text-xs font-medium mb-1">{AI_MODELS.modelA.name}</div>
            <div className="text-white font-bold text-lg">
              ${aiPortfolios.modelA?.cash?.toFixed(2) || '10000.00'}
            </div>
            <div className="text-purple-300 text-xs">
              {aiPortfolios.modelA?.shares || 0} shares
            </div>
            <div className="text-purple-400 text-xs mt-1">
              Total: ${(
                (aiPortfolios.modelA?.cash || 10000) +
                (aiPortfolios.modelA?.shares || 0) * (aiPortfolios.modelA?.lastPrice || 0)
              ).toFixed(2)}
            </div>
          </div>

          {/* Model B Portfolio */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="text-green-400 text-xs font-medium mb-1">{AI_MODELS.modelB.name}</div>
            <div className="text-white font-bold text-lg">
              ${aiPortfolios.modelB?.cash?.toFixed(2) || '10000.00'}
            </div>
            <div className="text-green-300 text-xs">
              {aiPortfolios.modelB?.shares || 0} shares
            </div>
            <div className="text-green-400 text-xs mt-1">
              Total: ${(
                (aiPortfolios.modelB?.cash || 10000) +
                (aiPortfolios.modelB?.shares || 0) * (aiPortfolios.modelB?.lastPrice || 0)
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Waiting for AI decisions...</p>
            <p className="text-sm mt-2">Press Play to start the simulation</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const color = getAIColor(msg.ai);
            const borderColor = color === 'purple' ? 'border-purple-500/30' : 'border-green-500/30';
            const bgColor = color === 'purple' ? 'bg-purple-900/10' : 'bg-green-900/10';
            const textColor = color === 'purple' ? 'text-purple-400' : 'text-green-400';

            return (
              <div
                key={index}
                className={`border ${borderColor} ${bgColor} rounded-lg p-3`}
              >
                {/* Header with AI name and action */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${textColor}`}>
                      {getAIName(msg.ai)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${getActionBadge(msg.action)}`}>
                    {getActionEmoji(msg.action)} {msg.action.toUpperCase()}
                  </span>
                </div>

                {/* Trade details */}
                {msg.action !== 'hold' && (
                  <div className="text-sm text-gray-300 mb-2">
                    {msg.amount} shares @ ${msg.price.toFixed(2)}
                  </div>
                )}

                {/* AI reasoning */}
                <div className="text-sm text-gray-400 leading-relaxed">
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
