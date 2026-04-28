import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Phone, ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion, useInView, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { heroImages } from '../data/mock';

const SystemHeroSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const handleCTAClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Shared ease for left-column entrance
  const heroEase = [0.22, 1, 0.36, 1];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url(${heroImages.main})`,
          animation: prefersReducedMotion ? 'none' : 'slowZoom 20s ease-in-out infinite alternate'
        }}
      />

          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/85 to-ink/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(11,18,32,0.7)_100%)]" />

      {/* Aurora sweep — soft blue/violet colour band across the top third */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: '65%',
          background: 'radial-gradient(ellipse 110% 70% at 50% -10%, rgba(37,99,235,0.13) 0%, rgba(80,40,220,0.05) 55%, transparent 75%)',
        }}
      />

      {/* Right-side ambient bloom — large soft glow behind the phone mockup */}
      <div
        className="pointer-events-none absolute"
        style={{
          right: '-5%',
          top: '5%',
          width: '60%',
          height: '90%',
          background: 'radial-gradient(ellipse 75% 60% at 65% 45%, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.05) 55%, transparent 80%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div className="relative text-left max-w-xl mx-auto lg:mx-0">
            {/* Local blur mask */}
            <div
              className="pointer-events-none absolute -inset-8 lg:inset-y-0 lg:-left-12 lg:right-1/2 rounded-2xl bg-ink/40 backdrop-blur-md lg:backdrop-blur-lg"
              style={{
                maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 100%)'
              }}
            />
            {/* Spotlight behind heading */}
            <div className="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.2),_transparent_60%)] blur-2xl opacity-80" />

            <div className="relative flex flex-col gap-6">
              {/* Headline */}
              <motion.h1
                className="cg-h1 text-h1 md:text-h1-lg text-text"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: heroEase }}
              >
                Miss the call.<br />Win the job anyway.
              </motion.h1>

              {/* Single-line subtext */}
              <motion.p
                className="cg-body text-base md:text-lg text-text/70 leading-relaxed"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3, ease: heroEase }}
              >
                Automatic reply. Job details. Straight to your WhatsApp.
              </motion.p>

              {/* Cost anchor, muted, small */}
              <motion.p
                className="cg-body text-md text-muted/70"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42, ease: heroEase }}
              >
                The average emergency call-out is worth £250–£500.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col items-start gap-3 mt-2"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.54, ease: heroEase }}
              >
                {/* Primary */}
                <div
                  className="relative overflow-hidden rounded-xl w-full sm:w-auto"
                  onMouseEnter={() => !prefersReducedMotion && setCtaHoverCount((c) => c + 1)}
                >
                  <Button
                    onClick={() => navigate('/demo')}
                    size="lg"
                    className="cg-label relative z-10 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] rounded-xl group"
                  >
                    <span className="relative z-10">Try 30 second demo</span>
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

                {/* Secondary text link */}
                {/* <span
                  className="cg-label inline-flex items-center gap-1.5 text-base text-muted hover:text-text transition-colors"
                >
                  <span>Enter your number, reply to SMS, see your alert</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span> */}
              </motion.div>
            </div>
          </div>

          {/* Right column — mockup */}
          <div className="relative max-w-lg mx-auto w-full" ref={previewRef}>
            <div className="pointer-events-none absolute -inset-x-10 -top-10 h-48 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_70%)] blur-3xl opacity-80" />
            <div className="pointer-events-none absolute -inset-x-10 -bottom-6 h-40 bg-[radial-gradient(circle_at_bottom,_rgba(37,99,235,0.20),_transparent_70%)] blur-3xl opacity-60" />

            <motion.div
              style={
                !prefersReducedMotion && isDesktop
                  ? { x, y, rotateX, rotateY, transformPerspective: 800 }
                  : undefined
              }
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              className="font-system relative rounded-[32px] border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden px-4 pt-6 pb-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_80px_-10px_rgba(37,99,235,0.28)]"
            >
              {/* Breathing highlight sweep */}
              <div
                className="hero-breathing-sweep pointer-events-none absolute inset-0 z-[1] rounded-[32px]"
                style={{
                  background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 55%, transparent 100%)',
                  backgroundSize: '60% 100%',
                  animation: prefersReducedMotion ? 'none' : 'heroBreathingSweep 10s ease-in-out infinite'
                }}
              />
              <div className="relative z-10">
                {/* Phone top bar */}
                <div className="flex justify-center mb-4">
                  <div className="h-1.5 w-16 rounded-full bg-white/20" />
                </div>

                <div className="space-y-3 text-base">
                  <div className='w-full flex justify-start'>
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="flex items-center gap-2 text-base text-muted w-fit bg-transparent rounded-xl px-2 py-1"
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          gap: '0.5rem',
                          animation: prefersReducedMotion ? 'none' : 'phoneRing 4s ease-in-out 0.8s infinite',
                        }}
                      >
                        <Phone className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Missed call from 07901 837 771</span>
                      </span>

                    </motion.div>
                  </div>

                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex justify-start"
                  >
                    <div className="bg-primary/90 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-lg shadow-primary/30">
                      <p className="leading-relaxed">
                        Hi, it's John from Local Electrics 👋
                        <br /><br />
                        Sorry I missed you, I&apos;m on a job right now.
                        <br /><br />
                        Text me what you need, postcode, and if it's urgent, today, or a quote.
                        <br /><br />
                        For example: "today, consumer unit issue, SW12 1AB"
                        <br /><br />
                        I'll get back to you as soon as I'm free! 🔨
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
                        Hey John, there's a burning smell from socket in kitchen, i'm a bit worried, you free now? hp249hh
                      </p>
                    </div>
                  </motion.div>

                  {/* WhatsApp alert — visual climax, subtle glow + scale */}
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={previewInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="mt-4 rounded-2xl border border-emerald-400/60 bg-[#46f5754d] px-4 py-3 flex gap-3 items-start scale-[1.02] shadow-[0_0_28px_-4px_rgba(52,211,153,0.30)]"
                  >
                    <div className="mt-1">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="space-y-1 text-base text-muted">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-emerald-100 font-medium text-base">WhatsApp alert</span>
                        <span className="inline-flex text-center px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5" />
                          Job held
                        </span>
                      </div>
                      <p className="text-emerald-50 text-base">
                        MISSED CALL ENQUIRY - URGENT
                      </p>
                      <p className="text-emerald-50 text-base">
                        📞+447901234567
                      </p>
                      <p className="text-emerald-50 text-base">
                        📍HP24 9HH
                      </p>
                      <p className="text-emerald-50 text-base">
                        💬 Burning smell from kitchen socket. Customer requested a visit immediately
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
      >
        <div className="w-6 h-10 border-2 border-text/30 rounded-full flex justify-center pt-2 animate-bounce motion-reduce:animate-none">
          <div className="w-1.5 h-3 bg-text/50 rounded-full animate-pulse motion-reduce:animate-none" />
        </div>
      </motion.div>
    </section>
  );
};

export default SystemHeroSection;
