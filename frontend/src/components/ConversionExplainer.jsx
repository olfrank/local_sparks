import React from 'react';
import { TrendingUp, Eye, MousePointer, ArrowDownCircle, Smartphone, ShieldCheck } from 'lucide-react';
import { conversionFeatures } from '../data/mock';

const ConversionExplainer = () => {
  const featureIcons = [
    TrendingUp,
    Eye,
    MousePointer,
    ArrowDownCircle,
    ShieldCheck,
    Smartphone
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">
              For Business Owners
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              How This Website Is Designed to Increase Calls
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              This isn't just a pretty website. Every element has been strategically placed to convert more visitors into phone calls and enquiries.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {conversionFeatures.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-slate-200">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600">
              <h3 className="text-xl font-bold text-white mb-6">Typical Results</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-600">
                  <span className="text-slate-300">Missed calls recovered</span>
                  <span className="text-3xl font-bold text-green-400">Example</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-600">
                  <span className="text-slate-300">Response time</span>
                  <span className="text-3xl font-bold text-green-400">Instant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Weekly visibility</span>
                  <span className="text-3xl font-bold text-blue-400">Yes</span>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-400">
                *Illustrative example. Actual results vary by business.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionExplainer;
