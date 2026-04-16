import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { motion, useReducedMotion } from 'framer-motion';

const faqs = [
  {
    question: 'Is this just voicemail with extra steps?',
    answer:
      "No, it's completely different. Voicemail waits for the customer to leave a message (most don't). CallGuard reaches out to them instantly, captures structured details, urgency, postcode, job type, and delivers it to your WhatsApp. You end up with a short, actionable brief, not a vague answerphone message."
  },
  {
    question: 'Do I need a new number?',
    answer:
      "No. CallGuard works with your existing number. Nothing changes for your customers, they still ring the same number they always have."
  },
  {
    question: 'Will my phone stop ringing?',
    answer:
      "No. Your phone still rings as normal. CallGuard only kicks in when you can't answer."
  },
  {
    question: 'Do I need an app?',
    answer:
      "No. Everything arrives in WhatsApp, which you already use. There's nothing to download, no dashboard to log into."
  },
  {
    question: "What if I'm already fully booked?",
    answer:
      "Even when you're fully booked, knowing who called and what they needed is valuable. You can refer them to a colleague, schedule them for next week, or prioritise a genuine emergency over a routine quote. Visibility is the point, not volume."
  },
  {
    question: 'What does it cost?',
    answer:
      "£59/month, everything included, no contract, cancel anytime. Full breakdown in the pricing section above."
  },
  {
    question: "Who sees my customers' details?",
    answer:
      "Only you. Your data stays private and is never shared with anyone. CallGuard exists to serve your business, not mine."
  },
  {
    question: "What if I don't like it?",
    answer:
      "Cancel anytime. No contract, no fees, no hassle. You'll know within 30 days whether it's earning its place."
  }
];

const CallGuardFAQSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-3">Questions tradespeople ask</h2>
          <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
            Straight answers to the common sticking points.
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

