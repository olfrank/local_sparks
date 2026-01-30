import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Phone, ArrowRight, MessageCircle, Zap, MapPin } from 'lucide-react';
import { motion, useInView, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { heroImages } from '../data/mock';
import HeroLeakBadge from './revprotect/HeroLeakBadge';

// Proof chips: inline-flex, rounded-full, glass, icon left
const PROOF_CHIPS = [
  { label: 'SMS in ~10 seconds', icon: Zap },
  { label: 'Captures urgency + postcode', icon: MapPin },
  { label: 'Delivered to WhatsApp', icon: MessageCircle },
];

const SystemHeroSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const handleCTAClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSecondaryClick = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const previewRef = useRef(null);
  const previewInView = useInView(previewRef, { once: true, margin: '-100px' });

  const [isDesktop, setIsDesktop] = useState(false);
  const [ctaHoverCount, setCtaHoverCount] = useState(0);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const fn = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  // Optional micro-parallax on demo card (desktop only, disabled when reduced motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);
  const x = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-6, 6]);
  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (rect.width / 2));
      mouseY.set((e.clientY - cy) / (rect.height / 2));
    },
    [mouseX, mouseY, prefersReducedMotion]
  );
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1220] to-[#0F172A]"
    >
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url(${heroImages.main})`,
          animation: prefersReducedMotion ? 'none' : 'slowZoom 20s ease-in-out infinite alternate'
        }}
      />
      {/* Stronger left-side gradient wash: darker left -> lighter right for calmer left column */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />
      {/* Existing vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/85 to-ink/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(11,18,32,0.7)_100%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy – local blur mask behind left column (feathered, subtle) */}
          <div className="relative text-left max-w-xl mx-auto lg:mx-0">
            {/* Local blur mask: dark translucent + backdrop-blur, feathered edges */}
            <div
              className="pointer-events-none absolute -inset-8 lg:inset-y-0 lg:-left-12 lg:right-1/2 rounded-2xl bg-ink/40 backdrop-blur-md lg:backdrop-blur-lg"
              style={{
                maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)'
              }}
            />
            {/* Spotlight behind heading */}
            <div className="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.2),_transparent_60%)] blur-2xl opacity-80" />

            <div className="relative">
              {/* Hierarchy: headline -> pill -> cause→effect line -> CTA -> chips -> body */}
              <div className="flex flex-col gap-6 mb-5">
                <h1 className="cg-h1 text-h1 md:text-h1-lg text-text">
                  Stop missed calls turning into lost jobs
                </h1>
                <HeroLeakBadge />
                {/* Cause → effect micro-story: system-status style, fade + slide on load */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
                  className="relative flex items-center gap-1.5 overflow-hidden text-[11px] md:text-xs font-normal tracking-wide text-muted/70 tabular-nums"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>Missed call</span>
                    <span className="text-muted/50" aria-hidden>→</span>
                    <span>10-second reply</span>
                    <span className="text-muted/50" aria-hidden>→</span>
                    <span>Job held</span>
                    <span className="text-muted/50" aria-hidden>→</span>
                    <span>WhatsApp alert</span>
                  </span>
                  {/* Optional: very subtle shimmer traveling across every ~11s (low-opacity overlay) */}
                 
                </motion.div>
              </div>

              {/* CTA first for hierarchy: headline -> pill -> CTA -> chips -> body */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div
                  className="relative overflow-hidden rounded-xl w-full sm:w-auto"
                  onMouseEnter={() => !prefersReducedMotion && setCtaHoverCount((c) => c + 1)}
                >
                  <Button
                    onClick={handleCTAClick}
                    size="lg"
                    className="cg-label relative z-10 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] rounded-xl group"
                  >
                    <span className="relative z-10">Book 5-min fit check</span>
                    {/* Hover sheen: gradient sweep runs once per hover; disabled when reduced motion */}
                    {!prefersReducedMotion && (
                      <span
                        key={ctaHoverCount}
                        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{
                          background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 55%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'buttonHoverSheen 0.6s ease-out forwards'
                        }}
                      />
                    )}
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="cg-label w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm md:text-base text-muted hover:text-text transition-colors"
                >
                  <span>See the 10-second demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>


              {/* Paragraph: calm but clearer – slightly higher contrast than muted, not pure white */}
              <p className="cg-body text-base md:text-lg text-text/80 mb-6 max-w-[28rem] leading-relaxed">
                Missed calls leak revenue every month. Miss one and customers call the next electrician. CallGuard replies instantly, holds the job, and sends details to WhatsApp.
              </p>
             

              {/* Proof chips – below CTA for hierarchy */}
              <div className="flex flex-wrap gap-2 mb-6">
                {PROOF_CHIPS.map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/[0.06] backdrop-blur-sm px-3.5 py-2 text-xs md:text-sm text-muted font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    {label}
                  </span>
                ))}
              </div>


              
            </div>
          </div>

          {/* Device preview – floating depth, breathing sweep, optional parallax */}
          <div className="relative max-w-lg mx-auto w-full" ref={previewRef}>
            <div className="pointer-events-none absolute -inset-x-10 -top-10 h-48 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_70%)] blur-3xl opacity-80" />

            <motion.div
              style={
                !prefersReducedMotion && isDesktop
                  ? {
                      x,
                      y,
                      rotateX,
                      rotateY,
                      transformPerspective: 800
                    }
                  : undefined
              }
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="font-system relative rounded-[32px] border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden px-4 pt-6 pb-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_40px_-10px_rgba(37,99,235,0.15)]"
            >
              {/* Breathing highlight sweep – very subtle, 10s loop */}
              <div
                className="hero-breathing-sweep pointer-events-none absolute inset-0 z-[1] rounded-[32px]"
                style={{
                  background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 55%, transparent 100%)',
                  backgroundSize: '60% 100%',
                  animation: prefersReducedMotion ? 'none' : 'heroBreathingSweep 10s ease-in-out infinite'
                }}
              />
              {/* Card content above sweep */}
              <div className="relative z-10">
              {/* Phone top bar */}
              <div className="flex justify-center mb-4">
                <div className="h-1.5 w-16 rounded-full bg-white/20" />
              </div>

              <div className="space-y-3 text-sm">
                {/* Missed call */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 text-xs text-muted"
                >
                  <Phone className="w-4 h-4 text-red-400" />
                  <span>Missed call from 07901 837 771</span>
                </motion.div>

                {/* Auto SMS */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex justify-start"
                >
                  <div className="bg-primary/90 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-lg shadow-primary/30">
                    <p className="leading-relaxed">
                      Hi, sorry I missed your call, I&apos;m on a job nearby. To make sure I get back to you as soon as possible, could you reply:
                      <br />
                      1 - Emergency
                      <br />
                      2 - Needed today
                      <br />
                      3 - Quote
                      <br />
                      Then a short description + your postcode.
                      <br />
                      I’ll be in touch shortly.
                    </p>
                  </div>
                </motion.div>

                {/* Customer reply */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex justify-end"
                >
                  <div className="bg-surface2 text-text rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm border border-border">
                    <p className="leading-relaxed">
                      1 Emergency – lights gone out at HP5 1AB
                    </p>
                  </div>
                </motion.div>

                {/* WhatsApp alert */}
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 flex gap-3 items-start"
                >
                  <div className="mt-1">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="space-y-1 text-xs text-muted">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-emerald-100 font-medium text-sm">WhatsApp alert</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-semibold">
                        1 • EMERGENCY
                      </span>
                    </div>
                    <p className="text-emerald-50 text-sm">
                      Power out – HP5 1AB. Customer ready today.
                    </p>
                    <p className="text-[11px]">
                      Call back when free. CallGuard has held the job for you.
                    </p>
                  </div>
                </motion.div>
              </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator – no bounce when reduced motion */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-text/30 rounded-full flex justify-center pt-2 animate-bounce motion-reduce:animate-none">
          <div className="w-1.5 h-3 bg-text/50 rounded-full animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    </section>
  );
};

export default SystemHeroSection;
