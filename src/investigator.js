export function investigateMove({
  priceChange,
  volumeChange,
  btcChange,
  openInterestChange,
  fundingRate
}) {
  const evidence = [];
  let marketType = "UNCLEAR";

  const priceDifference = priceChange - btcChange;

  if (Math.abs(priceChange) >= 5) {
    evidence.push({
      signal: "PRICE",
      finding: `Asset price moved ${priceChange}%`,
      weight: 25
    });
  }

  if (volumeChange >= 50) {
    evidence.push({
      signal: "VOLUME",
      finding: `Trading volume increased by ${volumeChange}%`,
      weight: 25
    });
  }

  if (Math.abs(btcChange) >= 2) {
    evidence.push({
      signal: "BTC",
      finding: `BTC moved ${btcChange}%`,
      weight: 15
    });
  }

  if (Math.abs(priceDifference) >= 4) {
    marketType = "ASSET_SPECIFIC";

    evidence.push({
      signal: "RELATIVE_STRENGTH",
      finding:
        `The asset moved ${priceDifference.toFixed(2)} percentage points ` +
        `relative to BTC.`,
      weight: 20
    });
  } else if (Math.abs(btcChange) >= 2) {
    marketType = "MARKET_WIDE";

    evidence.push({
      signal: "MARKET_CONTEXT",
      finding:
        "BTC and the selected asset are moving in a similar direction.",
      weight: 20
    });
  }

  if (Math.abs(openInterestChange) >= 10) {
    evidence.push({
      signal: "OPEN_INTEREST",
      finding:
        `Open interest changed by ${openInterestChange}%`,
      weight: 10
    });
  }

  if (Math.abs(fundingRate) >= 0.03) {
    evidence.push({
      signal: "FUNDING",
      finding:
        `Funding rate is ${fundingRate}%`,
      weight: 10
    });
  }

  const confidence = Math.min(
    100,
    evidence.reduce((total, item) => total + item.weight, 0)
  );

  return {
    evidence,
    confidence,
    marketType,
    investigationComplete: evidence.length > 0
  };
}