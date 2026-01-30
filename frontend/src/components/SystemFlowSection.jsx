import React, { useRef, useState, useEffect } from 'react';
import {
  MessageSquare,
  Wrench,
  Reply,
  MessageCircle,
  PhoneCall,
  CheckCircle,
  PhoneIncoming,
  ChevronDown,
  FileText,
  Phone
} from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

const GLASS_STYLE = {
  background: 'rgba(17, 24, 39, 0.4)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 2px 8px rgba(59, 130, 246, 0.1)
  `
};

const OUTCOME_CARDS = [
  {
    icon: MessageSquare,
    title: 'We acknowledge the customer instantly',
    body: 'An SMS goes out in ~10 seconds so they don\'t ring the next electrician.',
    badge: '~10 seconds',
    accent: 'blue',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.25)'
  },
  {
    icon: FileText,
    title: 'You get context, not just a number',
    body: 'Urgency + short description + postcode captured in one reply.',
    badge: null,
    accent: 'purple',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.25)'
  },
  {
    icon: Phone,
    title: 'You call back when free — still in the running',
    body: 'Even 5–15 minutes later, you\'re not forgotten.',
    badge: null,
    accent: 'emerald',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.25)'
  }
];

const STEPS = [
  {
    icon: PhoneIncoming,
    title: '1. Customer calls',
    supporting: 'Usually during an urgent moment (no power, tripping, sparks).',
    timeTag: null,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    glowColor: 'rgba(239,68,68,0.6)'
  },
  {
    icon: Wrench,
    title: "2. You're on another job",
    supporting: "You can't answer — and that's when most jobs are lost.",
    timeTag: null,
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    glowColor: 'rgba(245,158,11,0.6)'
  },
  {
    icon: MessageSquare,
    title: '3. SMS sent',
    supporting: 'Acknowledges the call and asks for urgency (1 Emergency / 2 Today / 3 Quote).',
    timeTag: '~10 seconds',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    glowColor: 'rgba(59,130,246,0.7)'
  },
  {
    icon: Reply,
    title: '4. Customer replies',
    supporting: 'They pick a number and add a short description + postcode.',
    timeTag: null,
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    glowColor: 'rgba(168,85,247,0.6)'
  },
  {
    icon: MessageCircle,
    title: '5. You get it in WhatsApp',
    supporting: 'Urgency, description, and postcode land where you already work.',
    timeTag: null,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    glowColor: 'rgba(34,197,94,0.6)'
  },
  {
    icon: PhoneCall,
    title: '6. You call back when free',
    supporting: 'You already know the issue + location, so you can prioritise.',
    timeTag: null,
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    glowColor: 'rgba(6,182,212,0.6)'
  },
  {
    icon: CheckCircle,
    title: '7. Job saved',
    supporting: "Even if you call back 5–15 minutes later, you've stayed in the running.",
    timeTag: null,
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    glowColor: 'rgba(16,185,129,0.6)'
  }
];

const SystemFlowSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [inView, setInView] = useState(false);
  const [progressLine, setProgressLine] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const sweepDoneRef = useRef(false);

  // Section in-view: drive progress line and gradient sweep (no animation if reduced motion)
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !inView) {
      setProgressLine(1);
      return;
    }
    const start = performance.now();
    const duration = 800;
    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      setProgressLine(t);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, prefersReducedMotion]);

  // Very subtle pulsing border every ~12–15s (respect reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setPulsePhase((p) => (p + 1) % 2), 13000);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const expandId = 'system-flow-details';
  const expandDuration = prefersReducedMotion ? 0 : 0.35;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-ink py-12 md:py-16 relative overflow-hidden"
    >
      {/* Radial gradient from top-right to marry up with section above (bottom-right glow) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_20%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-3 md:mb-4">
            How CallGuard works after a missed call
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            In less than 10 seconds, the customer is acknowledged, urgency is captured, and you get a short description where you already work.
          </p>
        </div>

        {/* Main glass container: 3-beat outcome cards + optional progress line */}
        <div
          className="rounded-2xl p-4 md:p-6 relative overflow-hidden transition-shadow duration-500"
          style={{
            ...GLASS_STYLE,
            ...(!prefersReducedMotion && pulsePhase === 1
              ? { boxShadow: `${GLASS_STYLE.boxShadow}, 0 0 24px rgba(59, 130, 246, 0.08)` }
              : {})
          }}
        >
          {/* Top gradient highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-50 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)'
            }}
          />
          {/* One-pass gradient sweep when section first enters view (reduced-motion: no) */}
          {!prefersReducedMotion && inView && !sweepDoneRef.current && (
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => { sweepDoneRef.current = true; }}
              style={{
                width: '60%',
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.12), transparent)'
              }}
            />
          )}

          {/* Optional progress line (left-to-right when section in view) */}
          {!prefersReducedMotion && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-surface2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#c084fc94] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progressLine * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          )}

          {/* 3-beat outcome cards */}
          <div className="relative space-y-4 md:space-y-5">
            {OUTCOME_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.4,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="relative rounded-xl p-4 md:p-5 border border-white/10 transition-[transform,box-shadow] duration-200 md:hover:translate-y-[-2px] md:hover:shadow-lg"
                  style={{
                    background: 'rgba(30, 41, 59, 0.35)',
                    boxShadow: `0 0 24px ${card.glowColor}`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 ${card.bgColor} ${card.borderColor}`}
                    >
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${card.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-text">
                          {card.title}
                        </h3>
                        {card.badge && (
                          <span className="inline-flex px-2.5 py-0.5 bg-primary/15 text-primary text-[11px] md:text-xs font-medium rounded-full border border-primary/30">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-muted text-sm md:text-base leading-relaxed">
                        {card.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* "See the exact flow" toggle */}
          <div className="mt-6 md:mt-8">
            <button
              type="button"
              onClick={() => setDetailsExpanded((e) => !e)}
              aria-expanded={detailsExpanded}
              aria-controls={expandId}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-border bg-surface2/40 text-muted hover:text-text hover:bg-surface2/60 hover:border-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[hsl(var(--bg))]"
            >
              <span className="text-sm font-medium">
                {detailsExpanded ? 'Hide the exact flow' : 'See the exact flow'}
              </span>
              <motion.span
                animate={{ rotate: detailsExpanded ? 180 : 0 }}
                transition={{ duration: expandDuration, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {detailsExpanded && (
                <motion.div
                  id={expandId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: expandDuration, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: expandDuration * 0.8 }
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 pb-2 pl-5 border-t border-primary/50 mt-6">
                    <p className="text-xs text-muted mb-4 font-medium uppercase tracking-wide">
                      Flow (7 steps)
                    </p>
                    <div className="space-y-6">
                      {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 text-left"
                          >
                            <div
                              className={`flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 ${step.bgColor} ${step.borderColor}`}
                              style={{ boxShadow: `0 0 24px ${step.glowColor}` }}
                            >
                              <Icon className={`w-5 h-5 md:w-6 md:h-6 ${step.textColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="text-base md:text-lg font-semibold text-text">
                                  {step.title}
                                </h3>
                                {step.timeTag && (
                                  <span className="inline-flex px-2.5 py-0.5 bg-primary/15 text-primary text-[11px] md:text-xs font-medium rounded-full border border-primary/30">
                                    {step.timeTag}
                                  </span>
                                )}
                              </div>
                              <p className="text-muted text-sm md:text-base leading-relaxed">
                                {step.supporting}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer line */}
        <p className="text-center text-muted text-base md:text-lg font-medium mt-6">
          No apps. No dashboards. Everything lands where you already work.
        </p>
      </div>
    </section>
  );
};

export default SystemFlowSection;
