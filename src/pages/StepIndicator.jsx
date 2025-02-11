import React from "react";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((stepName, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === currentStep
                  ? "bg-blue-500 text-white"
                  : index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}>
              {index + 1}
            </div>
            <span className="text-sm mt-2 text-gray-600">{stepName}</span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-full w-full h-0.5 -mx-2 ${
                  index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
