import React from 'react';
import { X, Check } from 'lucide-react';
import { websiteComparison } from '../data/mock';

const BeforeAfter = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            The Difference
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Standard vs Call-Optimised Website
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            See how strategic design choices transform a basic website into a lead-generating machine.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Typical Website */}
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <X className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Typical Website</h3>
                <p className="text-sm text-slate-500">Standard approach</p>
              </div>
            </div>

            <ul className="space-y-4">
              {websiteComparison.typical.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Optimised Website */}
          <div className="bg-blue-600 rounded-2xl p-8 relative overflow-hidden">
            {/* Best Choice Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Call-Optimised</h3>
                <p className="text-sm text-blue-100">This website</p>
              </div>
            </div>

            <ul className="space-y-4">
              {websiteComparison.optimised.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-blue-50">{item}</span>
                </li>
              ))}
            </ul>

            {/* Decorative */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
