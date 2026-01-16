import React from 'react';
import { Wrench, Search, Cable, LayoutGrid, Car, Lightbulb, Plug, ClipboardCheck } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  Wrench,
  Search,
  Cable,
  LayoutGrid,
  Car,
  Lightbulb,
  Plug,
  ClipboardCheck
};

const ServicesGrid = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Full Service Range
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Electrical Services We Offer
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From simple repairs to complete installations, we handle all your electrical needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 text-center border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm md:text-base">{service.name}</h3>
              </div>
            );
          })}
        </div>

        {/* Additional Note */}
        <p className="text-center text-slate-500 mt-10 text-sm">
          Need something not listed? We cover all domestic and commercial electrical work.
        </p>
      </div>
    </section>
  );
};

export default ServicesGrid;
