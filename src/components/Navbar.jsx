import React from "react";
import { Calculator } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-blue-900">
              Tax Calculator
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
            <a href="/calculator" className="text-gray-600 hover:text-blue-600">
              Calculator
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
