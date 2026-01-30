import React, { useEffect, useRef, useState } from 'react';
import { Phone, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { motion, useAnimation, useInView, useReducedMotion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

const ChatDemo = () => {
  const [tone, setTone] = useState('friendly');
  const [sequenceKey, setSequenceKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.65, once: true });

  const smsControls = useAnimation();
  const typingControls = useAnimation();
  const replyControls = useAnimation();
  const waControls = useAnimation();
  const badgeControls = useAnimation();
  const headerControls = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;

    let cancelled = false;

    const run = async () => {
      await Promise.all([
        smsControls.start({ opacity: 0, y: 8 }),
        replyControls.start({ opacity: 0, y: 8 }),
        waControls.start({ opacity: 0, y: 8 }),
        badgeControls.start({ scale: 1, boxShadow: '0 0 0 rgba(34,197,94,0)' }),
        typingControls.start({ opacity: 0 })
      ]);

      if (cancelled) return;

      // 1) Missed call appears
      await headerControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
      });

      if (cancelled) return;

      // 2) SMS bubble – slight typing delay then slide in from left
      await typingControls.start({
        opacity: 1,
        transition: { duration: 0.2 }
      });

      if (cancelled) return;

      await new Promise((resolve) => setTimeout(resolve, 300));

      await smsControls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.35, ease: 'easeOut' }
      });

      if (cancelled) return;

      await typingControls.start({
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeOut' }
      });

      if (cancelled) return;

      // 3) Customer reply – slide in from right
      await replyControls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
      });

      if (cancelled) return;

      // 4) WhatsApp alert – slide up + slight scale-in
      await waControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, ease: 'easeOut' }
      });

      if (cancelled) return;

      // 5) "Job held" indicator – soft one-off pulse
      await badgeControls.start({
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 0 rgba(34,197,94,0)',
          '0 0 18px rgba(34,197,94,0.35)',
          '0 0 0 rgba(34,197,94,0)'
        ],
        transition: { duration: 0.6, ease: 'easeOut' }
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [badgeControls, headerControls, inView, prefersReducedMotion, replyControls, smsControls, typingControls, waControls, sequenceKey]);

  const messages = {
    friendly: {
      auto: "Hey, sorry I missed your call, I'm on a job nearby. \n To make sure I get back to you as soon as possible, could you reply: \n \n 1 - Emergency\n2 - Needed today\n3 - Quote\n\nThen a short description + your postcode. \n \n  I’ll be in touch shortly.",
      customer: "1 Emergency – lights gone out at HP22 6HH",
      whatsapp: "CallGuard • 1 EMERGENCY\nLights out – HP22 6HH. Customer ready today."
    },

  };

  const currentMessages = messages[tone];

  const handleToneChange = (value) => {
    setTone(value);
    if (prefersReducedMotion) return;
    setSequenceKey((k) => k + 1);
  };

  return (
    <section id="demo" className="section-padding bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-4">
            See the 10-second CallGuard flow
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
            This is the exact experience your customers get when you miss a call.
          </p>
        </div>

        

        {/* Chat UI Card */}
        <motion.div
          ref={containerRef}
          key={sequenceKey}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="font-system glass-card rounded-2xl overflow-hidden card-hover"
        >
          {/* Phone Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Missed Call</h3>
              <p className="text-white/80 text-sm">+44 7901 837 771 • Just now</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-4 bg-transparent min-h-[300px]">
            {/* Missed Call Event */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={headerControls}
              className="flex items-center gap-2 text-sm text-muted mb-4"
            >
              <Clock className="w-4 h-4" />
              <span>Missed call at 1:23 PM</span>
            </motion.div>

            {/* Auto Message */}
            <motion.div
              animate={smsControls}
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: -12 }}
              className="flex justify-start"
            >
              <div className="bg-primary text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] shadow-sm whitespace-pre-line">
                <p className="text-sm leading-relaxed">{currentMessages.auto}</p>
              </div>
            </motion.div>

            {/* Typing Indicator */}
            <motion.div
              animate={typingControls}
              initial={{ opacity: 0 }}
              className="flex justify-end pr-2 text-muted text-[11px]"
            >
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface2/80 border border-border/60">
                <span className="w-1 h-1 rounded-full bg-muted animate-pulse" />
                <span className="w-1 h-1 rounded-full bg-muted animate-pulse [animation-delay:120ms]" />
                <span className="w-1 h-1 rounded-full bg-muted animate-pulse [animation-delay:240ms]" />
              </div>
            </motion.div>

            {/* Customer Reply */}
            <motion.div
              animate={replyControls}
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 12 }}
              className="flex justify-end"
            >
              <div className="bg-surface2 text-text rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm border border-border">
                <p className="text-sm leading-relaxed">{currentMessages.customer}</p>
              </div>
            </motion.div>

            {/* WhatsApp Alert */}
            <motion.div
              animate={waControls}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 flex gap-3 items-start"
            >
              <div className="mt-1">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-1 text-xs text-muted">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-emerald-100 font-medium text-sm">WhatsApp alert</span>
                  <motion.div
                    animate={badgeControls}
                    initial={{ scale: 1, boxShadow: '0 0 0 rgba(34,197,94,0)' }}
                  >
                    <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 px-2 py-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Job held
                    </Badge>
                  </motion.div>
                </div>
                <p className="text-emerald-50 text-sm whitespace-pre-line">
                  {currentMessages.whatsapp}
                </p>
                <p className="text-[11px]">
                  You see urgency, short description, and postcode in one place.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Note and CTA */}
        <div className="font-system text-center mt-6 space-y-4">
          <p className="text-sm text-muted italic">
            Demo interface. Messages are sent via SMS and land in WhatsApp.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors underline underline-offset-2"
          >
            Try with your number
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ChatDemo;
