import { useState, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Calculator,
  IndianRupee,
  PieChart,
  Info,
} from "lucide-react";

const TaxCalculator = () => {
  const [step, setStep] = useState(1);
  const [basicDetails, setBasicDetails] = useState({
    age: "",
    financialYear: "2025-26",
  });

  const [incomeDetails, setIncomeDetails] = useState({
    salary: 0,
    hra: 0,
    lta: 0,
    professionalTax: 0,
    interestIncome: 0,
    rentalIncome: 0,
    homeLoanInterest: 0,
  });

  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    section80G: 0,
    section80EEA: 0,
    otherDeductions: 0,
  });

  // Calculate total deductions with caps
  const calculateTotalDeductions = useCallback(() => {
    const totalSection80C = Math.min(deductions.section80C, 150000);
    const totalSection80D = Math.min(deductions.section80D, 100000);
    const totalSection80EEA = Math.min(deductions.section80EEA, 150000);
    const totalOtherDeductions =
      deductions.section80G + deductions.otherDeductions;

    return Math.min(
      totalSection80C +
        totalSection80D +
        totalSection80EEA +
        totalOtherDeductions,
      350000
    );
  }, [deductions]);

  // Calculate taxable income for both regimes
  const calculateTaxableIncome = useCallback(
    (regime) => {
      const totalIncome =
        Number(incomeDetails.salary) +
        Number(incomeDetails.hra) +
        Number(incomeDetails.lta) +
        Number(incomeDetails.interestIncome) +
        Number(incomeDetails.rentalIncome);

      if (regime === "new") {
        const standardDeduction = 75000;
        return Math.max(
          0,
          totalIncome -
            standardDeduction -
            Number(incomeDetails.professionalTax)
        );
      } else {
        const standardDeduction = 50000;
        const totalDeductions = calculateTotalDeductions();
        return Math.max(
          0,
          totalIncome -
            standardDeduction -
            Number(incomeDetails.professionalTax) -
            totalDeductions
        );
      }
    },
    [incomeDetails, calculateTotalDeductions]
  );

  // Calculate tax for new regime
  const calculateNewRegimeTax = useCallback((income) => {
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.1 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.2 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.3 },
    ];

    return calculateSlabwiseTax(income, slabs);
  }, []);

  // Calculate tax for old regime
  const calculateOldRegimeTax = useCallback((income) => {
    const slabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.1 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    return calculateSlabwiseTax(income, slabs);
  }, []);

  // Common function to calculate slabwise tax
  const calculateSlabwiseTax = (income, slabs) => {
    let remainingIncome = income;
    let tax = 0;
    let previousLimit = 0;
    const breakdown = [];

    for (const slab of slabs) {
      const slabIncome = Math.min(
        Math.max(0, remainingIncome),
        slab.limit - previousLimit
      );
      const slabTax = slabIncome * slab.rate;

      if (slabIncome > 0) {
        breakdown.push({
          range: `${formatCurrency(previousLimit)} to ${
            slab.limit === Infinity ? "Above" : formatCurrency(slab.limit)
          }`,
          income: slabIncome,
          rate: slab.rate * 100,
          tax: slabTax,
        });
      }

      tax += slabTax;
      remainingIncome -= slabIncome;
      previousLimit = slab.limit;

      if (remainingIncome <= 0) break;
    }

    let taxAfterRebate = income <= 1275000 ? 0 : tax;
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;

    return {
      basicTax: tax,
      rebate: tax - taxAfterRebate,
      cess,
      totalTax,
      breakdown,
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate tax comparison
  const calculateTaxComparison = useCallback(() => {
    const newRegimeIncome = calculateTaxableIncome("new");
    const oldRegimeIncome = calculateTaxableIncome("old");

    const newRegimeTax = calculateNewRegimeTax(newRegimeIncome);
    const oldRegimeTax = calculateOldRegimeTax(oldRegimeIncome);

    return {
      newRegime: {
        taxableIncome: newRegimeIncome,
        ...newRegimeTax,
      },
      oldRegime: {
        taxableIncome: oldRegimeIncome,
        ...oldRegimeTax,
      },
    };
  }, [calculateTaxableIncome, calculateNewRegimeTax, calculateOldRegimeTax]);

  // Input component for better UX
  const InputField = ({
    label,
    value,
    onChange,
    icon: Icon,
    tooltip,
    prefix,
    type = "number",
    disabled = false,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg -top-2 left-6">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-3 text-gray-500">{prefix}</span>
        )}
        {Icon && (
          <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full p-3 ${
            prefix ? "pl-8" : Icon ? "pl-10" : "pl-3"
          } border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
          disabled={disabled}
          min="0"
        />
      </div>
    </div>
  );

  const steps = [
    "Basic Details",
    "Income Details",
    "Deductions",
    "Tax Summary",
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Basic Details</h2>
            </div>
            <div className="space-y-6">
              <InputField
                label="Age"
                value={basicDetails.age}
                onChange={(e) =>
                  setBasicDetails({ ...basicDetails, age: e.target.value })
                }
                tooltip="Your age as of the assessment year"
                type="number"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Financial Year
                </label>
                <select
                  value={basicDetails.financialYear}
                  onChange={(e) =>
                    setBasicDetails({
                      ...basicDetails,
                      financialYear: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <IndianRupee className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Income Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(incomeDetails).map(([key, value]) => (
                <InputField
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={value}
                  onChange={(e) =>
                    setIncomeDetails({
                      ...incomeDetails,
                      [key]: Number(e.target.value),
                    })
                  }
                  prefix="₹"
                  tooltip={`Enter your ${key
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()} for the financial year`}
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Deductions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(deductions).map(([key, value]) => (
                <InputField
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={value}
                  onChange={(e) =>
                    setDeductions({
                      ...deductions,
                      [key]: Number(e.target.value),
                    })
                  }
                  prefix="₹"
                  tooltip={`Maximum deduction under ${key}: ${
                    key === "section80C"
                      ? "₹1,50,000"
                      : key === "section80D"
                      ? "₹1,00,000"
                      : key === "section80EEA"
                      ? "₹1,50,000"
                      : "As applicable"
                  }`}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        const comparison = calculateTaxComparison();
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Regime Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">New Tax Regime</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxable Income</span>
                    <span className="font-medium">
                      {formatCurrency(comparison.newRegime.taxableIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax Amount</span>
                    <span className="font-medium">
                      {formatCurrency(comparison.newRegime.totalTax)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Old Regime Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Old Tax Regime</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxable Income</span>
                    <span className="font-medium">
                      {formatCurrency(comparison.oldRegime.taxableIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax Amount</span>
                    <span className="font-medium">
                      {formatCurrency(comparison.oldRegime.totalTax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Detailed Tax Breakdown
              </h3>
              <div className="space-y-6">
                {["new", "old"].map((regime) => {
                  const taxData =
                    regime === "new"
                      ? comparison.newRegime
                      : comparison.oldRegime;
                  return (
                    <div key={regime} className="space-y-4">
                      <h4 className="font-medium">
                        {regime === "new" ? "New" : "Old"} Regime Calculation
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {taxData.breakdown.map((slab, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-4 text-sm py-2">
                            <span>{slab.range}</span>
                            <span>{formatCurrency(slab.income)}</span>
                            <span>{slab.rate}%</span>
                            <span className="text-right">
                              {formatCurrency(slab.tax)}
                            </span>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <span>Basic Tax</span>
                            <span className="text-right">
                              {formatCurrency(taxData.basicTax)}
                            </span>
                            <span>Rebate (87A)</span>
                            <span className="text-right text-red-600">
                              -{formatCurrency(taxData.rebate)}
                            </span>
                            <span>Health & Education Cess (4%)</span>
                            <span className="text-right">
                              {formatCurrency(taxData.cess)}
                            </span>
                            <span className="font-medium">Total Tax</span>
                            <span className="text-right font-medium">
                              {formatCurrency(taxData.totalTax)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-blue-50 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Tax Saving Recommendation
              </h3>
              <div className="space-y-4">
                <p className="text-blue-700">
                  {comparison.newRegime.totalTax <
                  comparison.oldRegime.totalTax ? (
                    <>
                      The New Tax Regime is better for you. You can save{" "}
                      {formatCurrency(
                        comparison.oldRegime.totalTax -
                          comparison.newRegime.totalTax
                      )}{" "}
                      annually by choosing the new regime.
                    </>
                  ) : (
                    <>
                      The Old Tax Regime is better for you. You can save{" "}
                      {formatCurrency(
                        comparison.newRegime.totalTax -
                          comparison.oldRegime.totalTax
                      )}{" "}
                      annually by choosing the old regime.
                    </>
                  )}
                </p>
                <div className="bg-white rounded-lg p-4 text-sm text-gray-600">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Key Points:
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      • New regime offers a higher standard deduction of ₹75,000
                    </li>
                    <li>
                      • Old regime allows additional deductions under Chapter
                      VI-A
                    </li>
                    <li>
                      • Tax rebate under Section 87A applies up to ₹12,75,000
                    </li>
                    <li>
                      • Consider your investment and insurance needs while
                      choosing the regime
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((stepName, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === step
                  ? "bg-blue-500 text-white"
                  : index + 1 < step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}>
              {index + 1}
            </div>
            <span className="text-sm mt-2 text-gray-600">{stepName}</span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-full w-full h-0.5 -mx-2 ${
                  index + 1 < step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl min-h-screen pt-32 mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Income Tax Calculator 2025-26
        </h1>
        <p className="text-gray-600">
          Compare your tax liability under both old and new tax regimes
        </p>
      </div>

      <StepIndicator />
      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-6 cursor-pointer py-3 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => setStep((prev) => Math.min(4, prev + 1))}
          disabled={step === 4}
          className="px-6 cursor-pointer py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {step === 3 ? "Calculate" : "Next"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;
