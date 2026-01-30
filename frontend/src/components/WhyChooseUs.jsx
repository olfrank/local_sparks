import React from 'react';
import { Clock, PoundSterling, ShieldCheck, UserCheck, Receipt, BadgeCheck } from 'lucide-react';
import { whyChooseUs } from '../data/mock';

const iconMap = {
  Clock,
  PoundSterling,
  ShieldCheck,
  UserCheck,
  Receipt,
  BadgeCheck
};

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="section-padding bg-light-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Why Choose Us
          </span>
          <h2 className="text-h2 md:text-h2-lg font-bold text-light-text mb-4">
            The Local Electricians You Can Trust
          </h2>
          <p className="text-light-muted max-w-2xl mx-auto">
            We're committed to providing exceptional service, fair pricing, and quality workmanship every time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {whyChooseUs.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={index}
                className="group flex gap-4 p-6 rounded-2xl bg-light hover:bg-primary/5 transition-all duration-300 hover:shadow-md border border-light-border"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-light-text mb-1">{feature.title}</h3>
                  <p className="text-light-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
