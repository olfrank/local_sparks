import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, PlugZap, Clock3, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const trialIncludes = [
  { icon: PlugZap, label: 'Installed on your existing number', subtext: "Customers never know it's there" },
  { icon: Clock3, label: 'Live in ~10 minutes (we guide it)', subtext: 'No downtime. No tech headache.' },
  { icon: ShieldCheck, label: 'WhatsApp alerts for priority jobs', subtext: 'So you call back the right ones first' },
  { icon: CheckCircle2, label: 'Decision at day 30', subtext: 'Keep it — or switch it off' }
];

const timelineSteps = [
  { icon: PlugZap, label: 'Install (10 min)', subtext: 'We wire it into your number', accent: 'blue' },
  { icon: Clock3, label: 'Observe (30 days)', subtext: 'Missed calls become visible jobs', accent: 'emerald' },
  { icon: CheckCircle2, label: 'Decide', subtext: 'Keep the revenue — or walk away', accent: 'blue' }
];

const liveAuditPhases = ['Install', 'Running', 'Reporting'];

const statHintPhrases = ['Missed call → captured', 'Urgency → tagged', 'Revenue → visible'];

const BORDER_GLOW_INTERVAL_MS = 13500;
const STAT_HINT_INTERVAL_MS = 3000;

const CallGuardTrialSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.15 });
  const [borderGlowOpacity, setBorderGlowOpacity] = useState(0);
  const [livePhaseIndex, setLivePhaseIndex] = useState(0);
  const [statHintIndex, setStatHintIndex] = useState(0);
  const [buttonPulseDone, setButtonPulseDone] = useState(false);
  const livePhaseIntervalRef = useRef(null);
  const statHintIntervalRef = useRef(null);

  // Border glow: gentle pulse every ~12–15s (opacity + blur, smooth)
  const borderGlowTimeoutRef = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const pulse = () => {
      setBorderGlowOpacity(0.25);
      borderGlowTimeoutRef.current = setTimeout(() => setBorderGlowOpacity(0), 2200);
    };
    const id = setInterval(pulse, BORDER_GLOW_INTERVAL_MS);
    return () => {
      clearInterval(id);
      if (borderGlowTimeoutRef.current) clearTimeout(borderGlowTimeoutRef.current);
    };
  }, [inView, prefersReducedMotion]);

  // Live audit pill: cycle "Install" → "Running" → "Reporting" every ~2.5s while inView
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!inView) {
      if (livePhaseIntervalRef.current) clearInterval(livePhaseIntervalRef.current);
      return;
    }
    livePhaseIntervalRef.current = setInterval(() => {
      setLivePhaseIndex((prev) => (prev + 1) % liveAuditPhases.length);
    }, 2500);
    return () => { if (livePhaseIntervalRef.current) clearInterval(livePhaseIntervalRef.current); };
  }, [inView, prefersReducedMotion]);

  // Stat hint pill: cycle phrases every ~3s while inView
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!inView) {
      if (statHintIntervalRef.current) clearInterval(statHintIntervalRef.current);
      return;
    }
    statHintIntervalRef.current = setInterval(() => {
      setStatHintIndex((prev) => (prev + 1) % statHintPhrases.length);
    }, STAT_HINT_INTERVAL_MS);
    return () => { if (statHintIntervalRef.current) clearInterval(statHintIntervalRef.current); };
  }, [inView, prefersReducedMotion]);

  // Single button pulse when CTA enters view
  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    setButtonPulseDone(true);
  }, [inView, prefersReducedMotion]);

  const scrollToBooking = () => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFaq = () => {
    const el = document.getElementById('faq');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const isReportingPhase = liveAuditPhases[livePhaseIndex] === 'Reporting';
  const isRevenuePhrase = statHintPhrases[statHintIndex] === 'Revenue → visible';

  return (
    <section className="section-padding bg-ink pt-12 md:pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Soft depth: two radial glows behind the card */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
          <div className="absolute -top-32 right-0 w-[28rem] h-80 bg-primary/15 blur-[80px] rounded-full" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-emerald-500/12 blur-[80px] rounded-full" />
        </div>

        <motion.div
          ref={containerRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative glass-card rounded-2xl p-5 md:p-6 lg:p-8 border border-border/60 bg-surface/60 backdrop-blur-xl overflow-hidden"
        >
          {/* Gentle border glow pulse (opacity-based, every ~12–15s) */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                boxShadow: '0 0 32px 2px rgba(59,130,246,0.35)',
                filter: 'blur(1px)'
              }}
              animate={{ opacity: borderGlowOpacity }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          )}

          {/* Accent glow blob (top-right) */}
          <div className="pointer-events-none absolute -top-24 right-0 w-72 h-72 bg-primary/20 blur-3xl opacity-70" />

          {/* Gradient sweep — once when in view, very subtle */}
          {!prefersReducedMotion && inView && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                backgroundImage:
                  'linear-gradient(120deg, transparent, rgba(59,130,246,0.25), transparent)',
                backgroundSize: '200% 200%'
              }}
            />
          )}

          <div className="relative">
            {/* Header row: badge + live audit pill + stat hint pill */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
                animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 overflow-hidden relative"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock3 className="w-4 h-4 text-primary" />
                </div>
                <span className="cg-label text-xs tracking-[0.16em] uppercase text-primary">
                  30-DAY REVENUE AUDIT
                </span>
                {!prefersReducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={inView ? { x: '100%' } : { x: '-100%' }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                  />
                )}
              </motion.div>
              {/* Live audit cycling pill — emerald when "Reporting" */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={cn(
                  'inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium min-w-[7rem] justify-center',
                  isReportingPhase
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-surface2/80 border-border/60 text-muted'
                )}
              >
                {prefersReducedMotion ? (
                  '30-day audit'
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={liveAuditPhases[livePhaseIndex]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                    >
                      {liveAuditPhases[livePhaseIndex]}
                    </motion.span>
                  </AnimatePresence>
                )}
              </motion.div>
              {/* Stat hint pill: cycles phrases, emerald when "Revenue → visible" */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.4, delay: 0.25 }}
                className={cn(
                  'inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium min-w-[10rem] justify-center',
                  isRevenuePhrase && !prefersReducedMotion
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400/90'
                    : 'bg-surface2/60 border-border/50 text-muted'
                )}
              >
                {prefersReducedMotion ? (
                  statHintPhrases[0]
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statHintPhrases[statHintIndex]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="inline-block"
                    >
                      {statHintPhrases[statHintIndex]}
                    </motion.span>
                  </AnimatePresence>
                )}
              </motion.div>
            </div>

            <h2 className="cg-h2 text-h2 md:text-h2-lg text-text mb-2">
              See what your missed calls are really worth (free for 30 days)
            </h2>
            <p className="cg-body text-lg md:text-xl text-muted max-w-2xl">
              We install CallGuard on your number and let it run quietly. You&apos;ll see which missed calls turn into real jobs — and how much revenue they represent — then decide if it earns its place.
            </p>
            <p className="cg-body text-sm text-muted/90 mt-2 mb-5">
              No behaviour change. No app. Just visibility.
            </p>

            {/* Trial includes — 4 pills with subtext */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {trialIncludes.map(({ icon: Icon, label, subtext }, index) => (
                <motion.div
                  key={label}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.4,
                    ease: 'easeOut',
                    delay: prefersReducedMotion ? 0 : 0.08 * index
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -3,
                          boxShadow: '0 12px 28px rgba(59,130,246,0.12)',
                          borderColor: 'rgba(59,130,246,0.35)',
                          transition: { duration: 0.25, ease: 'easeOut' }
                        }
                  }
                  style={{ borderColor: 'hsl(215 20% 65% / 0.6)' }}
                  className="flex flex-col items-start sm:items-center gap-1.5 rounded-xl border bg-surface2/60 px-3 py-3 transition-all duration-200 cursor-default"
                >
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                    animate={inView && !prefersReducedMotion ? { opacity: 1, scale: 1 } : undefined}
                    transition={{
                      duration: 0.35,
                      ease: 'easeOut',
                      delay: prefersReducedMotion ? 0 : 0.08 * index + 0.05
                    }}
                    whileHover={prefersReducedMotion ? undefined : { rotate: 2, scale: 1.05 }}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </motion.div>
                  <p className="text-xs sm:text-[13px] font-medium text-text leading-snug text-center sm:text-left">
                    {label}
                  </p>
                  {subtext && (
                    <p className="text-[11px] sm:text-xs text-muted/90 leading-snug text-center sm:text-left">
                      {subtext}
                    </p>
                  )}
                </motion.div>
              ))}
            </div> */}

            {/* 3-step trial timeline with micro-outcomes */}
            <div className="mb-6">
              <p className="cg-label text-xs uppercase tracking-wider text-muted mb-3">
                Trial timeline
              </p>
              <div className="relative">
                {/* Progress track + animated fill (desktop) */}
                <div className="hidden md:block relative h-0.5 w-full rounded-full bg-primary/15 mb-5 overflow-hidden">
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary/40"
                      initial={{ width: '0%' }}
                      animate={inView ? { width: '100%' } : { width: '0%' }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      style={{ originX: 0 }}
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-4">
                  {timelineSteps.map(({ icon: Icon, label, subtext, accent }, index) => (
                    <motion.div
                      key={label}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                      transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                        delay: prefersReducedMotion ? 0 : 0.2 + index * 0.15
                      }}
                      style={accent !== 'emerald' ? { borderColor: 'hsl(215 20% 65% / 0.6)' } : undefined}
                      className={cn(
                        'flex items-center gap-3 md:flex-col md:items-center md:gap-1.5 flex-1 md:max-w-[33%] rounded-xl border px-4 py-3 md:py-4',
                        accent === 'emerald'
                          ? 'border-emerald-500/25 bg-emerald-500/10'
                          : 'bg-surface2/40'
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border',
                          accent === 'emerald'
                            ? 'bg-emerald-500/15 border-emerald-500/30'
                            : 'bg-primary/15 border-primary/30'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            accent === 'emerald' ? 'text-emerald-400' : 'text-primary'
                          )}
                        />
                      </div>
                      <div className="md:text-center">
                        <span className="cg-label text-sm text-text block">{label}</span>
                        {subtext && (
                          <span className="cg-body text-xs text-muted/90 mt-0.5 block">{subtext}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="relative"
              >
                {!prefersReducedMotion && buttonPulseDone && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10"
                    initial={{ opacity: 0.8, scale: 0.95 }}
                    animate={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    aria-hidden
                  />
                )}
                <button
                  type="button"
                  onClick={scrollToBooking}
                  className="cg-label w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-base shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  Start my 30-day audit
                </button>
              </motion.div>
              <button
                type="button"
                onClick={scrollToFaq}
                className="cg-label text-sm text-muted hover:text-text transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded"
              >
                What happens during the audit?
              </button>
            </div>
            <p className="cg-body text-xs text-muted mt-3 max-w-xl">
              I&apos;ll personally set this up with you — no tickets, no handoffs.
            </p>
            <p className="cg-body text-xs text-muted/80 mt-4 max-w-xl">
              No commitment until you&apos;ve seen it working. At day 30 you choose.
            </p>
            <p className="cg-body text-[11px] text-muted/70 mt-3">
              Currently running with independent UK electricians.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallGuardTrialSection;
