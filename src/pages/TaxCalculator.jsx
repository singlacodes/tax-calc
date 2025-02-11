import React, { useState, useCallback } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import StepIndicator from "./StepIndicator";
import TaxForm from "./TaxForm";
import TaxSummary from "./TaxSummary";
import {
  calculateTaxableIncome,
  calculateSlabwiseTax,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
} from "../utils/taxCalculations";

const TaxCalculator = () => {
  const [selectedRegime, setSelectedRegime] = useState("new");
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
  });

  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    section80G: 0,
    section80EEA: 0,
    otherDeductions: 0,
  });

  // Calculate total deductions for old regime with caps
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

  // Calculate tax comparison between regimes
  const calculateTaxComparison = useCallback(() => {
    const newRegimeIncome = calculateTaxableIncome(incomeDetails, "new");
    const oldRegimeIncome = calculateTaxableIncome(
      incomeDetails,
      "old",
      calculateTotalDeductions()
    );

    const newRegimeTax = calculateSlabwiseTax(
      newRegimeIncome,
      NEW_REGIME_SLABS
    );
    const oldRegimeTax = calculateSlabwiseTax(
      oldRegimeIncome,
      OLD_REGIME_SLABS
    );

    const savings = Math.abs(newRegimeTax.totalTax - oldRegimeTax.totalTax);

    return {
      newRegime: {
        taxableIncome: newRegimeIncome,
        ...newRegimeTax,
      },
      oldRegime: {
        taxableIncome: oldRegimeIncome,
        ...oldRegimeTax,
      },
      savings,
      recommendedRegime:
        newRegimeTax.totalTax < oldRegimeTax.totalTax ? "new" : "old",
    };
  }, [incomeDetails, calculateTotalDeductions]);

  const handleIncomeChange = (field, value) => {
    setIncomeDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeductionChange = (field, value) => {
    setDeductions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
            <h2 className="text-xl font-semibold mb-6">Basic Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  value={basicDetails.age}
                  onChange={(e) =>
                    setBasicDetails((prev) => ({
                      ...prev,
                      age: e.target.value,
                    }))
                  }
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Financial Year
                </label>
                <select
                  value={basicDetails.financialYear}
                  onChange={(e) =>
                    setBasicDetails((prev) => ({
                      ...prev,
                      financialYear: e.target.value,
                    }))
                  }
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg">
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
      case 3:
        return (
          <TaxForm
            incomeDetails={incomeDetails}
            deductions={deductions}
            selectedRegime={selectedRegime}
            onIncomeChange={handleIncomeChange}
            onDeductionChange={handleDeductionChange}
            step={step}
          />
        );

      case 4:
        const comparison = calculateTaxComparison();
        const selectedRegimeTax =
          selectedRegime === "new"
            ? comparison.newRegime
            : comparison.oldRegime;
        const totalIncome = Object.values(incomeDetails).reduce(
          (sum, val) => sum + val,
          0
        );

        return (
          <TaxSummary
            selectedRegime={selectedRegime}
            totalIncome={totalIncome}
            taxableIncome={selectedRegimeTax.taxableIncome}
            deductions={
              selectedRegime === "new" ? 75000 : calculateTotalDeductions()
            }
            taxPayable={selectedRegimeTax.totalTax}
            standardDeduction={selectedRegime === "new" ? 75000 : 50000}
            chapterVIADeductions={
              selectedRegime === "old" ? calculateTotalDeductions() : 0
            }
            incomeTax={selectedRegimeTax.basicTax}
            healthAndEducationCess={selectedRegimeTax.cess}
            taxSavings={comparison.savings}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Income Tax Calculator 2025-26
        </h1>
        <p className="text-gray-600">
          Compare and calculate your income tax under both old and new tax
          regimes
        </p>
      </div>

      <StepIndicator steps={steps} currentStep={step} />
      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-6 py-3 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => setStep((prev) => Math.min(4, prev + 1))}
          disabled={step === 4}
          className="px-6 py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {step === 3 ? "Calculate" : "Next"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;
