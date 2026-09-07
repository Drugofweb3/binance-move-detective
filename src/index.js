import { getTicker } from "./binance.js";
import { detectMove } from "./detector.js";
import { investigateMove } from "./investigator.js";
import { createReport } from "./reporter.js";

const symbol = "SOLUSDT";

async function runDetective() {
  try {
    console.log("\n🔎 BINANCE MOVE DETECTIVE");
    console.log("==========================");

    console.log(`\nInvestigating ${symbol}...`);

    const ticker = await getTicker(symbol);

    console.log(`Current price: $${ticker.price}`);
    console.log(`24h change: ${ticker.priceChangePercent}%`);
    console.log(`24h volume: ${ticker.volume}`);

    const detection = detectMove(
      ticker.price / (1 + ticker.priceChangePercent / 100),
      ticker.price,
      0
    );

    console.log(`Movement: ${detection.movement}`);

    if (!detection.detected) {
      console.log("\nNo major unusual movement detected.");
      return;
    }

    const investigation = investigateMove({
      priceChange: ticker.priceChangePercent,
      volumeChange: 0,
      btcChange: 0,
      openInterestChange: 0,
      fundingRate: 0
    });

    const report = createReport(symbol, investigation);

    console.log("\n" + report.headline);
    console.log(`Confidence: ${report.confidence}%`);

    console.log("\nEvidence:");
    console.log(report.evidence);

    console.log("\nConclusion:");
    console.log(report.conclusion);

    console.log("\n⚠️ " + report.warning);

  } catch (error) {
    console.error("\n❌ Detective error:");
    console.error(error.message);
  }
}

runDetective();