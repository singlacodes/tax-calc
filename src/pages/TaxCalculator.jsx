import { useState, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Calculator,
  IndianRupee,
  PieChart,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

  const formatIndianNumber = (value) => {
    // Remove any existing commas and non-numeric characters
    const number = value.replace(/[^\d]/g, "");

    // Handle empty or invalid input
    if (!number) return "";

    // Convert to Indian format
    const lastThree = number.substring(number.length - 3);
    const otherNumbers = number.substring(0, number.length - 3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return formatted ? formatted + "," + lastThree : lastThree;
  };

  const unformatNumber = (value) => {
    return value.replace(/[^\d]/g, "");
  };

  const InputField = ({
    label,
    value,
    onChange,
    icon: Icon,
    tooltip,
    prefix,
    type = "text",
    disabled = false,
  }) => {
    // Format the displayed value
    const displayValue =
      typeof value === "string" ? formatIndianNumber(value) : "";

    return (
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
            <span className="absolute left-3 top-3 text-gray-500">
              {prefix}
            </span>
          )}
          {Icon && (
            <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          )}
          <input
            type={type}
            value={displayValue}
            onChange={onChange}
            className={`w-full p-3 ${
              prefix ? "pl-8" : Icon ? "pl-10" : "pl-3"
            } border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            placeholder={`Enter ${label.toLowerCase()}`}
            disabled={disabled}
            inputMode="numeric"
          />
        </div>
      </div>
    );
  };

  const handleNumberInput = (e, setter, field, parentField) => {
    const rawValue = unformatNumber(e.target.value);

    if (parentField) {
      setter((prev) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [field]: rawValue,
        },
      }));
    } else {
      setter((prev) => ({
        ...prev,
        [field]: rawValue,
      }));
    }
  };

  const steps = [
    "Basic Details",
    "Income Details",
    "Deductions",
    "Tax Summary",
  ];

  const renderBasicDetails = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Basic Details</h2>
      </div>
      <div className="space-y-6">
        <InputField
          label="Age"
          value={basicDetails.age}
          onChange={(e) => handleNumberInput(e, setBasicDetails, "age")}
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

  const renderIncomeDetails = () => (
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
            onChange={(e) => handleNumberInput(e, setIncomeDetails, key)}
            prefix="₹"
            tooltip={`Enter your ${key
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()} for the financial year`}
          />
        ))}
      </div>
    </div>
  );

  const renderDeductions = () => (
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
            onChange={(e) => handleNumberInput(e, setDeductions, key)}
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

  const renderTaxSummary = () => {
    const comparison = calculateTaxComparison();

    const chartData = [
      {
        name: "Total Income",
        value: comparison.newRegime.taxableIncome + calculateTotalDeductions(),
        color: "#E3F2FD",
      },
      {
        name: "Taxable Income",
        value: comparison.newRegime.taxableIncome,
        color: "#90CAF9",
      },
      {
        name: "Deductions",
        value: calculateTotalDeductions(),
        color: "#1976D2",
      },
      {
        name: "Tax Payable",
        value: comparison.newRegime.totalTax,
        color: "#4CAF50",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Summary - FY 2025-2026 (AY 2026-2027)
            </h2>
            <a href="/calculator" className="flex gap-4">
              <button className="text-blue-500 cursor-pointer hover:text-blue-600">
                Recalculate
              </button>
            </a>
          </div>

          <div className="flex gap-8">
            {/* Left side - Chart */}
            <div className="w-1/2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Bar dataKey="value" fill="#8884d8">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right side - Details */}
            <div className="w-1/2 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Total Income</h3>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(
                    comparison.newRegime.taxableIncome +
                      calculateTotalDeductions()
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Taxable Income</h3>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(comparison.newRegime.taxableIncome)}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Tax Payable</h3>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(comparison.newRegime.totalTax)}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Exemption and Deduction
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Exempt Allowances</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Deductions</span>
                  <span>{formatCurrency(75000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chapter VI A Deductions</span>
                  <span>{formatCurrency(calculateTotalDeductions())}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Tax Calculation</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Income Tax</span>
                  <span>{formatCurrency(comparison.newRegime.basicTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surcharge</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health and Education Cess</span>
                  <span>{formatCurrency(comparison.newRegime.cess)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600">
                New Tax Regime is recommended for you. It would save you{" "}
                {formatCurrency(
                  comparison.oldRegime.totalTax - comparison.newRegime.totalTax
                )}{" "}
                in taxes.
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              ITR filing due date: July 31, 2026 (subject to change)
            </div>
          </div>
        </div>
      </div>
    );
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBasicDetails();
      case 2:
        return renderIncomeDetails();
      case 3:
        return renderDeductions();
      case 4:
        return renderTaxSummary();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl min-h-screen pt-32 mx-auto p-6">
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
