import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/button';

const included = [
  'Missed call SMS triage — automatic, every call',
  'WhatsApp job alerts — urgency, postcode, job details',
  'Weekly revenue report — see what you\'ve been missing',
  'Unlimited missed calls — no caps, no per-call fees',
  'No app required — everything lands in WhatsApp'
];

const PricingSection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">

      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-h2 md:text-h1-lg font-bold text-text">
            One plan.
            <br />
            One price.
            <br />
            No surprises.
          </h2>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass-card rounded-2xl border border-border bg-surface/60 backdrop-blur-xl overflow-hidden"
        >
          {/* Price header */}
          <div className="px-6 pt-8 pb-6 md:px-8 md:pt-10 text-center border-b border-border">
            <div className="flex items-end justify-center gap-2 mb-2">
              <span style={{textShadow: "#3e84f570 0px 0px 9px"}} className="text-[80px] md:text-[96px] font-bold text-primary leading-none tracking-tight">
                £59
              </span>
              <span className="text-xl text-muted mb-5">/month</span>
            </div>
            <p className="text-lg text-text/90 font-medium">Everything included.</p>
          </div>

          {/* What's included */}
          <div className="px-6 py-6 md:px-8">
            <ul className="space-y-3.5">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-md text-text/85 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-base text-muted text-center">
              No contract. No setup fee. Cancel anytime.
            </p>

            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-md text-text/80 text-center leading-relaxed">
                One recovered job covers the cost for at least 3 months.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={() => navigate('/onboard')}
                className="cg-label w-full bg-primary hover:bg-primary/90 text-white py-6 text-base rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
              >
                Start my 30 day free trial
              </Button>
              <p className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/demo')}
                  className="cg-label inline-flex items-center gap-1 text-md text-muted hover:text-text transition-colors"
                >
                  Try the demo first
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
