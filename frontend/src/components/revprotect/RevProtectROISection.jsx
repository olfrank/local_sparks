import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingDown, Shield } from 'lucide-react';

const CallGuardROISection = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });

  const [lossMin, setLossMin] = useState(0);
  const [lossMax, setLossMax] = useState(0);
  const [callguardPrice, setCallguardPrice] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion) {
      setLossMin(250);
      setLossMax(500);
      setCallguardPrice(390);
      return;
    }

    // Animate loss range: £250 → £500
    let frame1;
    const duration1 = 1000;
    const start1 = performance.now();

    const tick1 = (now) => {
      const elapsed = now - start1;
      const progress = Math.min(elapsed / duration1, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setLossMin(Math.round(250 * eased));
      setLossMax(Math.round(500 * eased));
      if (progress < 1) {
        frame1 = requestAnimationFrame(tick1);
      }
    };

    frame1 = requestAnimationFrame(tick1);

    // Animate CallGuard price last (after loss range completes)
    const timeout = setTimeout(() => {
      let frame2;
      const duration2 = 800;
      const start2 = performance.now();

      const tick2 = (now) => {
        const elapsed = now - start2;
        const progress = Math.min(elapsed / duration2, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCallguardPrice(Math.round(390 * eased));
        if (progress < 1) {
          frame2 = requestAnimationFrame(tick2);
        }
      };

      frame2 = requestAnimationFrame(tick2);
    }, 1200);

    return () => {
      if (frame1) cancelAnimationFrame(frame1);
      clearTimeout(timeout);
    };
  }, [inView, prefersReducedMotion]);

  return (
    <section className="section-padding bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={containerRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-card rounded-2xl p-8 md:p-10 border border-primary/30 bg-surface/60 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Soft glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/25 blur-3xl opacity-70" />

          <div className="relative">
            <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-8 text-center">
              Leak-based ROI
            </h2>

            {/* Two-column comparison */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Left: Loss */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                animate={inView && !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl border border-red-500/20 bg-red-500/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-semibold text-red-400 uppercase tracking-wide">
                    Loss
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-3xl md:text-4xl font-semibold text-text">
                    £{lossMin}–£{lossMax}
                  </p>
                  <p className="text-sm text-muted mt-1">per missed emergency call</p>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Typical emergency call-out value. Most customers don&apos;t leave voicemail.
                </p>
              </motion.div>

              {/* Right: Protection */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                animate={inView && !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-xl border border-primary/30 bg-primary/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Protection
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-3xl md:text-4xl font-semibold text-text">
                    £{callguardPrice}
                  </p>
                  <p className="text-sm text-muted mt-1">per month</p>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Break-even: one recovered call-out. Everything after is found money.
                </p>
              </motion.div>
            </div>

            {/* Break-even emphasis */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
              className="mt-8 pt-6 border-t border-white/0 text-center"
            >
              <p className="text-base md:text-lg text-muted mb-2">
                One job recovered = break-even.
              </p>
              <p className="text-sm text-muted/80">
                Cancel anytime. Live in ~10 minutes.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallGuardROISection;

