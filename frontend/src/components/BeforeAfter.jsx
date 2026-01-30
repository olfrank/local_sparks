import React from 'react';
import { X, Check, PhoneOff, Eye, Clock, Filter } from 'lucide-react';

const BeforeAfter = () => {
  const comparisonRows = [
    {
      feature: 'Missed calls',
      brochure: 'Invisible',
      system: 'Recovered',
      icon: PhoneOff
    },
    {
      feature: 'Proof',
      brochure: 'Guesswork',
      system: 'Weekly summary',
      icon: Eye
    },
    {
      feature: 'Response',
      brochure: 'Manual',
      system: 'Instant acknowledgement',
      icon: Clock
    },
    {
      feature: 'Busy periods',
      brochure: 'Lose jobs',
      system: 'Filter & prioritise',
      icon: Filter
    }
  ];

  return (
    <section className="section-padding bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            The Difference
          </span>
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-4">
            Standard website vs Call-Capture System
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            See how a system designed for busy periods prevents lost opportunities.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto relative">
          {/* Header Row */}
          <div className="absolute top-24 md:-top-3 right-2 z-[50]">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                  RECOMMENDED
                </span>
              </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="hidden md:block"></div>
            <div className="glass-card rounded-xl p-4 border-2 border-border text-center">
              <h3 className="font-bold text-text">Brochure site</h3>
              <p className="text-sm text-muted">Standard approach</p>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 border-2 border-primary text-center relative overflow-hidden">
              
              <h3 className="font-bold text-white">Revenue-capture system</h3>
              <p className="text-sm text-white/80">This system</p>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisonRows.map((row, index) => {
              const Icon = row.icon;
              return (
                <div
                  key={index}
                  className="grid md:grid-cols-3 gap-4 glass-card rounded-xl p-5 card-hover"
                >
                  {/* Feature */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-text" />
                    </div>
                    <span className="font-semibold text-text">{row.feature}</span>
                  </div>

                  {/* Brochure Site */}
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                        <X className="w-3 h-3 text-red-400" />
                      </div>
                      <span className="text-muted">{row.brochure}</span>
                    </div>
                  </div>

                  {/* System */}
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-text font-medium">{row.system}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
