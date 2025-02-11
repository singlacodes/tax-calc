// Tax slab constants
export const NEW_REGIME_SLABS = [
  { limit: 400000, rate: 0 },
  { limit: 800000, rate: 0.05 },
  { limit: 1200000, rate: 0.1 },
  { limit: 1600000, rate: 0.15 },
  { limit: 2000000, rate: 0.2 },
  { limit: 2400000, rate: 0.25 },
  { limit: Infinity, rate: 0.3 }
];

export const OLD_REGIME_SLABS = [
  { limit: 300000, rate: 0 },
  { limit: 600000, rate: 0.05 },
  { limit: 900000, rate: 0.1 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 }
];

export const calculateTaxableIncome = (incomeDetails, regime, totalDeductions = 0) => {
  const totalIncome = Object.values(incomeDetails).reduce((sum, val) => sum + val, 0);
  const standardDeduction = regime === 'new' ? 75000 : 50000;

  return Math.max(0, totalIncome - standardDeduction - (regime === 'old' ? totalDeductions : 0));
};

export const calculateSlabwiseTax = (income, slabs) => {
  let remainingIncome = income;
  let tax = 0;
  let previousLimit = 0;
  const breakdown = [];

  for (const slab of slabs) {
    const slabIncome = Math.min(Math.max(0, remainingIncome), slab.limit - previousLimit);
    const slabTax = slabIncome * slab.rate;

    if (slabIncome > 0) {
      breakdown.push({
        range: `${previousLimit} to ${slab.limit === Infinity ? 'Above' : slab.limit}`,
        income: slabIncome,
        rate: slab.rate * 100,
        tax: slabTax
      });
    }

    tax += slabTax;
    remainingIncome -= slabIncome;
    previousLimit = slab.limit;

    if (remainingIncome <= 0) break;
  }

  // Apply rebate under section 87A
  const taxAfterRebate = income <= 1275000 ? 0 : tax;
  const cess = taxAfterRebate * 0.04;

  return {
    basicTax: tax,
    rebate: tax - taxAfterRebate,
    cess,
    totalTax: taxAfterRebate + cess,
    breakdown
  };
};