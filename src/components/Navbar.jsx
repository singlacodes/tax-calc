import React, { useState, useEffect } from "react";
import { Calculator, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-blue-900">
                TaxCalc<span className="text-blue-600">.</span>
              </span>
            </div>
          </a>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </a>
            <a href="/calculator">
              <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Calculator
              </button>
            </a>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              <a
                href="/"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a
                href="/calculator"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Calculator
              </a>
              <a
                href="/updates"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Budget Updates
              </a>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
