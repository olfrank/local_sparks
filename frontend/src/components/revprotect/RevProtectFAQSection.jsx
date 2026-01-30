import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { motion, useReducedMotion } from 'framer-motion';

const faqs = [
  {
    question: 'Is this just voicemail with extra steps?',
    answer:
      "Voicemail tells you someone rang. CallGuard captures urgency + a short description so you know who to call back first."
  },
  {
    question: 'Do I need a new number?',
    answer: 'No — it works on your existing number.'
  },
  {
    question: 'Will my phone stop ringing?',
    answer: 'No. If you answer, nothing changes.'
  },
  {
    question: 'Do I need an app?',
    answer: 'No — everything goes to WhatsApp.'
  },
  {
    question: "What if it doesn't work?",
    answer:
      "If the system fails to capture a genuine enquiry, you don't pay for that month."
  },
  {
    question: "What if I'm already fully booked?",
    answer:
      "You still see the urgency and details so you can decide whether to take it, schedule it, or ignore it — the point is visibility and control."
  }
];

const CallGuardFAQSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="faq" className="section-padding bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(37,99,235,0.38),rgba(16,18,26,0.73)_50%)]" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-3">Questions tradespeople ask</h2>
          <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
            Straight answers to the common sticking points before you book a quick fit check.
          </p>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="glass-card rounded-2xl p-4 md:p-6 border border-border/70 bg-surface/60 backdrop-blur-xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left text-sm md:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-[15px] text-muted leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default CallGuardFAQSection;

