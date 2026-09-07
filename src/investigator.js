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

  // Price evidence
  if (Math.abs(priceChange) >= 5) {
    evidence.push({
      signal: "PRICE",
      finding: `Asset price moved ${priceChange}%`,
      weight: 25
    });
  }

  // Volume evidence
  if (volumeChange >= 50) {
    evidence.push({
      signal: "VOLUME",
      finding: `Trading volume increased by ${volumeChange}%`,
      weight: 25
    });
  }

  // BTC market context
  if (Math.abs(btcChange) >= 2) {
    evidence.push({
      signal: "BTC",
      finding: `BTC moved ${btcChange}%`,
      weight: 15
    });
  }

  // Relative strength
  if (Math.abs(priceDifference) >= 4) {
    marketType = "ASSET_SPECIFIC";

    evidence.push({
      signal: "RELATIVE_STRENGTH",
      finding:
        `The asset moved ${priceDifference.toFixed(2)} percentage points relative to BTC.`,
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

  // Open interest
  if (Math.abs(openInterestChange) >= 10) {
    evidence.push({
      signal: "OPEN_INTEREST",
      finding:
        `Open interest changed by ${openInterestChange}%`,
      weight: 10
    });
  }

  // Funding
  if (Math.abs(fundingRate) >= 0.03) {
    evidence.push({
      signal: "FUNDING",
      finding:
        `Funding rate is ${fundingRate}`,
      weight: 10
    });
  }

  // Move fingerprint
  let moveFingerprint = "UNKNOWN";

  if (
    Math.abs(btcChange) >= 2 &&
    Math.abs(priceDifference) < 4
  ) {
    moveFingerprint = "MARKET_WIDE_MOMENTUM";
  }

  if (
    Math.abs(priceDifference) >= 4 &&
    Math.abs(openInterestChange) < 10
  ) {
    moveFingerprint = "ASSET_SPECIFIC_FLOW";
  }

  if (
    Math.abs(openInterestChange) >= 10 &&
    Math.abs(priceChange) >= 5
  ) {
    moveFingerprint = "LEVERAGE_EXPANSION";
  }

  if (
    Math.abs(openInterestChange) >= 10 &&
    Math.abs(priceChange) >= 5 &&
    Math.abs(fundingRate) >= 0.03
  ) {
    moveFingerprint = "POSSIBLE_SQUEEZE";
  }

  if (
    Math.abs(priceChange) >= 5 &&
    volumeChange >= 50
  ) {
    moveFingerprint = "LIQUIDITY_SHOCK";
  }

  const confidence = Math.min(
    100,
    evidence.reduce(
      (total, item) => total + item.weight,
      0
    )
  );
const detectiveScore = Math.min(
  100,
  Math.round(
    confidence +
    Math.min(20, Math.abs(priceDifference) * 2) +
    Math.min(10, Math.abs(openInterestChange))
  )
);
  
return {
  evidence,
  confidence,
  detectiveScore,
  marketType,
  moveFingerprint,
  investigationComplete:
    evidence.length > 0
};
