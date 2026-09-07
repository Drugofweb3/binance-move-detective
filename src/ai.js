export function generateAIInvestigation({
  asset,
  priceChange,
  btcChange,
  openInterestChange,
  fundingRate,
  marketType,
  evidence
}) {
  const direction =
    priceChange > 0 ? "up" : "down";

  const evidenceText = evidence
    .map((item) => item.finding)
    .join("; ");

  let explanation;

  if (marketType === "ASSET_SPECIFIC") {
    explanation =
      `${asset} moved ${direction} by ${Math.abs(priceChange)}%, ` +
      `while BTC moved ${btcChange}%. ` +
      `The difference suggests an asset-specific catalyst or trading activity.`;
  } else if (marketType === "MARKET_WIDE") {
    explanation =
      `${asset} moved ${direction} by ${Math.abs(priceChange)}%, ` +
      `while BTC also moved ${btcChange}%. ` +
      `This suggests the movement may be connected to broader market conditions.`;
  } else {
    explanation =
      `The available signals do not clearly identify the main cause of the move.`;
  }

  return {
    title: `AI Investigation: ${asset}`,
    explanation,
    evidence: evidenceText,
    futuresContext:
      `Open interest change: ${openInterestChange}%. ` +
      `Funding rate: ${fundingRate}.`,
    nextQuestion:
      "Continue monitoring price, volume and derivatives activity for confirmation.",
    disclaimer:
      "This AI analysis is informational and is not financial advice."
  };
}