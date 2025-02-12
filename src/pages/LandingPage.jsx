import React from "react";
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Wallet,
  ShieldCheck,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <main className="w-full min-h-screen flex items-center px-4 pt-32 md:pt-16 pb-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Budget 2025 Updates Available
              </div>
              <h1 className="text-6xl font-bold text-blue-900 tracking-tight">
                Smart Tax Planning
                <span className="block text-blue-600 mt-2">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Navigate your taxes effortlessly with our intelligent
                calculator. Stay updated with Budget 2025 changes and make
                informed decisions about your tax planning.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/calculator")}
                  className="cursor-pointer flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
                  Start Calculator <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection("budget-updates")}
                  className="cursor-pointer group flex items-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all">
                  Explore Updates
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse delay-700"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/80">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: Calculator,
                      title: "Smart Calculations",
                      description: "Updated with 2025 rules",
                      color: "text-blue-500",
                      bgColor: "bg-blue-50",
                    },
                    {
                      icon: TrendingUp,
                      title: "Regime Comparison",
                      description: "Old vs New tax regime",
                      color: "text-green-500",
                      bgColor: "bg-green-50",
                    },
                    {
                      icon: Wallet,
                      title: "Maximum Savings",
                      description: "Optimize your taxes",
                      color: "text-purple-500",
                      bgColor: "bg-purple-50",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Accurate Results",
                      description: "Latest budget rules",
                      color: "text-red-500",
                      bgColor: "bg-red-50",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center text-center p-6 rounded-xl ${item.bgColor} transition-transform hover:scale-105`}>
                      <item.icon className={`w-10 h-10 ${item.color} mb-3`} />
                      <span className="font-medium text-gray-800 mb-1">
                        {item.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Budget Updates Section */}
      <section id="budget-updates" className="w-full py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">
              Budget 2025 Highlights
            </h2>
            <p className="text-xl text-gray-600">
              Key changes that impact your tax planning
            </p>
          </div>

          <div className="grid gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">
                New Tax Rebate
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No income tax for income up to ₹12 Lakhs under the new regime,
                thanks to an increased rebate of ₹60,000.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">
                Standard Deduction
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Enhanced standard deduction of ₹75,000 available under the new
                tax regime.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Modified Slab Rates
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Restructured tax slabs with reduced rates, providing more
                savings across different income ranges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
