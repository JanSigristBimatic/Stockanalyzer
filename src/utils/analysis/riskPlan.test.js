import { describe, it, expect } from 'vitest';
import { calcRiskPlan } from './riskPlan';

const BASE = {
  price: 100,
  atr: 2,
  supports: [{ price: 95 }, { price: 90 }, { price: 102 }],
  resistances: [{ price: 110 }, { price: 120 }, { price: 98 }],
  stopMethod: 'atr',
  accountSize: 10000,
  riskPercent: 1,
  exchangeRate: 1
};

describe('calcRiskPlan', () => {
  it('places the ATR stop two ATR below the price and sizes the position by the risk budget', () => {
    const plan = calcRiskPlan(BASE);

    expect(plan.stopPrice).toBe(96);
    expect(plan.shares).toBe(25);
    expect(plan.positionValue).toBe(2500);
    expect(plan.riskAmount).toBe(100);
  });

  it('uses the nearest resistance above the price as target', () => {
    const plan = calcRiskPlan(BASE);

    expect(plan.targetPrice).toBe(110);
    expect(plan.rewardRiskRatio).toBe(2.5);
  });

  it('places the support stop half an ATR below the nearest support under the price', () => {
    expect(calcRiskPlan({ ...BASE, stopMethod: 'support' }).stopPrice).toBe(94);
  });

  it('returns null without a support below the price', () => {
    expect(calcRiskPlan({ ...BASE, stopMethod: 'support', supports: [{ price: 105 }] })).toBeNull();
  });

  it('converts the risk into the account currency', () => {
    expect(calcRiskPlan({ ...BASE, exchangeRate: 0.8 }).shares).toBe(31);
  });

  it('caps the position at the account size', () => {
    const plan = calcRiskPlan({ ...BASE, atr: 0.25, accountSize: 1000, riskPercent: 5 });

    expect(plan.shares).toBe(10);
    expect(plan.isLimitedByAccount).toBe(true);
  });
});
