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
  Tooltip as RechartsTooltip,
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

  const calculateTotalIncome = useCallback(() => {
    const totalIncome =
      Number(incomeDetails.salary) +
      Number(incomeDetails.hra) +
      Number(incomeDetails.lta) +
      Number(incomeDetails.interestIncome) +
      Number(incomeDetails.rentalIncome);

    return totalIncome;
  }, [incomeDetails]);

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

  const formatIndianNumber = (value) => {
    // Remove any existing commas and non-numeric characters
    const number = value.replace(/[^\d]/g, "");
    if (!number) return "";
    const lastThree = number.substring(number.length - 3);
    const otherNumbers = number.substring(0, number.length - 3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return formatted ? formatted + "," + lastThree : lastThree;
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
    // Fix cursor position issue by maintaining raw value in state
    const [inputValue, setInputValue] = useState(value.toString());

    // Handle input change while maintaining cursor position
    const handleChange = (e) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      setInputValue(rawValue);
      onChange({ target: { value: rawValue } });
    };

    return (
      <div className="space-y-2 group transition-all duration-200">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          {label}
          {tooltip && (
            <div className="group/tooltip relative">
              <Info className="w-4 h-4 text-blue-400 cursor-help transition-colors group-hover/tooltip:text-blue-500" />
              <div className="hidden group-hover/tooltip:block absolute z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg -top-2 left-6 shadow-xl">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-3 text-gray-500 group-hover:text-gray-700 transition-colors">
              {prefix}
            </span>
          )}
          {Icon && (
            <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          )}
          <input
            type="text"
            value={formatIndianNumber(inputValue)}
            onChange={handleChange}
            className={`w-full p-3 ${
              prefix ? "pl-8" : Icon ? "pl-10" : "pl-3"
            } border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-blue-50/30 transition-all duration-200 ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            } outline-none shadow-sm hover:shadow-md`}
            placeholder={`Enter ${label.toLowerCase()}`}
            disabled={disabled}
          />
        </div>
      </div>
    );
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

  const handleNumberInput = (e, setter, field) => {
    const rawValue = e.target.value;
    setter((prev) => ({
      ...prev,
      [field]: rawValue,
    }));
  };

  const steps = [
    "Basic Details",
    "Income Details",
    "Deductions",
    "Tax Summary",
  ];

  const renderBasicDetails = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Basic Details</h2>
      </div>
      <div className="space-y-8">
        <InputField
          label="Age"
          value={basicDetails.age}
          onChange={(e) => handleNumberInput(e, setBasicDetails, "age")}
          tooltip="Your age as of the assessment year"
          type="text"
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
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-blue-50/30 transition-all duration-200">
            <option value="2025-26">2025-26</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderIncomeDetails = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 rounded-lg">
          <IndianRupee className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Income Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 rounded-lg">
          <PieChart className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Deductions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        value: calculateTotalIncome(),
        color: "#60A5FA",
      },
      {
        name: "Taxable Income",
        value: comparison.newRegime.taxableIncome,
        color: "#34D399",
      },
      {
        name: "Deductions",
        value: calculateTotalDeductions(),
        color: "#F59E0B",
      },
      {
        name: "Tax Payable",
        value: comparison.newRegime.totalTax,
        color: "#EF4444",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Summary - FY 2025-2026 (AY 2026-2027)
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-blue-500 cursor-pointer hover:text-blue-600 font-medium transition-colors">
              Recalculate
            </button>
          </div>

          <div className="flex gap-8 flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="h-72 p-4 bg-gray-50 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 40, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      fontSize={12}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      fontSize={12}
                      width={100}
                    />
                    <RechartsTooltip
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        padding: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">
                  Total Income
                </h3>
                <div className="text-3xl font-bold text-blue-700">
                  {formatCurrency(calculateTotalIncome())}
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 text-green-900">
                  Taxable Income
                </h3>
                <div className="text-3xl font-bold text-green-700">
                  {formatCurrency(comparison.newRegime.taxableIncome)}
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 text-red-900">
                  Tax Payable
                </h3>
                <div className="text-3xl font-bold text-red-700">
                  {formatCurrency(comparison.newRegime.totalTax)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">
                Exemption and Deduction
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Exempt Allowances</span>
                  <span className="font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Standard Deductions</span>
                  <span className="font-medium">{formatCurrency(75000)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Chapter VI A Deductions</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotalDeductions())}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">
                Tax Calculation
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Income Tax</span>
                  <span className="font-medium">
                    {formatCurrency(comparison.newRegime.basicTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Surcharge</span>
                  <span className="font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">
                    Health and Education Cess
                  </span>
                  <span className="font-medium">
                    {formatCurrency(comparison.newRegime.cess)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <PieChart className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-green-800 font-medium">
                New Tax Regime is recommended for you. It would save you{" "}
                {formatCurrency(
                  comparison.oldRegime.totalTax - comparison.newRegime.totalTax
                )}{" "}
                in taxes.
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600 pl-10">
              ITR filing due date: July 31, 2026 (subject to change)
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StepIndicator = () => (
    <div className="mb-12">
      <div className="flex justify-between mb-4">
        {steps.map((stepName, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                index + 1 === step
                  ? "bg-blue-500 text-white shadow-lg scale-110"
                  : index + 1 < step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}>
              {index + 1}
            </div>
            <span className="sm:text-sm mt-3 text-[8px] font-medium text-gray-600">
              {stepName}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-6 left-full w-full h-0.5 -mx-2 transition-colors duration-300 ${
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
    <div className="max-w-6xl min-h-screen pt-24 mx-auto p-6 ">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4">
          Income Tax Calculator 2025-26
        </h1>
        <p className="text-gray-600 text-lg">
          Compare your tax liability under both old and new tax regimes
        </p>
      </div>

      <StepIndicator />
      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-8 cursor-pointer py-4 flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
          <ArrowLeft className="w-5 h-5" /> Previous
        </button>
        <button
          onClick={() => setStep((prev) => Math.min(4, prev + 1))}
          disabled={step === 4}
          className="px-8 py-4 cursor-pointer flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg">
          {step === 3 ? "Calculate" : "Next"} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;
