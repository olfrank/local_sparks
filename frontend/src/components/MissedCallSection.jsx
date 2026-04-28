import React from 'react';
import Timeline from './Timeline';
import { motion, useReducedMotion } from 'framer-motion';

const MissedCallSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const withoutSteps = [
    { icon: 'phone', text: 'Call comes in', detail: 'Customer needs emergency electrician' },
    { icon: 'x', text: 'No answer', detail: 'You\'re on another job' },
    { icon: 'arrow', text: 'Calls next electrician', detail: 'They move on immediately' },
    { icon: 'x', text: 'Job gone', detail: 'You never knew it existed' }
  ];

  const withSteps = [
    { icon: 'phone', text: 'Call comes in', detail: 'Customer needs emergency electrician' },
    { icon: 'x', text: 'No answer', detail: 'You\'re on another job' },
    { icon: 'message', text: 'Instant text sent', detail: 'System replies automatically' },
    { icon: 'message', text: 'Customer replies', detail: 'They provide details via SMS' },
    { icon: 'phone', text: 'You call back', detail: 'When you\'re free, you have the info' },
    { icon: 'check', text: 'Job saved', detail: 'Emergency handled, customer happy' }
  ];

  return (
    <section className="section-padding bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-h2 md:text-h2-lg font-bold text-text mb-4">
            What happens when you miss a call?
          </h2>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            Emergency jobs are decided in minutes. If a call goes unanswered, you usually never know what you lost.
          </p>
        </motion.div>

        {/* Two Column Comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Without System */}
          <motion.div
            className="glass-card rounded-2xl p-8 md:p-10 card-hover"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text mb-2">Without the system</h3>
              <p className="text-base text-muted">The silent leak</p>
            </div>
            <Timeline variant="without" steps={withoutSteps} />
          </motion.div>

          {/* With System */}
          <motion.div
            className="glass-card rounded-2xl p-8 md:p-10 border-2 border-primary/30 relative overflow-hidden card-hover"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-white text-base font-semibold px-3 py-1 rounded-full">
                WITH SYSTEM
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text mb-2">With the system</h3>
              <p className="text-base text-muted">Every call gets a second chance</p>
            </div>
            <Timeline variant="with" steps={withSteps} />
          </motion.div>
        </div>

        {/* Footnote */}
        <motion.p
          className="text-center text-base text-muted mt-8 italic"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
        >
          Illustrative example.
        </motion.p>
      </div>
    </section>
  );
};

export default MissedCallSection;
