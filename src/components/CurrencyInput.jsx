import React from "react";
import { IndianRupee } from "lucide-react";

const CurrencyInput = ({
  label,
  value,
  onChange,
  disabled = false,
  className = "",
  info,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {info && <span className="ml-1 text-gray-400 text-xs">{info}</span>}
      </label>
      <div className="relative">
        <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          placeholder="0"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default CurrencyInput;
