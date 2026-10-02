/**
 * Finds the most recent bar at which the fast series crossed the slow series
 * @param {Array<number|null>} fast - Fast series, e.g. SMA 50
 * @param {Array<number|null>} slow - Slow series, e.g. SMA 200
 * @returns {{index: number, direction: 'up'|'down'}|null} - null if the series never crossed
 */
export function findLastCrossover(fast, slow) {
  for (let i = fast.length - 1; i > 0; i--) {
    // Both series are null only during their warm-up at the start
    if ([fast[i], slow[i], fast[i - 1], slow[i - 1]].some(value => value == null)) return null;

    const previousGap = fast[i - 1] - slow[i - 1];
    const currentGap = fast[i] - slow[i];
    if (previousGap <= 0 && currentGap > 0) return { index: i, direction: 'up' };
    if (previousGap >= 0 && currentGap < 0) return { index: i, direction: 'down' };
  }
  return null;
}
