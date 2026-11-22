/** Scale factor so full-size text width fits in maxWidth. Never above 1. */
export function wordScale(textWidth, maxWidth) {
  if (!(textWidth > 0) || !(maxWidth > 0)) return 1;
  return Math.min(1, maxWidth / textWidth);
}
