import { getMarketContext } from "./binance.js";
import { detectMove } from "./detector.js";
import { investigateMove } from "./investigator.js";
import { createReport } from "./reporter.js";
import { generateAIInvestigation } from "./ai.js";

const symbol = "SOLUSDT";

async function runDetective() {
  try {
    console.log("\n🔎 BINANCE MOVE DETECTIVE");
    console.log("==========================");

    console.log(`\nInvestigating ${symbol}...`);

    const market = await getMarketContext(symbol);

    const asset = market.asset;
    const btc = market.btc;
    const futures = market.futures;

    console.log(`\n${asset.symbol}`);
    console.log(`Price: $${asset.price}`);
    console.log(`24h change: ${asset.priceChangePercent}%`);
    console.log(`24h volume: ${asset.volume}`);

    console.log(`\nBTCUSDT`);
    console.log(`24h change: ${btc.priceChangePercent}%`);

    console.log(`\nFutures Context`);
    console.log(`Open Interest: ${futures.openInterest}`);
    console.log(`Open Interest Change: ${futures.openInterestChange}%`);
    console.log(`Funding Rate: ${futures.fundingRate}`);

    const previousPrice =
      asset.price / (1 + asset.priceChangePercent / 100);

    const detection = detectMove(
      previousPrice,
      asset.price,
      0
    );

    console.log(`\nMovement: ${detection.movement}`);

    if (!detection.detected) {
      console.log("\nNo major unusual movement detected.");
      return;
    }

    const investigation = investigateMove({
      priceChange: asset.priceChangePercent,
      volumeChange: 0,
      btcChange: btc.priceChangePercent,
      openInterestChange: futures.openInterestChange,
      fundingRate: futures.fundingRate
    });

    const report = createReport(
      symbol,
      investigation
    );

    const aiAnalysis = generateAIInvestigation({
      asset: symbol,
      priceChange: asset.priceChangePercent,
      btcChange: btc.priceChangePercent,
      openInterestChange: futures.openInterestChange,
      fundingRate: futures.fundingRate,
      marketType: investigation.marketType,
      evidence: investigation.evidence
    });

    console.log("\n" + report.headline);
    console.log(`Confidence: ${report.confidence}%`);

    console.log(
      `Market type: ${investigation.marketType}`
    );

console.log(
  `Move fingerprint: ${investigation.moveFingerprint}`
);

    console.log("\nEvidence:");
    console.log(report.evidence);

    console.log("\nConclusion:");
    console.log(report.conclusion);

    console.log("\n🤖 AI Investigation:");
    console.log(aiAnalysis.explanation);

    console.log("\nFutures Context:");
    console.log(aiAnalysis.futuresContext);

    console.log("\nNext Question:");
    console.log(aiAnalysis.nextQuestion);

    console.log("\n⚠️ " + aiAnalysis.disclaimer);

  } catch (error) {
    console.error("\n❌ Detective error:");
    console.error(error.message);
  }
}

runDetective();