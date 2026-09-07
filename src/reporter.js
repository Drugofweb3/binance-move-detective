export function createReport(asset, investigation) {
  const { evidence, confidence } = investigation;

  if (evidence.length === 0) {
    return {
      asset,
      headline: `No strong explanation found for ${asset}.`,
      confidence: 0,
      evidence: [],
      conclusion:
        "The available signals are not strong enough to explain the market move."
    };
  }

  const strongestSignal = [...evidence].sort(
    (a, b) => b.weight - a.weight
  )[0];

  const evidenceList = evidence
    .map((item) => `- ${item.signal}: ${item.finding}`)
    .join("\n");

  return {
    asset,
    headline: `🔎 Investigation report for ${asset}`,
    confidence,
    evidence: evidenceList,
    conclusion:
      `The strongest detected signal is ${strongestSignal.signal}. ` +
      `The available evidence gives this explanation a ${confidence}% confidence level.`,
    warning:
      "This report explains market conditions. It is not financial advice."
  };
}