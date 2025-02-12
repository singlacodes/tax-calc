import React from "react";
import { Calculator } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand and Copyright */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg text-blue-900">
              TaxCalc<span className="text-blue-600">.</span>
            </span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <span className="text-gray-600 text-sm">
              © 2025 All rights reserved
            </span>
          </div>
        </div>

        {/* Quick Links and Social */}
        <div className="flex items-center gap-8">
          <div className="flex gap-6">
            <a
              href="/calculator"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              Calculator
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
