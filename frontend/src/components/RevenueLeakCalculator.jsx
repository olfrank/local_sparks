import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEKS_PER_MONTH = 4.33;
const GBP = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const DEFAULT_MISSED_CALLS = 5;
const DEFAULT_AVG_JOB = 300;
const DEFAULT_CONVERSION = 30;

const MISSED_CALLS_MIN = 1;
const MISSED_CALLS_MAX = 30;
const AVG_JOB_MIN = 50;
const AVG_JOB_MAX = 2000;
const CONVERSION_MIN = 10;
const CONVERSION_MAX = 50;

const DEBOUNCE_MS = 150;
const ANIM_DURATION_MS = 400;

const PRESETS = [
  { id: 'solo', label: 'Solo electrician', missed: 4, avg: 250, conversion: 30 },
  { id: 'busy', label: 'Busy week', missed: 8, avg: 350, conversion: 35 },
  { id: 'emergency', label: 'Emergency heavy', missed: 6, avg: 450, conversion: 40 },
];

const REVENUE_THRESHOLDS = [500, 1000, 2000];

function getHumanTranslation(revenueMid, jobsPerMonth) {
  if (revenueMid >= 2000) {
    return `That could cover your van + fuel for the month.`;
  }
  if (revenueMid >= 1000) {
    return `That's about a week of work quietly disappearing.`;
  }
  const jobsRounded = jobsPerMonth < 1 ? (jobsPerMonth < 0.5 ? 'under 1' : 'around 1') : jobsPerMonth <= 1.5 ? '1–2' : jobsPerMonth <= 2.5 ? '2–3' : Math.round(jobsPerMonth);
  const jobsStr = typeof jobsRounded === 'number' ? `${jobsRounded}` : jobsRounded;
  return `That's roughly ${jobsStr} emergency job${jobsStr === '1' || jobsStr === 'under 1' ? '' : 's'} a month at your average value.`;
}

function getThresholdLevel(revenueMid) {
  if (revenueMid >= 2000) return 'high';
  if (revenueMid >= 1000) return 'medium';
  if (revenueMid >= 500) return 'low';
  return 'base';
}

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

function animateValue(from, to, durationMs, onUpdate, onComplete) {
  const start = performance.now();
  let raf;
  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    const current = Math.round(from + (to - from) * eased);
    onUpdate(current);
    if (progress < 1) raf = requestAnimationFrame(tick);
    else onComplete?.();
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function AnimatedNumber({ value, formatter = (v) => v, reduceMotion = false, className }) {
  const [displayed, setDisplayed] = useState(value);
  const displayedRef = useRef(value);

  useEffect(() => {
    displayedRef.current = displayed;
  }, [displayed]);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(value);
      displayedRef.current = value;
      return;
    }
    const from = displayedRef.current;
    const to = value;
    if (from === to) return;
    const cancel = animateValue(
      from,
      to,
      ANIM_DURATION_MS,
      (v) => {
        setDisplayed(v);
        displayedRef.current = v;
      },
      () => { displayedRef.current = to; }
    );
    return cancel;
  }, [value, reduceMotion]);

  return <span className={className}>{formatter(displayed)}</span>;
}

