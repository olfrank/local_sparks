import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from './ui/button';

const ClosingCTASection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleSecondary = () => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding relative overflow-hidden">

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="cg-h1 text-h1 md:text-h1-lg text-text mb-8 leading-tight">
            Miss the call.<br />Win the job anyway.
          </h2>

          <Button
            onClick={() => navigate('/onboard')}
            size="lg"
            className="cg-label bg-primary hover:bg-primary/90 text-white text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
          >
            Start my 30 free day trial
          </Button>

          <p className="cg-body text-sm text-muted mt-4">
            Takes 2 minutes to set up. No cards or payment details. 
            <br />
            Cancel anytime.
          </p>

          {/* <button
            type="button"
            onClick={handleSecondary}
            className="cg-label inline-flex items-center gap-1.5 text-sm text-muted hover:text-text transition-colors mt-3"
          >
            <span>Or book a 5 min call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default ClosingCTASection;
