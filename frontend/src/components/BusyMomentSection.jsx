import React from 'react';
import { Phone, CheckCircle2, Calendar, PhoneOff, X, Clock } from 'lucide-react';

const BusyMomentSection = () => {
  return (
    <section className="section-padding bg-ink">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-h1 font-bold text-text mb-6 leading-tight">
            The silent leak in every trade business
          </h2>
          <p className="text-xl md:text-2xl text-muted mb-4 max-w-3xl mx-auto leading-relaxed">
            Most customers won&apos;t leave a voicemail. If you don&apos;t answer, they ring the next electrician on Google — and you never even know which calls were real jobs.
          </p>
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-amber-400/40 bg-amber-500/5 text-sm md:text-base text-amber-100 font-medium">
            Miss just two emergency call-outs a month and you can leak £500–£1,000 in silent profit.
          </div>
        </div>

        {/* Split Graphic Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 card-hover relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative">
              {/* Quiet Period Column */}
              <div className="group space-y-6">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-primary/20 rounded-full">
                    <span className="text-primary text-xs font-semibold uppercase tracking-wide">Quiet Period</span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text">
                  When you&apos;re free, any site works
                </h3>
                <div className="space-y-4">
                  {/* Row 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-text font-medium leading-relaxed">
                        <span className="text-muted mr-2">Phone rings</span>
                        <span className="text-success">—</span>
                        <span className="ml-2">You answer</span>
                      </span>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-text font-medium leading-relaxed">
                        <span className="text-muted mr-2">Customer reassured</span>
                        <span className="text-success">—</span>
                        <span className="ml-2">They stop calling around</span>
                      </span>
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-text font-medium leading-relaxed">
                        <span className="text-muted mr-2">Job booked</span>
                        <span className="text-success">—</span>
                        <span className="ml-2">Simple</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />

              {/* Busy Period Column */}
              <div className="group space-y-6 md:pl-8 border-t border-border pt-8 md:pt-0 md:border-t-0">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-red-500/20 rounded-full">
                    <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">Busy Period</span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text">
                  When you&apos;re busy, missed calls decide who gets paid
                </h3>
                <div className="space-y-4">
                  {/* Row 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PhoneOff className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-text font-medium leading-relaxed">
                        <span className="text-muted mr-2">Phone rings</span>
                        <span className="text-red-400">—</span>
                        <span className="ml-2">You can't answer</span>
                      </span>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-text font-medium leading-relaxed">
                        <span className="text-muted mr-2">Customer keeps calling</span>
                        <span className="text-red-400">—</span>
                        <span className="ml-2">Next electrician in 30 seconds</span>
                      </span>
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <X className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-text font-medium leading-relaxed">
                        <span className="text-muted mr-2">Job lost</span>
                        <span className="text-red-400">—</span>
                        <span className="ml-2">You never knew it existed</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-muted text-base md:text-lg font-medium">
          This is the moment CallGuard exists for.
        </p>
      </div>
    </section>
  );
};

export default BusyMomentSection;
