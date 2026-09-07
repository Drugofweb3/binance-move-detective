export function investigateMove({
  priceChange,
  volumeChange,
  btcChange,
  openInterestChange,
  fundingRate
}) {
  const evidence = [];

  if (Math.abs(priceChange) >= 5) {
    evidence.push({
      signal: "PRICE",
      finding: `Price moved ${priceChange}%`,
      weight: 30
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

  if (Math.abs(openInterestChange) >= 10) {
    evidence.push({
      signal: "OPEN_INTEREST",
      finding: `Open interest changed by ${openInterestChange}%`,
      weight: 15
    });
  }

  if (Math.abs(fundingRate) >= 0.03) {
    evidence.push({
      signal: "FUNDING",
      finding: `Funding rate is ${fundingRate}%`,
      weight: 15
    });
  }

  const confidence = Math.min(
    100,
    evidence.reduce((total, item) => total + item.weight, 0)
  );

  return {
    evidence,
    confidence,
    investigationComplete: evidence.length > 0
  };
}