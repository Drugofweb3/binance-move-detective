const BINANCE_API = "https://api.binance.com";

async function binanceRequest(endpoint) {
  const response = await fetch(`${BINANCE_API}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  return response.json();
}

export async function getTicker(symbol) {
  const data = await binanceRequest(
    `/api/v3/ticker/24hr?symbol=${symbol}`
  );

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

export async function getMarketContext(symbol) {
  const [asset, btc] = await Promise.all([
    getTicker(symbol),
    getTicker("BTCUSDT")
  ]);

  return {
    asset,
    btc
  };
}