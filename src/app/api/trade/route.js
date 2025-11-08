import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  // console.log("�� [API] Received JSON Payload", data);

  // currentCandle: {
  //   timestamp: 1752927235157,
  //   open: 237.96,
  //   high: 243.21,
  //   low: 233.5,
  //   close: 241.52,
  //   volume: 11133067,
  //   rsi: 50,
  //   sma20: 245.74,
  //   sma50: 245.74,
  //   macd: 0,
  //   macd_signal: 0,
  //   macd_diff: 0
  // },
  // previousCandles: [
  //   {
  //     ...
  //   },

  const prompt = `You are an AGGRESSIVE day trader competing to maximize portfolio value. Your goal is to make bold, high-reward trading decisions based on technical analysis.
  
## Current Market Data (Latest Candle)
- Open: ${data.currentCandle.open}
- High: ${data.currentCandle.high}
- Low: ${data.currentCandle.low}
- Close: ${data.currentCandle.close}
- Volume: ${data.currentCandle.volume}
- SMA20: ${data.currentCandle.sma20}
- SMA50: ${data.currentCandle.sma50}

## HISTORICAL CONTEXT (Previous ${
    data.previousCandles.length
  } Candles, in DESCENDING order, that means #1 is the latest - 1)
${data.previousCandles
  .reverse()
  .map((candle, i) => {
    return `${i + 1} | Open: ${candle.open} | Close: ${
      candle.close
    } | Volume: ${candle.volume} | SMA20: ${candle.sma20} | SMA50: ${
      candle.sma50
    }`;
  })
  .join("\n")}

## YOUR PORTFOLIO STATUS
- Cash Available: ${data.portfolio.cash}
- Shares Owned: ${data.portfolio.shares}
- Current Value: ${data.portfolio.value}

## RESPONSE FORMAT (JSON ONLY)
Respond with ONLY valid JSON in this exact format:
{
  "action": "buy" | "sell" | "hold",
  "amount": <number 0-10>,
  "message": "<reason for this decision>"
}

CRITICAL: Respond with ONLY the JSON object. No extra text, no markdown, no explanations outside the JSON. show chinese respond.
`;

  // console.log(prompt);

  try {
    const response = await fetch(
      `https://openrouter.ai/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: data.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        }),
      }
    );

    const decisionPayload = await response.json();

    const decision = JSON.parse(
      decisionPayload.choices[0].message.content
        .replace("```json", "")
        .replace("```", "")
    );

    return NextResponse.json(decision);
  } catch (err) {
    return NextResponse.json({
      action: "hold",
      amount: 0,
      message: "No response from AI, skipping....",
    });
  }
}
