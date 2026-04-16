import React, { useRef, useState } from 'react';
import { MessageSquare, MessageCircle, Reply, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
// ─── Mini mockups ─────────────────────────────────────────────────────────────

function SmsMockup() {
  return (
    <div className="rounded-xl bg-ink/60 border border-border p-3 mt-3">
      <div className="max-w-[90%] bg-primary/90 text-white rounded-2xl rounded-tl-sm px-3 py-2">
        <p className="text-[11px] leading-relaxed">
          Hi, it&apos;s John from Local Electrics 👋 
          <br />
          Sorry I missed you, I&apos;m on a job. 
          <br />
          Text me what you need, your postcode, and if it&apos;s urgent, today, or a quote.
          <br />
          I'll get back to you as soon as I'm free! 🔨
        </p>
      </div>
    </div>
  );
}

function ReplyMockup() {
  return (
    <div className="rounded-xl bg-ink/60 border border-border p-3 mt-3">
      <div className="flex justify-end">
        <div className="max-w-[90%] bg-surface2 text-text rounded-2xl rounded-tr-sm px-3 py-2 border border-border">
          <p className="text-[11px] leading-relaxed">
            Burning smell from socket in kitchen, HP24 9HH, urgent
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatsAppMockup() {
  return (
    <div className="rounded-xl border border-emerald-400/40 bg-[#46f5754d] p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-emerald-100 text-[11px] font-medium">WhatsApp alert</span>
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Job held
        </span>
      </div>
      <div className="space-y-0.5 text-[11px] text-emerald-50 leading-relaxed">
        <p className="font-medium">MISSED CALL ENQUIRY — URGENT</p>
        <p>📞 +44 7901 234 567</p>
        <p>📍 HP24 9HH</p>
        <p>💬 Burning smell from socket in kitchen. Customer is requesting a visit now.</p>
      </div>
    </div>
  );
}

// ─── Step card ─────────────────────────────────────────────────────────────────

function StepCard({ stepNum, icon: Icon, iconColor, headline, subtext, badge, mockup, emphasis, inView, delay, prefersReducedMotion }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={`relative rounded-2xl border p-5 flex flex-col overflow-hidden h-full ${
        emphasis
          ? 'border-emerald-400/50 bg-surface2/40 shadow-[0_0_32px_-6px_rgba(52,211,153,0.22)]'
          : 'border-border bg-surface2/25'
      }`}
    >
      {/* Large background step number */}
      <span className="pointer-events-none absolute top-2 right-4 text-7xl font-black text-white/[0.04] leading-none select-none">
        {stepNum}
      </span>

      {/* Step label + icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          emphasis ? 'bg-emerald-400/20' : 'bg-primary/15'
        }`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className={`cg-label text-xs font-semibold tracking-wider uppercase ${
          emphasis ? 'text-emerald-400/80' : 'text-primary/70'
        }`}>
          Step {stepNum}
        </span>
      </div>

      {/* Text */}
      <h3 className="cg-label text-text font-semibold text-sm md:text-base leading-snug mb-1">
        {headline}
      </h3>
      <p className="cg-body text-muted text-xs md:text-sm leading-relaxed">
        {subtext}
      </p>

      {/* Mini mockup */}
      {mockup}
    </motion.div>
  );
}

// ─── Arrow separator (desktop only) ───────────────────────────────────────────

function ArrowSep({ inView, delay, prefersReducedMotion }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={inView && !prefersReducedMotion ? { opacity: 1 } : undefined}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className="hidden md:flex items-center justify-center"
    >
      <ArrowRight className="w-5 h-5 text-muted/25" />
    </motion.div>
  );
}

// ─── ChatDemo ─────────────────────────────────────────────────────────────────

const ChatDemo = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [ctaHoverCount, setCtaHoverCount] = useState(0);
  const navigate = useNavigate();

  return (
    <section id="demo" className="section-padding relative overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="cg-h2 text-h1 md:text-h1-lg text-text mb-4">
            What happens when you miss a call?
          </h2>
          <p className="cg-body text-lg text-muted max-w-2xl mx-auto">
            In under 5 seconds, the customer is acknowledged and you get the full picture in WhatsApp.
          </p>
        </div>

        <div
          ref={sectionRef}
          className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_44px_1fr_44px_1fr] md:gap-0 md:items-center"
        >
          <StepCard
            stepNum={1}
            icon={MessageSquare}
            iconColor="text-primary"
            headline="Customer gets an instant reply"
            subtext="An SMS goes out in less than 5 seconds acknowledging the call and asking what they need."
            badge="~5 seconds"
            mockup={<SmsMockup />}
            inView={inView}
            delay={0.1}
            prefersReducedMotion={!!prefersReducedMotion}
          />

          <ArrowSep inView={inView} delay={0.25} prefersReducedMotion={!!prefersReducedMotion} />

          <StepCard
            stepNum={2}
            icon={Reply}
            iconColor="text-primary"
            headline="They text back the details"
            subtext="Job description, postcode, and urgency, captured in one reply."
            mockup={<ReplyMockup />}
            inView={inView}
            delay={0.3}
            prefersReducedMotion={!!prefersReducedMotion}
          />

          <ArrowSep inView={inView} delay={0.45} prefersReducedMotion={!!prefersReducedMotion} />

          <StepCard
            stepNum={3}
            icon={MessageCircle}
            iconColor="text-emerald-400"
            headline="You get a structured alert"
            subtext="Urgency, postcode, job details, delivered where you already work."
            mockup={<WhatsAppMockup />}
            emphasis
            inView={inView}
            delay={0.5}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        </div>

        {/* Outcome line */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 0.7, ease: 'easeOut' }}
          className="cg-body text-center text-muted text-sm md:text-base mt-10 max-w-2xl mx-auto leading-relaxed"
        >
          Call them back when you&apos;re free. You already know the issue, the location, and how urgent it is. Job saved.
        </motion.p>

        {/* Closing brand line */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={inView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 0.85, ease: 'easeOut' }}
          className="cg-label text-center text-text font-semibold text-base md:text-lg mt-5"
        >
          No apps. No dashboards. Everything lands where you already work.
        </motion.p>

        <div className='w-full flex mt-4'>

        
        <div
          className="relative w-full mx-auto overflow-hidden rounded-xl w-full sm:w-auto"
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
        </div>

      </div>
    </section>
  );
};

export default ChatDemo;
