export function detectMove(previousPrice, currentPrice, volumeChange) {
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

  return {
    priceChange: Number(priceChange.toFixed(2)),
    volumeChange,
    movement,
    detected: movement !== "NORMAL"
  };
}