import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";

const TaxSummary = ({
  selectedRegime,
  totalIncome,
  taxableIncome,
  deductions,
  taxPayable,
  standardDeduction,
  chapterVIADeductions = 0,
  incomeTax,
  surcharge = 0,
  healthAndEducationCess,
}) => {
  const chartData = [
    {
      name: "Income",
      totalIncome: totalIncome,
      taxableIncome: taxableIncome,
      deduction: deductions,
      taxPayable: taxPayable,
    },
  ];

  return (
    <div className="bg-white p-8 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl text-gray-700">
            Summary - FY 2025-2026 (AY 2026-2027)
          </h2>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex gap-4">
          <button className="text-blue-500">Calculate for FY 2024-2025</button>
          <button className="text-blue-500">Recalculate</button>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            selectedRegime === "new" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}>
          New regime{" "}
          {selectedRegime === "new" && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Recommended
            </span>
          )}
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedRegime === "old" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}>
          Old regime
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={0}>
              <XAxis tick={false} />
              <YAxis />
              <Bar dataKey="totalIncome" fill="#E3F2FD" />
              <Bar dataKey="taxableIncome" fill="#2196F3" />
              <Bar dataKey="deduction" fill="#1565C0" />
              <Bar dataKey="taxPayable" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 text-sm mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100"></div>
              <span>Total income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500"></div>
              <span>Taxable income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-800"></div>
              <span>Deduction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500"></div>
              <span>Tax payable</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg mb-4">Total income</h3>
            <p className="text-2xl font-semibold">
              ₹{totalIncome.toLocaleString()}
            </p>

            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Exemption and deduction</h4>
              <p className="text-xl">₹{deductions.toLocaleString()}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Exempt Allowances</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Deductions</span>
                  <span>₹{standardDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chapter VI A Deductions</span>
                  <span>₹{chapterVIADeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg mb-4">Taxable income</h3>
            <p className="text-2xl font-semibold">
              ₹{taxableIncome.toLocaleString()}
            </p>

            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Tax payable</h4>
              <p className="text-xl">₹{taxPayable.toLocaleString()}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Income tax</span>
                  <span>₹{incomeTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surcharge</span>
                  <span>₹{surcharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health and education cess</span>
                  <span>₹{healthAndEducationCess.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <p className="text-green-700">
          <span className="font-medium">New Tax Regime</span> is recommended for
          you. It would save you ₹2,49,600 in taxes.
        </p>
        <p className="text-sm text-green-600 mt-2">
          ITR filing due date: July 31, 2026 (subject to change).
        </p>
      </div>

      <div className="mt-8">
        <p className="text-gray-700 mb-4">Do you want this result?</p>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Please enter your email id"
            className="flex-1 p-3 border border-gray-300 rounded-lg"
          />
          <button className="px-8 py-3 bg-blue-500 text-white rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;
