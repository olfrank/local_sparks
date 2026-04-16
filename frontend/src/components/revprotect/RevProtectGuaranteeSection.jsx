import React, { useEffect, useState, useRef } from 'react';
import { PlugZap, Clock3, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────────────────────

const KILLER_PHRASES = ['No behaviour change', 'No app', 'Just visibility'];

const TIMELINE = [
  { icon: PlugZap,       label: 'Install (2 min)',    sub: 'We wire it into your number' },
  { icon: Clock3,        label: 'Observe (30 days)',  sub: 'Missed calls become visible jobs' },
  { icon: CheckCircle2,  label: 'Decide',             sub: 'Keep it or cancel. No lock-in.' },
];

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target, duration, started, reduceMotion) {
  const [val, setVal] = useState(reduceMotion ? target : 0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!started) return;
    if (reduceMotion) { setVal(target); return; }
    setVal(0);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setVal(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [started, target, duration, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps
  return val;
}

// ─── Weekly report phone mockup ───────────────────────────────────────────────

function WeeklyReportPhone({ inView, reduceMotion }) {
  const enquiries = useCountUp(6,   1000, inView, reduceMotion);
  const valueLow  = useCountUp(300, 1300, inView, reduceMotion);
  const valueHigh = useCountUp(600, 1300, inView, reduceMotion);

  const timeStr = '08:07';

  return (
    <div
      className="relative mx-auto select-none"
      style={{
        width: 'min(260px, 78vw)',
        animation: reduceMotion ? 'none' : 'phoneFloat 3s ease-in-out infinite',
      }}
    >
      {/* Side buttons */}
      {[90, 128, 184].map((top) => (
        <div key={top} className="absolute" style={{ left: '-3px', top, width: 3, height: top === 184 ? 44 : top === 128 ? 44 : 26, background: 'rgba(255,255,255,0.10)', borderRadius: '2px 0 0 2px' }} />
      ))}
      <div className="absolute" style={{ right: '-3px', top: 128, width: 3, height: 60, background: 'rgba(255,255,255,0.10)', borderRadius: '0 2px 2px 0' }} />

      {/* Frame */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 44,
          background: 'linear-gradient(160deg, #1c2233 0%, #0d1117 50%, #080c14 100%)',
          border: '2px solid rgba(255,255,255,0.09)',
          boxShadow: '0 40px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 50px -10px rgba(16,185,129,0.18)',
        }}
      >
        {/* Dynamic island */}
        <div className="flex justify-center pt-3.5 pb-1">
          <div style={{ width: 88, height: 26, borderRadius: 20, background: '#000', border: '1px solid rgba(255,255,255,0.05)' }} />
        </div>
        {/* Status bar */}
        <div className="flex justify-between items-center text-[10px] font-medium px-5 pb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span style={{ letterSpacing: '0.05em' }}>●●●</span>
            <span className="ml-1">5G</span>
          </div>
        </div>

        {/* Screen */}
        <div className="px-3 pb-0" style={{ minHeight: 390 }}>
          {/* WA header */}
          <div className="flex items-center gap-2.5 px-2 py-2.5 -mx-3 -mt-1" style={{ background: '#1f2c34' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            <img src="/CallGuard_logo_mark.png" alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold leading-tight" style={{ color: '#e9edef' }}>CallGuard 360</p>
              <p className="text-[9px] leading-tight" style={{ color: '#8696a0' }}>online</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="-mx-3 px-2 pt-3 pb-2" style={{ background: '#0b141a', minHeight: 320 }}>
            {/* Report bubble */}
            <div
              className="rounded-lg rounded-tl-none px-3 pt-2.5 pb-1.5 relative"
              style={{ background: '#202c33', maxWidth: '96%', color: '#e9edef', fontSize: 10, lineHeight: 1.5 }}
            >
              {/* Tail */}
              <div className="absolute" style={{ top: 0, left: -7, width: 0, height: 0, borderTop: '8px solid #202c33', borderLeft: '8px solid transparent' }} />

              <p className="font-bold mb-1.5" style={{ color: '#00a884', fontSize: 10 }}>
                📊 WEEKLY REPORT — W/E 12 JAN
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 6, marginBottom: 6 }}>
                <div className="flex justify-between mb-0.5">
                  <span style={{ color: '#8696a0' }}>Enquiries recovered</span>
                  <span className="font-bold tabular-nums" style={{ color: '#e9edef' }}>{enquiries}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#8696a0' }}>Estimated value</span>
                  <span className="font-bold tabular-nums" style={{ color: '#00a884' }}>
                    £{valueLow}–£{valueHigh}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 6, marginBottom: 6 }}>
                <div className="flex justify-between mb-0.5">
                  <span>🔴 Urgent</span><span className="tabular-nums">2</span>
                </div>
                <div className="flex justify-between mb-0.5">
                  <span>🟡 Same-day</span><span className="tabular-nums">3</span>
                </div>
                <div className="flex justify-between">
                  <span>🟢 Quote</span><span className="tabular-nums">1</span>
                </div>
              </div>

              <p style={{ color: '#8696a0', fontSize: 9, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 5 }}>
                Busiest window: Tue 11am–2pm
              </p>

              <div className="flex justify-end mt-1">
                <span style={{ color: '#8696a0', fontSize: 9 }}>{timeStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-3" style={{ background: '#0b141a' }}>
          <div style={{ width: 96, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.18)' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

const CallGuardTrialSection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [buttonPulseDone, setButtonPulseDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    setButtonPulseDone(true);
  }, [inView, prefersReducedMotion]);

  return (
    <section className="section-padding pt-12 md:pt-16 relative overflow-hidden" ref={sectionRef}>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Two-column grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left column — text + CTA */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <h2 className="cg-h2 text-h1 md:text-h1-lg text-text mb-3 leading-tight">
              Find out what you&apos;ve been missing
            </h2>

            <p className="cg-body text-base md:text-lg text-muted leading-relaxed mb-6">
              Run CallGuard on your number for 30 days. See which missed calls were real jobs, how much they were worth, and decide if it earns its place.
            </p>

            {/* Killer line — 3 pills */}
            <div className="flex flex-wrap gap-2 mb-7">
              {KILLER_PHRASES.map((phrase) => (
                <span
                  key={phrase}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-border/70 bg-surface2/50 text-sm font-semibold text-text/90 tracking-wide"
                >
                  {phrase}
                </span>
              ))}
            </div>

            {/* Personal touch */}
            <p className="text-sm text-muted/65 italic mb-5">
              I&apos;ll personally set this up with you — no tickets, no handoffs.
            </p>

            {/* CTA */}
            <div className="relative inline-block w-full sm:w-auto">
              {!prefersReducedMotion && buttonPulseDone && (
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-xl bg-primary/30 blur-lg -z-10"
                  initial={{ opacity: 0.8, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  aria-hidden
                />
              )}
              <button
                type="button"
                onClick={() => navigate('/onboard')}
                className="cg-label w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground text-base transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                style={{ boxShadow: '0 0 32px -4px rgba(37,99,235,0.55), 0 8px 24px -8px rgba(37,99,235,0.4)' }}
              >
                Start my 30 free day trial
              </button>
            </div>

            <p className="cg-body text-xs text-muted/70 mt-4">
              No commitment until you&apos;ve seen it working. At day 30 you choose.
            </p>
            <p className="cg-body text-[11px] text-muted/55 mt-2">
              Currently running with independent UK electricians.
            </p>
          </motion.div>

          {/* Right column — animated weekly report phone */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <WeeklyReportPhone inView={inView} reduceMotion={!!prefersReducedMotion} />
            <p className="text-xs text-muted/50 text-center mt-1">
              Delivered to your WhatsApp every Monday morning.
            </p>
          </motion.div>
        </div>

        {/* ── Timeline strip ──────────────────────────────────────────────── */}
        <motion.div
          className="mt-10 pt-8 border-t border-border/30"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={inView && !prefersReducedMotion ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0">
            {TIMELINE.map(({ icon: Icon, label, sub }, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center text-center px-5 py-2">
                  <Icon className="w-6 h-6 text-primary mb-1.5 flex-shrink-0" />
                  <span className="text-md font-semibold text-text/80">{label}</span>
                  <span className="text-[14px] text-muted/55 mt-0.5 leading-snug max-w-[120px]">{sub}</span>
                </div>
                {i < TIMELINE.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-muted/25 hidden sm:block flex-shrink-0 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CallGuardTrialSection;
