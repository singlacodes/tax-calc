import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Calculator, IndianRupee, PieChart } from 'lucide-react';

const TaxCalculator = () => {
  const [step, setStep] = useState(1);
  const [basicDetails, setBasicDetails] = useState({
    age: '',
    financialYear: '2025-26'
  });

  const [incomeDetails, setIncomeDetails] = useState({
    salary: 0,
    hra: 0,
    lta: 0,
    professionalTax: 0,
    interestIncome: 0,
    rentalIncome: 0,
    homeLoanInterest: 0
  });

  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    section80G: 0,
    otherDeductions: 0
  });

  const calculateTaxableIncome = useCallback(() => {
    // Include all components of income
    const totalIncome = 
      incomeDetails.salary + 
      incomeDetails.hra +
      incomeDetails.lta +
      incomeDetails.interestIncome + 
      incomeDetails.rentalIncome;

    // Subtract professional tax and standard deduction
    const standardDeduction = 75000;
    const deductions = incomeDetails.professionalTax + standardDeduction;
    
    return Math.max(0, totalIncome - deductions);
  }, [incomeDetails]);

  const calculateSlabwiseTax = useCallback((income) => {
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.10 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.20 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 }
    ];

    let remainingIncome = income;
    let tax = 0;
    let previousLimit = 0;

    const breakdown = [];

    for (const slab of slabs) {
      const slabIncome = Math.min(Math.max(0, remainingIncome), slab.limit - previousLimit);
      const slabTax = slabIncome * slab.rate;
      
      if (slabIncome > 0) {
        breakdown.push({
          range: `${formatCurrency(previousLimit)} to ${slab.limit === Infinity ? 'Above' : formatCurrency(slab.limit)}`,
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

    return { tax, breakdown };
  }, []);

  const calculateNewRegimeTax = useCallback((taxableIncome) => {
    // Calculate basic tax
    const { tax, breakdown } = calculateSlabwiseTax(taxableIncome);
    
    // Apply rebate under section 87A
    // Full rebate if income is below 12.75 lakhs
    let taxAfterRebate = taxableIncome <= 1275000 ? 0 : tax;
    
    // Calculate cess only if tax is payable
    const cess = taxAfterRebate * 0.04;
    
    // Final tax including cess
    const totalTax = taxAfterRebate + cess;
    
    return {
      basicTax: tax,
      rebate: tax - taxAfterRebate,
      cess,
      totalTax,
      breakdown
    };
  }, [calculateSlabwiseTax]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const steps = ['Basic Details', 'Income Details', 'Deductions', 'Tax Summary'];

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((stepName, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              index + 1 === step ? 'bg-blue-500 text-white' : 
              index + 1 < step ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              {index + 1}
            </div>
            <span className="text-sm mt-2 text-gray-600">{stepName}</span>
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-full w-full h-0.5 -mx-2 ${
                index + 1 < step ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Basic Details</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={basicDetails.age}
                  onChange={(e) => setBasicDetails({...basicDetails, age: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your age"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Financial Year</label>
                <select
                  value={basicDetails.financialYear}
                  onChange={(e) => setBasicDetails({...basicDetails, financialYear: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(incomeDetails).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setIncomeDetails({...incomeDetails, [key]: Number(e.target.value)})}
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Enter amount`}
                    />
                  </div>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deductions).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setDeductions({...deductions, [key]: Number(e.target.value)})}
                      className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Enter amount`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 4:
        const taxableIncome = calculateTaxableIncome();
        const taxCalculation = calculateNewRegimeTax(taxableIncome);
        
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Tax Summary</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Gross Total Income</span>
                    <span className="text-lg font-medium">
                      {formatCurrency(incomeDetails.salary + incomeDetails.hra + incomeDetails.lta + 
                        incomeDetails.interestIncome + incomeDetails.rentalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Standard Deduction</span>
                    <span className="text-lg font-medium">{formatCurrency(75000)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Professional Tax</span>
                    <span className="text-lg font-medium">{formatCurrency(incomeDetails.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Net Taxable Income</span>
                    <span className="text-lg font-medium">{formatCurrency(taxableIncome)}</span>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Basic Tax</span>
                      <span>{formatCurrency(taxCalculation.basicTax)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Less: 87A Rebate</span>
                      <span className="text-red-600">-{formatCurrency(taxCalculation.rebate)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Health & Education Cess (4%)</span>
                      <span>{formatCurrency(taxCalculation.cess)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg mt-4">
                    <span className="text-blue-800 font-medium">Final Tax Payable</span>
                    <span className="text-2xl font-bold text-blue-800">
                      {formatCurrency(taxCalculation.totalTax)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-gray-800">Tax Calculation Breakdown</h3>
                <div className="space-y-3">
                  {taxCalculation.breakdown.map((slab, index) => (
                    <div key={index} className="grid grid-cols-4 text-sm gap-4">
                      <span className="text-gray-600">{slab.range}</span>
                      <span>{formatCurrency(slab.income)}</span>
                      <span>{slab.rate}%</span>
                      <span className="text-right">{formatCurrency(slab.tax)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">* Including 4% Health & Education Cess</p>
                  <p className="text-sm text-gray-600">* Standard Deduction of ₹75,000 applied</p>
                  <p className="text-sm text-gray-600">* Full tax rebate under Section 87A if income is up to ₹12,75,000</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Income Tax Calculator 2025-26</h1><p className="text-gray-600">Calculate your income tax under the new tax regime with enhanced benefits</p>
      </div>
      
      <StepIndicator />
      {renderStep()}
      
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-6 py-3 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => setStep(prev => Math.min(4, prev + 1))}
          disabled={step === 4}
          className="px-6 py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {step === 3 ? 'Calculate' : 'Next'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaxCalculator;