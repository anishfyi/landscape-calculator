import { describe, it, expect } from 'vitest';
import { calculateBaseCost, calculatePaymentPlans, convertCurrency, FEATURE_COSTS, BUDGET_MULTIPLIERS } from './calculations';
import { render } from '@testing-library/react'
import React from 'react'
import { PlanCard } from '@/components/PlanCard'

const baseFeatures = Object.keys(FEATURE_COSTS).reduce((acc, key) => ({...acc, [key]: false}), {} as any);

describe('calculateBaseCost', () => {
  it('handles zero and negative sizes safely', () => {
    const inputsZero = { size: 0, features: { ...baseFeatures, tiles: true }, budget: 'standard' as const };
    const inputsNegative = { size: -10, features: { ...baseFeatures, tiles: true }, budget: 'standard' as const };
    expect(calculateBaseCost(inputsZero)).toBe(0);
    expect(calculateBaseCost(inputsNegative)).toBe(0);
  });

  it('applies budget multiplier', () => {
    const inputs = { size: 10, features: { ...baseFeatures, tiles: true }, budget: 'highEnd' as const };
    const base = 10 * FEATURE_COSTS.tiles.cost;
    expect(calculateBaseCost(inputs)).toBeCloseTo(base * BUDGET_MULTIPLIERS.highEnd);
  });

  it('handles fixed unit pool correctly', () => {
    const inputs = { size: 10, features: { ...baseFeatures, pool: true }, budget: 'standard' as const };
    const base = FEATURE_COSTS.pool.cost * (FEATURE_COSTS.pool as any).fixedUnits;
    expect(calculateBaseCost(inputs)).toBe(base);
  });
});

describe('calculatePaymentPlans', () => {
  it('sums to total and divides monthly correctly', () => {
    const plans = calculatePaymentPlans(10000);
    Object.values(plans).forEach(plan => {
      const remaining = plan.totalCost - plan.downpayment - plan.moveIn;
      expect(plan.monthlyInstallment * plan.months).toBeCloseTo(remaining);
    });
  });
});

describe('convertCurrency', () => {
  it('converts aed to usd and back', () => {
    const usd = convertCurrency(100, true);
    const aed = convertCurrency(usd, false);
    expect(aed).toBeCloseTo(100);
  });
});

describe('PlanCard layout', () => {
  it('renders long amounts without crashing (sanity check)', () => {
    const { getByLabelText } = render(
      <PlanCard
        title="12months"
        totalCost={2207929.5}
        downpayment={987654.32}
        moveIn={123456.78}
        monthlyInstallment={99999.99}
        months={12}
        currency="AED"
      />
    )
    expect(getByLabelText('Total cost')).toBeTruthy()
    expect(getByLabelText('Monthly installment')).toBeTruthy()
  })
})


