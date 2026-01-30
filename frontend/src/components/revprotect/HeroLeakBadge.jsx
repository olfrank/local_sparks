import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Phone, ArrowRight, PoundSterling } from 'lucide-react';

const STATES = [
  {
    key: 'missed',
    title: 'Missed call',
    sub: 'Customer needed help now',
    Icon: Phone
  },
  {
    key: 'next',
    title: 'Customer rings the next electrician',
    sub: 'No voicemail. No waiting.',
    Icon: ArrowRight
  },
  {
    key: 'lost',
    title: '£250–£500 job gone',
    sub: 'Typical emergency call-out',
    Icon: PoundSterling
  }
];

const HeroLeakBadge = () => {
  const prefersReducedMotion = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(0);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let isMounted = true;

    const runSequence = () => {
      if (!isMounted) return;

      setStageIndex(0);

      const timeouts = [];

      timeouts.push(
        setTimeout(() => {
          if (!isMounted) return;
          setStageIndex(1);
        }, 2000)
      );

      timeouts.push(
        setTimeout(() => {
          if (!isMounted) return;
          setStageIndex(2);
        }, 5000)
      );

      timeouts.push(
        setTimeout(() => {
          if (!isMounted) return;
          setLoop((l) => l + 1);
        }, 7000)
      );

      return () => {
        timeouts.forEach(clearTimeout);
      };
    };

    const cleanup = runSequence();

    const interval = setInterval(() => {
      runSequence();
    }, 12000);

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
      clearInterval(interval);
    };
  }, [prefersReducedMotion]);

  const activeState = prefersReducedMotion ? STATES[2] : STATES[stageIndex] || STATES[0];

  // Hero focal: premium pill with entrance animation (opacity + y + blur -> crisp)
  return (
    <div className="inline-flex flex-col items-start">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative inline-flex items-center rounded-full border-2 border-primary/55 bg-white/[0.08] px-4 py-2.5 shadow-[0_0_32px_rgba(37,99,235,0.2),0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl [box-shadow:0_0_0_1px_rgba(255,255,255,0.06)_inset]"
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.15),transparent_60%)] pointer-events-none" />
        <div className="relative flex items-center gap-3.5 text-sm">
          {/* Icon – slightly larger for focal */}
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400/15 text-emerald-400 ring-1 ring-emerald-400/20">
            <activeState.Icon className="w-4 h-4" />
          </div>

          {/* Text – 10–20% larger, higher contrast */}
          <div className="flex flex-col">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={`${activeState.key}-${loop}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="whitespace-nowrap text-[13px] font-semibold text-text"
              >
                {activeState.title}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-muted/90 leading-tight">
              {activeState.sub}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 ml-2">
            {STATES.map((state) => {
              const isActive = state.key === activeState.key;
              return (
                <span
                  key={state.key}
                  className={`rounded-full transition-all ${
                    isActive
                      ? 'w-2 h-2 bg-primary'
                      : 'w-1.5 h-1.5 bg-muted/50'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
      {/* Caption removed – merged into main paragraph in hero for fewer stacked blocks */}
    </div>
  );
};

export default HeroLeakBadge;