export function RevenueLeakCalculator() {
  const prefersReducedMotion = useReducedMotion();

  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(DEFAULT_MISSED_CALLS);
  const [avgJobValue, setAvgJobValue] = useState(DEFAULT_AVG_JOB);
  const [conversionRate, setConversionRate] = useState(DEFAULT_CONVERSION);
  const [pulseKey, setPulseKey] = useState(0);
  const [estimateOpen, setEstimateOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const debouncedMissed = useDebouncedValue(missedCallsPerWeek, DEBOUNCE_MS);
  const debouncedAvg = useDebouncedValue(avgJobValue, DEBOUNCE_MS);
  const debouncedConv = useDebouncedValue(conversionRate, DEBOUNCE_MS);

  const { revenueLow, revenueHigh, jobsPerMonth, revenueMid, lowRate, highRate } = useMemo(() => {
    const lowRate = Math.max(5, debouncedConv - 10);
    const highRate = Math.min(60, debouncedConv + 10);
    const missedJobsLow = debouncedMissed * WEEKS_PER_MONTH * (lowRate / 100);
    const missedJobsMid = debouncedMissed * WEEKS_PER_MONTH * (debouncedConv / 100);
    const missedJobsHigh = debouncedMissed * WEEKS_PER_MONTH * (highRate / 100);
    const revenueLow = Math.round(missedJobsLow * debouncedAvg);
    const revenueHigh = Math.round(missedJobsHigh * debouncedAvg);
    const revenueMid = Math.round(missedJobsMid * debouncedAvg);
    const jobsPerMonth = missedJobsMid < 1 ? Math.round(missedJobsMid * 10) / 10 : Math.round(missedJobsMid);
    return { revenueLow, revenueHigh, revenueMid, jobsPerMonth, lowRate, highRate };
  }, [debouncedMissed, debouncedAvg, debouncedConv]);

  const humanTranslation = useMemo(
    () => getHumanTranslation(revenueMid, jobsPerMonth),
    [revenueMid, jobsPerMonth]
  );
  const thresholdLevel = useMemo(() => getThresholdLevel(revenueMid), [revenueMid]);

  useEffect(() => {
    setPulseKey((k) => k + 1);
  }, [revenueLow, revenueHigh]);

  const scrollToBooking = useCallback(() => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleMissedChange = (v) => {
    setMissedCallsPerWeek(Math.max(MISSED_CALLS_MIN, Math.min(MISSED_CALLS_MAX, Number(v) || 0)));
    setActivePreset(null);
  };
  const handleAvgChange = (v) => {
    setAvgJobValue(Math.max(AVG_JOB_MIN, Math.min(AVG_JOB_MAX, Number(v) || 0)));
    setActivePreset(null);
  };
  const handleConversionChange = (v) => {
    setConversionRate(Math.max(CONVERSION_MIN, Math.min(CONVERSION_MAX, Number(v) || 0)));
    setActivePreset(null);
  };

  const applyPreset = useCallback((preset) => {
    setMissedCallsPerWeek(preset.missed);
    setAvgJobValue(preset.avg);
    setConversionRate(preset.conversion);
    setActivePreset(preset.id);
  }, []);

  return (
    <section
      className="section-padding relative overflow-hidden bg-ink"
      aria-labelledby="revenue-calculator-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/6 blur-3xl rounded-full" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 id="revenue-calculator-heading" className="cg-h2 text-h1 text-text mb-3">
            How much money are missed calls costing you?
          </h2>
          <p className="cg-body text-lg text-muted max-w-2xl mx-auto">
            Adjust the numbers to see what could be quietly slipping away each month.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Left: presets + inputs */}
            <div className="space-y-5">
              {/* Preset pills */}
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      'cg-label px-3 py-1.5 rounded-full text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
                      activePreset === preset.id
                        ? 'bg-primary/20 border border-primary/40 text-primary'
                        : 'bg-surface2/60 border border-transparent text-muted hover:text-text hover:bg-surface2/80'
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2 rounded-xl bg-surface2/40 border border-white/10 p-4 md:p-5">
                <Label htmlFor="missed-calls" className="cg-label text-text">
                  Missed calls per week
                </Label>
                <p className="cg-body text-xs text-muted/90 mb-1">
                  Most electricians miss 3–8 calls a week — start here.
                </p>
                <div className="flex gap-3 items-center">
                  <Input
                    id="missed-calls"
                    type="number"
                    min={MISSED_CALLS_MIN}
                    max={MISSED_CALLS_MAX}
                    value={missedCallsPerWeek}
                    onChange={(e) => handleMissedChange(e.target.value)}
                    className="w-20 bg-surface border-border text-text h-10"
                    aria-describedby="missed-calls-desc"
                  />
                  <Slider
                    value={[missedCallsPerWeek]}
                    onValueChange={([v]) => { setMissedCallsPerWeek(v); setActivePreset(null); }}
                    min={MISSED_CALLS_MIN}
                    max={MISSED_CALLS_MAX}
                    step={1}
                    className="flex-1 touch-manipulation [&_[data-orientation=horizontal]]:h-2.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:min-w-6 [&_[role=slider]]:shadow-md [&_[role=slider]]:border-2"
                    aria-label="Missed calls per week"
                  />
                </div>
                <p id="missed-calls-desc" className="text-xs text-muted sr-only">
                  Between {MISSED_CALLS_MIN} and {MISSED_CALLS_MAX} calls per week
                </p>
              </div>

              <div className="space-y-2 rounded-xl bg-surface2/40 border border-white/10 p-4 md:p-5">
                <Label htmlFor="avg-job" className="cg-label text-text">
                  Average job value (£)
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    id="avg-job"
                    type="number"
                    min={AVG_JOB_MIN}
                    max={AVG_JOB_MAX}
                    value={avgJobValue}
                    onChange={(e) => handleAvgChange(e.target.value)}
                    className="w-24 bg-surface border-border text-text h-10"
                    aria-describedby="avg-job-desc"
                  />
                  <Slider
                    value={[avgJobValue]}
                    onValueChange={([v]) => { setAvgJobValue(v); setActivePreset(null); }}
                    min={AVG_JOB_MIN}
                    max={AVG_JOB_MAX}
                    step={50}
                    className="flex-1 touch-manipulation [&_[data-orientation=horizontal]]:h-2.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:min-w-6 [&_[role=slider]]:shadow-md [&_[role=slider]]:border-2"
                    aria-label="Average job value in pounds"
                  />
                </div>
                <p id="avg-job-desc" className="text-xs text-muted sr-only">
                  Between £{AVG_JOB_MIN} and £{AVG_JOB_MAX}
                </p>
              </div>

              <div className="space-y-2 rounded-xl bg-surface2/40 border border-white/10 p-4 md:p-5">
                <Label htmlFor="conversion" className="cg-label text-text">
                  Conversion rate from missed call to job (%)
                </Label>
                <div className="flex gap-3 items-center">
                  <span className="cg-label w-12 text-right text-text tabular-nums" aria-hidden="true">
                    {conversionRate}%
                  </span>
                  <Slider
                    id="conversion"
                    value={[conversionRate]}
                    onValueChange={([v]) => { setConversionRate(v); setActivePreset(null); }}
                    min={CONVERSION_MIN}
                    max={CONVERSION_MAX}
                    step={5}
                    className="flex-1 touch-manipulation [&_[data-orientation=horizontal]]:h-2.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:min-w-6 [&_[role=slider]]:shadow-md [&_[role=slider]]:border-2"
                    aria-label="Conversion rate from missed call to job, percentage"
                    aria-valuetext={`${conversionRate} percent`}
                  />
                </div>
                <p className="cg-body text-xs text-muted">10–50%. Industry estimates often sit around 20–40%.</p>
              </div>

              <Collapsible className="pt-2" open={estimateOpen} onOpenChange={setEstimateOpen}>
                <CollapsibleTrigger className="cg-label inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                  <Calculator className="w-4 h-4" aria-hidden />
                  How we estimate
                  <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', estimateOpen && 'rotate-180')} aria-hidden />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="cg-body mt-2 text-sm text-muted">
                    Assumes {debouncedMissed} missed calls per week, of which {debouncedConv}% could become real jobs, with an average job value of {GBP.format(debouncedAvg)}. We show a range using ±10% conversion to reflect uncertainty.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Right: results */}
            <div className="flex flex-col justify-center lg:pl-4">
              <div className="relative">
                {/* Soft glow pulse once per update */}
                {!prefersReducedMotion && (
                  <motion.div
                    key={pulseKey}
                    className="absolute inset-0 rounded-xl blur-2xl -z-10 bg-primary/20"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    aria-hidden
                  />
                )}
                {/* Shimmer sweep once per update */}
                {!prefersReducedMotion && (
                  <motion.div
                    key={`shimmer-${pulseKey}`}
                    className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 0.4, duration: 0.2 }}
                    aria-hidden
                  >
                    <motion.div
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                  </motion.div>
                )}
                <motion.div
                  key={pulseKey}
                  initial={prefersReducedMotion ? false : { scale: 1 }}
                  animate={
                    prefersReducedMotion ? undefined : { scale: [1, 1.01, 1] }
                  }
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={cn(
                    'relative rounded-xl border p-5 md:p-6 overflow-hidden z-10',
                    thresholdLevel === 'high' && 'border-amber-500/25 bg-gradient-to-br from-surface2/60 to-amber-950/20',
                    thresholdLevel === 'medium' && 'border-amber-500/20 bg-gradient-to-br from-surface2/60 to-amber-950/10',
                    thresholdLevel === 'low' && 'border-primary/25 bg-surface2/50',
                    thresholdLevel === 'base' && 'border-primary/20 bg-surface2/50'
                  )}
                >
                  {/* Updated dot */}
                  {!prefersReducedMotion && (
                    <motion.span
                      key={pulseKey}
                      className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      aria-hidden
                    />
                  )}
                  <p className="cg-label text-xs text-muted uppercase tracking-wide mb-1">
                    Potential missed revenue per month
                  </p>
                  <p className="cg-label text-3xl md:text-4xl lg:text-[2.5rem] text-text tabular-nums leading-tight">
                    <AnimatedNumber
                      value={revenueLow}
                      formatter={GBP.format}
                      reduceMotion={!!prefersReducedMotion}
                      className="text-primary"
                    />
                    {' – '}
                    <AnimatedNumber
                      value={revenueHigh}
                      formatter={GBP.format}
                      reduceMotion={!!prefersReducedMotion}
                      className="text-primary"
                    />
                  </p>
                  <p className="cg-body mt-3 text-base text-muted">
                    {humanTranslation}
                  </p>
                  <p className="cg-body mt-2 text-xs text-muted/80">
                    These are calls that likely went to the next electrician on Google.
                  </p>
                  <p className="cg-body mt-2 text-xs text-muted/70">
                    Conservative estimate — depends on call quality and seasonality.
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="mt-5"
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Button
                  onClick={scrollToBooking}
                  className={cn(
                    'cg-label w-full py-6 text-base rounded-xl',
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                    'shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                  )}
                >
                  Run my 30-day Revenue Audit (free)
                </Button>
              </motion.div>
              <p className="cg-body text-center text-sm text-muted mt-2">
                We&apos;ll show you exactly which missed calls turn into real jobs.
              </p>
              <p className="text-center mt-3">
                <button
                  type="button"
                  onClick={scrollToBooking}
                  className="cg-label text-xs text-muted/80 hover:text-muted transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded"
                >
                  Or book a 5-min fit check
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RevenueLeakCalculator;

/*
  SUMMARY OF CHANGES (RevenueLeakCalculator.jsx)
  — Copy: Title → "How much money are missed calls costing you?"; subtitle → "Adjust the numbers..."; hint above first slider "Most electricians miss 3–8 calls a week — start here."
  — Presets: PRESETS constant + applyPreset(); 3 pills (Solo / Busy week / Emergency heavy) above sliders; activePreset state; sliders/inputs clear preset on change.
  — Result "alive": pulseKey triggers soft glow (blur), shimmer sweep on number area, scale 1→1.01→1 on card, tiny "updated" dot (fades out). Threshold styling at £500/£1000/£2000 (getThresholdLevel): warmer border + gradient (amber) for medium/high.
  — Human translation: getHumanTranslation(revenueMid, jobsPerMonth) with bands (van+fuel, week of work, X emergency jobs). Muted line: "These are calls that likely went to the next electrician on Google."
  — CTA: "Run my 30-day Revenue Audit (free)"; microcopy "We'll show you exactly which missed calls turn into real jobs."; secondary "Or book a 5-min fit check" (quieter, text-xs). CTA wrapper has whileHover y: -2.
  — Visual: Section background accent orbs (primary + teal blur); left column inputs in rounded panels (bg-surface2/40, border-border/50); sliders thicker track (h-2.5), thumb shadow + border; result card larger type (lg:text-[2.5rem]), threshold-based className (amber border/gradient for medium/high). All motion respects prefersReducedMotion.
*/
