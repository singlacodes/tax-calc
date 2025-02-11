import React from "react";
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Building2,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-blue-900">
              Smart Tax Planning
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600">
              Navigate your taxes effortlessly with our intelligent calculator.
              Compare regimes, optimize savings, and make informed decisions.
            </p>
            <div className="flex gap-4">
              <a
                href="/calculator"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Start Calculator <ArrowRight className="w-5 h-5" />
              </a>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: Calculator,
                    title: "Smart Calculations",
                    color: "text-blue-500",
                  },
                  {
                    icon: TrendingUp,
                    title: "Regime Comparison",
                    color: "text-green-500",
                  },
                  {
                    icon: Wallet,
                    title: "Maximum Savings",
                    color: "text-purple-500",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Accurate Results",
                    color: "text-red-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50">
                    <item.icon className={`w-8 h-8 ${item.color} mb-2`} />
                    <span className="font-medium text-gray-800">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Why Choose Our Tax Calculator?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Building2,
              title: "Both Regimes Supported",
              description:
                "Compare old and new tax regimes to find the best option for you",
            },
            {
              icon: Calculator,
              title: "Comprehensive Calculations",
              description:
                "Account for all deductions, exemptions, and special provisions",
            },
            {
              icon: ShieldCheck,
              title: "Up-to-Date Rules",
              description:
                "Always current with the latest tax regulations and guidelines",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
