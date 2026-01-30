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
<<<<<<< HEAD
    <section className="section-padding bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Full Service Range
          </span>
          <h2 className="text-h2 md:text-h2-lg font-bold text-light-text mb-4">
            Electrical Services We Offer
          </h2>
          <p className="text-light-muted max-w-2xl mx-auto">
=======
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
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
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
<<<<<<< HEAD
                className="group bg-light-surface rounded-xl p-6 text-center border border-light-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-light-text text-sm md:text-base">{service.name}</h3>
=======
                className="group bg-white rounded-xl p-6 text-center border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm md:text-base">{service.name}</h3>
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
              </div>
            );
          })}
        </div>

        {/* Additional Note */}
<<<<<<< HEAD
        <p className="text-center text-light-muted mt-10 text-sm">
=======
        <p className="text-center text-slate-500 mt-10 text-sm">
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
          Need something not listed? We cover all domestic and commercial electrical work.
        </p>
      </div>
    </section>
  );
};

export default ServicesGrid;
