const BINANCE_API = "https://api.binance.com";
const BINANCE_FUTURES_API = "https://fapi.binance.com";

async function request(baseUrl, endpoint) {
  const response = await fetch(`${baseUrl}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  return response.json();
}

export async function getTicker(symbol) {
  const data = await request(
    BINANCE_API,
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

export async function getFuturesContext(symbol) {
  const [currentOI, funding, oiHistory] = await Promise.all([
    request(
      BINANCE_FUTURES_API,
      `/fapi/v1/openInterest?symbol=${symbol}`
    ),

    request(
      BINANCE_FUTURES_API,
      `/fapi/v1/premiumIndex?symbol=${symbol}`
    ),

    request(
      BINANCE_FUTURES_API,
      `/futures/data/openInterestHist?symbol=${symbol}&period=5m&limit=2`
    )
  ]);

  const currentOpenInterest =
    Number(currentOI.openInterest);

  let openInterestChange = 0;

  if (oiHistory.length >= 2) {
    const previous =
      Number(oiHistory[0].sumOpenInterest);

    const latest =
      Number(oiHistory[1].sumOpenInterest);

    if (previous > 0) {
      openInterestChange =
        ((latest - previous) / previous) * 100;
    }
  }

  return {
    openInterest: currentOpenInterest,
    openInterestChange:
      Number(openInterestChange.toFixed(2)),
    fundingRate:
      Number(funding.lastFundingRate)
  };
}

export async function getMarketContext(symbol) {
  const [asset, btc, futures] = await Promise.all([
    getTicker(symbol),
    getTicker("BTCUSDT"),
    getFuturesContext(symbol)
  ]);

  return {
    asset,
    btc,
    futures
  };
}