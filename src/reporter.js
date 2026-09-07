export function createReport(asset, investigation) {
  const {
    evidence,
    confidence,
    marketType,
    moveFingerprint
  } = investigation;

  if (evidence.length === 0) {
    return {
      asset,
      headline: `🔎 No strong explanation found for ${asset}.`,
      confidence: 0,
      marketType: "UNCLEAR",
      moveFingerprint: "UNKNOWN",
      evidence: [],
      conclusion:
        "The available signals are not strong enough to explain the market move.",
      warning:
        "The report is based on available market data and is not financial advice."
    };
  }

  const strongestSignal = [...evidence].sort(
    (a, b) => b.weight - a.weight
  )[0];

  const evidenceList = evidence
    .map(
      (item) =>
        `- ${item.signal}: ${item.finding}`
    )
    .join("\n");

  let explanation;

  if (marketType === "ASSET_SPECIFIC") {
    explanation =
      "The asset is moving significantly differently from BTC, suggesting asset-specific activity.";
  } else if (marketType === "MARKET_WIDE") {
    explanation =
      "The asset is moving in a similar direction to BTC, suggesting broader market conditions may be involved.";
  } else {
    explanation =
      "The available signals do not clearly identify whether the move is market-wide or asset-specific.";
  }

  return {
    asset,
    headline: `🔎 Investigation Report: ${asset}`,
    confidence,
    marketType,
    moveFingerprint,
    evidence: evidenceList,
    conclusion:
      `${explanation} The strongest detected signal is ${strongestSignal.signal}.`,
    warning:
      "This report explains market conditions and is not financial advice."
  };
}