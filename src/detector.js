export function detectMove(
  previousPrice,
  currentPrice,
  volumeChange = 0
) {
  const priceChange =
    ((currentPrice - previousPrice) / previousPrice) * 100;

  const absPriceChange = Math.abs(priceChange);

  let movement = "NORMAL";

  if (absPriceChange >= 10) {
    movement = "EXTREME";
  } else if (absPriceChange >= 5) {
    movement = "STRONG";
  } else if (absPriceChange >= 2) {
    movement = "UNUSUAL";
  }

  const volumeAnomaly = volumeChange >= 50;

  return {
    priceChange: Number(priceChange.toFixed(2)),
    volumeChange,
    volumeAnomaly,
    movement,
    detected:
      movement !== "NORMAL" || volumeAnomaly
  };
}