// Base costs in AED (matching spreadsheet)
export const FEATURE_COSTS = {
  tiles: { cost: 300, unit: 'm²' },
  pool: { cost: 5250, unit: 'unit', fixedUnits: 6 }, // 5250 × 6 = 31,500
  seating: { cost: 600, unit: 'unit' },
  bar: { cost: 600, unit: 'unit' },
  pizzaOven: { cost: 9000, unit: 'unit' }, // binary = one unit
  grill: { cost: 7500, unit: 'unit' },     // binary = one unit
  fridge: { cost: 2250, unit: 'unit' },    // binary = one unit
  pergola: { cost: 750, unit: 'm²' },
  trees: { cost: 195, unit: 'unit' },
  lighting: { cost: 45, unit: 'm²' },
  artificialGrass: { cost: 75, unit: 'm²' }
};

export const BUDGET_MULTIPLIERS = {
  economic: 0.8,
  standard: 1.0,
  highEnd: 1.4,
  superHighEnd: 2.0
};

export const PAYMENT_PLANS = {
  '3months': { markup: 0.05, downpayment: 0.30, moveIn: 0.10, months: 3 },
  '6months': { markup: 0.10, downpayment: 0.25, moveIn: 0.10, months: 6 },
  '12months': { markup: 0.15, downpayment: 0.10, moveIn: 0.10, months: 12 }
};

export const AED_TO_USD_RATE = 0.27;

export interface CalculationInputs {
  size: number;
  features: {
    tiles: boolean;
    pool: boolean;
    seating: boolean;
    bar: boolean;
    pizzaOven: boolean;
    grill: boolean;
    fridge: boolean;
    pergola: boolean;
    trees: boolean;
    lighting: boolean;
    artificialGrass: boolean;
  };
  budget: keyof typeof BUDGET_MULTIPLIERS;
}

export interface CalculationResult {
  baseCost: number;
  plans: {
    [key: string]: {
      totalCost: number;
      downpayment: number;
      moveIn: number;
      monthlyInstallment: number;
      months: number;
    };
  };
}

export const calculateBaseCost = (inputs: CalculationInputs): number => {
  let baseCost = 0;

  Object.entries(inputs.features).forEach(([feature, isSelected]) => {
    if (isSelected && FEATURE_COSTS[feature as keyof typeof FEATURE_COSTS]) {
      const featureCost = FEATURE_COSTS[feature as keyof typeof FEATURE_COSTS];
      
      if (feature === 'pool' && 'fixedUnits' in featureCost) {
        baseCost += featureCost.cost * featureCost.fixedUnits;
      } else if (featureCost.unit === 'm²') {
        baseCost += featureCost.cost * inputs.size;
      } else {
        baseCost += featureCost.cost;
      }
    }
  });

  // Apply budget multiplier
  baseCost *= BUDGET_MULTIPLIERS[inputs.budget];

  return baseCost;
};

export const calculatePaymentPlans = (baseCost: number): CalculationResult['plans'] => {
  const plans: CalculationResult['plans'] = {};

  Object.entries(PAYMENT_PLANS).forEach(([planKey, plan]) => {
    const totalCost = baseCost * (1 + plan.markup);
    const downpayment = totalCost * plan.downpayment;
    const moveIn = totalCost * plan.moveIn;
    const remainingAmount = totalCost - downpayment - moveIn;
    const monthlyInstallment = remainingAmount / plan.months;

    plans[planKey] = {
      totalCost,
      downpayment,
      moveIn,
      monthlyInstallment,
      months: plan.months
    };
  });

  return plans;
};

export const convertCurrency = (amount: number, fromAED: boolean): number => {
  return fromAED ? amount * AED_TO_USD_RATE : amount / AED_TO_USD_RATE;
};

export const formatCurrency = (amount: number, currency: 'AED' | 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};