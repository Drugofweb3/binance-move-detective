import { detectMove } from "./detector.js";
import { investigateMove } from "./investigator.js";
import { createReport } from "./reporter.js";

const marketData = {
  asset: "SOLUSDT",
  previousPrice: 180,
  currentPrice: 194,
  volumeChange: 72,
  btcChange: 2.4,
  openInterestChange: 13,
  fundingRate: 0.04
};

const detection = detectMove(
  marketData.previousPrice,
  marketData.currentPrice,
  marketData.volumeChange
);

console.log("\n🔎 BINANCE MOVE DETECTIVE");
console.log("==========================");

console.log(
  `\n${marketData.asset} moved ${detection.priceChange}%`
);

console.log(`Movement: ${detection.movement}`);

if (!detection.detected) {
  console.log("\nNo unusual market movement detected.");
  process.exit(0);
}

const investigation = investigateMove({
  priceChange: detection.priceChange,
  volumeChange: marketData.volumeChange,
  btcChange: marketData.btcChange,
  openInterestChange: marketData.openInterestChange,
  fundingRate: marketData.fundingRate
});

const report = createReport(
  marketData.asset,
  investigation
);

console.log("\n" + report.headline);
console.log(`Confidence: ${report.confidence}%`);

console.log("\nEvidence:");
console.log(report.evidence);

console.log("\nConclusion:");
console.log(report.conclusion);

console.log("\n⚠️ " + report.warning);