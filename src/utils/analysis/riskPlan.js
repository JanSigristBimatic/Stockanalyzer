const ATR_STOP_MULTIPLE = 2;
const SUPPORT_STOP_BUFFER_ATR = 0.5;

/**
 * Position sizing for a long trade at the current price with a fixed risk per trade.
 * Prices are in quote units; `exchangeRate` converts one quote unit into the account currency.
 * @param {Object} input
 * @param {number} input.price - Entry price
 * @param {number} input.atr - Average true range
 * @param {Array<{price: number}>} input.supports - Support levels
 * @param {Array<{price: number}>} input.resistances - Resistance levels
 * @param {'atr'|'support'} input.stopMethod - Stop 2x ATR below the price or 0.5x ATR below the nearest support
 * @param {number} input.accountSize - Account size in account currency
 * @param {number} input.riskPercent - Risk per trade in percent of the account
 * @param {number} input.exchangeRate - Account currency per quote unit
 * @returns {Object|null} - null when no stop below the price exists
 */
export function calcRiskPlan({ price, atr, supports, resistances, stopMethod, accountSize, riskPercent, exchangeRate }) {
  const stopPrice = stopMethod === 'support' ? stopBelowSupport(price, atr, supports) : price - ATR_STOP_MULTIPLE * atr;
  if (stopPrice == null || stopPrice <= 0 || stopPrice >= price) return null;

  const riskPerShare = price - stopPrice;
  const riskBudget = (accountSize * riskPercent) / 100;
  const sharesByRisk = Math.floor(riskBudget / (riskPerShare * exchangeRate));
  const sharesByAccount = Math.floor(accountSize / (price * exchangeRate));
  const shares = Math.min(sharesByRisk, sharesByAccount);
  const target = nearestAbove(resistances, price);

  return {
    stopPrice,
    stopDistancePercent: (riskPerShare / price) * 100,
    shares,
    positionValue: shares * price * exchangeRate,
    riskAmount: shares * riskPerShare * exchangeRate,
    isLimitedByAccount: sharesByAccount < sharesByRisk,
    targetPrice: target?.price ?? null,
    rewardRiskRatio: target ? (target.price - price) / riskPerShare : null
  };
}

function stopBelowSupport(price, atr, supports) {
  const support = nearestBelow(supports, price);
  return support ? support.price - SUPPORT_STOP_BUFFER_ATR * atr : null;
}

function nearestBelow(levels, price) {
  return levels.filter(level => level.price < price).sort((a, b) => b.price - a.price)[0] ?? null;
}

function nearestAbove(levels, price) {
  return levels.filter(level => level.price > price).sort((a, b) => a.price - b.price)[0] ?? null;
}
