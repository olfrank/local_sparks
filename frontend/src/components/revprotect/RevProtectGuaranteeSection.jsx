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

// ─── Weekly report phone mockup ───────────────────────────────────────────────

function WeeklyReportPhone({ reduceMotion }) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMon = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const dateRange = `${fmt(monday)} – ${fmt(sunday)}`;

  const msgLines = [
    { text: `CallGuard Weekly Report (${dateRange})`, bold: true },
    { text: '' },
    { text: '6 enquiries recovered this week — 5 more than last week.' },
    { text: '' },
    { text: '📋 What came in', bold: true },
    { text: '• New enquiries: 6' },
    { text: '• Customers who replied: 3 (50%)' },
    { text: '' },
    { text: '💰 Value protected', bold: true },
    { text: '• Opportunities recovered: 2' },
    { text: '• Estimated recovered value: £300–£600' },
    { text: '' },
    { text: '⚡ Response speed', bold: true },
    { text: '• Time to alert you: 14s' },
    { text: '• Customer response time: 56s' },
    { text: '' },
    { text: '🔥 Urgency this week', bold: true },
    { text: 'Needed Today 33% • Quote 17% • Soon 17% • Emergency 17%' },
    { text: '' },
    { text: '📍 Busiest missed window', bold: true },
    { text: 'Thu 20:00–22:00' },
    { text: '' },
    { text: 'CallGuard has protected 16 enquiries since you started.' },
  ];

  return (
    <div
      className="relative mx-auto select-none"
      style={{
        width: 'min(296px, 82vw)',
        animation: reduceMotion ? 'none' : 'phoneFloat 3s ease-in-out infinite',
      }}
    >
      {/* Side buttons (left) */}
      <div className="absolute" style={{ left: '-3px', top: '90px', width: '3px', height: '26px', background: 'rgba(255,255,255,0.10)', borderRadius: '2px 0 0 2px' }} />
      <div className="absolute" style={{ left: '-3px', top: '128px', width: '3px', height: '44px', background: 'rgba(255,255,255,0.10)', borderRadius: '2px 0 0 2px' }} />
      <div className="absolute" style={{ left: '-3px', top: '184px', width: '3px', height: '44px', background: 'rgba(255,255,255,0.10)', borderRadius: '2px 0 0 2px' }} />
      {/* Power button (right) */}
      <div className="absolute" style={{ right: '-3px', top: '128px', width: '3px', height: '60px', background: 'rgba(255,255,255,0.10)', borderRadius: '0 2px 2px 0' }} />

      {/* Outer frame */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: '44px',
          background: 'linear-gradient(160deg, #1c2233 0%, #0d1117 50%, #080c14 100%)',
          border: '2px solid rgba(255,255,255,0.09)',
          boxShadow: '0 40px 60px -20px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 1px rgba(255,255,255,0.06) inset, 0 0 60px -20px rgba(37,99,235,0.15)',
        }}
      >
        {/* Dynamic island */}
        <div className="flex justify-center pt-3.5 pb-1">
          <div style={{ width: '88px', height: '26px', borderRadius: '20px', background: '#000', border: '1px solid rgba(255,255,255,0.05)' }} />
        </div>

        {/* Status bar */}
        <div className="flex justify-between items-center text-[10px] font-medium px-5 pb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span style={{ letterSpacing: '0.05em' }}>●●●</span>
            <span className="ml-1">5G</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" className="ml-1 opacity-60">
              <rect x="0" y="4" width="3" height="6" rx="0.5" />
              <rect x="4.5" y="2.5" width="3" height="7.5" rx="0.5" />
              <rect x="9" y="1" width="3" height="9" rx="0.5" />
              <rect x="13.5" y="0" width="2.5" height="10" rx="0.5" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Screen */}
        <div className="px-3 pb-0" style={{ minHeight: '430px' }}>
          <div className="flex flex-col" style={{ height: '100%' }}>
            {/* WA header */}
            <div className="flex items-center gap-2.5 px-2 py-2.5 -mx-3 -mt-1 mb-0" style={{ background: '#1f2c34' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#aebac1">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              <img src="/CallGuard_logo_mark.png" alt="" className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-tight" style={{ color: '#e9edef' }}>CallGuard 360</p>
                <p className="text-[9px] leading-tight" style={{ color: '#8696a0' }}>CallGuard 360</p>
              </div>
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#aebac1">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>

            {/* Chat area */}
            <div className="-mx-3 px-2 pt-3 pb-2 overflow-y-auto" style={{ background: '#0b141a', minHeight: '340px' }}>
              <div
                className="rounded-lg rounded-tl-none px-3 pt-2.5 pb-1.5 relative"
                style={{ background: '#202c33', maxWidth: '97%' }}
              >
                {/* Tail */}
                <div className="absolute" style={{ top: 0, left: '-7px', width: 0, height: 0, borderTop: '8px solid #202c33', borderLeft: '8px solid transparent' }} />

                {/* Message lines */}
                <div className="space-y-0" style={{ lineHeight: '1.55' }}>
                  {msgLines.map((line, i) =>
                    line.text === '' ? (
                      <div key={i} style={{ height: '6px' }} />
                    ) : (
                      <p
                        key={i}
                        className="text-[11px]"
                        style={{
                          color: line.bold ? '#e9edef' : '#d1d7db',
                          fontWeight: line.bold ? 600 : 400,
                        }}
                      >
                        {line.text}
                      </p>
                    )
                  )}
                </div>

                {/* Time + blue double tick */}
                <div className="flex justify-end items-center gap-1 mt-1.5">
                  <span className="text-[9px]" style={{ color: '#8696a0' }}>08:07</span>
                  <svg viewBox="0 0 18 11" width="14" height="9" fill="none">
                    <path d="M1 5.5L5.5 10L17 1" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 5.5L10.5 10L23 1" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="-mx-3 flex items-center gap-2 px-2 py-2" style={{ background: '#1f2c34' }}>
              <div className="flex-1 rounded-full px-3 py-1.5 text-[10px]" style={{ background: '#2a3942', color: '#8696a0' }}>
                Message
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: '#00a884' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                  <path d="M12 15.5a3.5 3.5 0 01-3.5-3.5H7a5 5 0 0010 0h-1.5A3.5 3.5 0 0112 15.5zm0-13C6.48 2.5 2 6.98 2 12.5c0 2.42.87 4.64 2.3 6.37L3 21.5l2.88-1.25A9.43 9.43 0 0012 22.5c5.52 0 10-4.48 10-10S17.52 2.5 12 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-3">
          <div style={{ width: '96px', height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.18)' }} />
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
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-border bg-surface2/50 text-base font-semibold text-text/90 tracking-wide"
                >
                  {phrase}
                </span>
              ))}
            </div>

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

            <p className="cg-body text-base text-muted text-center mt-4">
              No commitment until you&apos;ve seen it working. At day 30 you choose.
            </p>
            
          </motion.div>

          {/* Right column — animated weekly report phone */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          >
            <WeeklyReportPhone reduceMotion={!!prefersReducedMotion} />
            <p className="text-md text-muted text-center mt-1">
              Delivered to your WhatsApp every Monday morning.
            </p>
          </motion.div>
        </div>

        {/* ── Timeline strip ──────────────────────────────────────────────── */}
        <motion.div
          className="mt-10 pt-8 border-t border-border"
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
