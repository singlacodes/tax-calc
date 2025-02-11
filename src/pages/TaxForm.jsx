import React from "react";
import { Info } from "lucide-react";
import CurrencyInput from "../components/CurrencyInput";

const TaxForm = ({
  incomeDetails,
  deductions,
  selectedRegime,
  onIncomeChange,
  onDeductionChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Income Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          Income Details
          <Info className="w-4 h-4 text-gray-400" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Salary Income"
            value={incomeDetails.salary}
            onChange={(value) => onIncomeChange("salary", value)}
          />
          <CurrencyInput
            label="HRA"
            value={incomeDetails.hra}
            onChange={(value) => onIncomeChange("hra", value)}
          />
          <CurrencyInput
            label="LTA"
            value={incomeDetails.lta}
            onChange={(value) => onIncomeChange("lta", value)}
          />
          <CurrencyInput
            label="Interest Income"
            value={incomeDetails.interestIncome}
            onChange={(value) => onIncomeChange("interestIncome", value)}
          />
          <CurrencyInput
            label="Rental Income"
            value={incomeDetails.rentalIncome}
            onChange={(value) => onIncomeChange("rentalIncome", value)}
          />
          <CurrencyInput
            label="Professional Tax"
            value={incomeDetails.professionalTax}
            onChange={(value) => onIncomeChange("professionalTax", value)}
          />
        </div>
      </div>

      {/* Deductions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          Deductions
          {selectedRegime === "new" && (
            <span className="text-sm font-normal text-gray-500">
              (Only applicable for old regime)
            </span>
          )}
          <Info className="w-4 h-4 text-gray-400" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            label="Section 80C"
            value={deductions.section80C}
            onChange={(value) => onDeductionChange("section80C", value)}
            disabled={selectedRegime === "new"}
            info="Max ₹1,50,000"
          />
          <CurrencyInput
            label="Section 80D"
            value={deductions.section80D}
            onChange={(value) => onDeductionChange("section80D", value)}
            disabled={selectedRegime === "new"}
            info="Max ₹1,00,000"
          />
          <CurrencyInput
            label="Section 80G"
            value={deductions.section80G}
            onChange={(value) => onDeductionChange("section80G", value)}
            disabled={selectedRegime === "new"}
          />
          <CurrencyInput
            label="Section 80EEA"
            value={deductions.section80EEA}
            onChange={(value) => onDeductionChange("section80EEA", value)}
            disabled={selectedRegime === "new"}
            info="Max ₹1,50,000"
          />
          <CurrencyInput
            label="Other Deductions"
            value={deductions.otherDeductions}
            onChange={(value) => onDeductionChange("otherDeductions", value)}
            disabled={selectedRegime === "new"}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxForm;
