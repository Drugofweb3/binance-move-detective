const BINANCE_API = "https://api.binance.com";

export async function getTicker(symbol) {
  const response = await fetch(
    `${BINANCE_API}/api/v3/ticker/24hr?symbol=${symbol}`
  );

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    symbol: data.symbol,
    price: Number(data.lastPrice),
    priceChangePercent: Number(data.priceChangePercent),
    volume: Number(data.volume),
    quoteVolume: Number(data.quoteVolume),
    high: Number(data.highPrice),
    low: Number(data.lowPrice)
  };
}