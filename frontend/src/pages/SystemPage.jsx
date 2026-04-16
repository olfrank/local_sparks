import React from 'react';
import SystemHeroSection from '../components/SystemHeroSection';
import BusyMomentSection from '../components/BusyMomentSection';
import RevenueLeakCalculator from '../components/RevenueLeakCalculator';
import SystemFlowSection from '../components/SystemFlowSection';
import FinalCTASection from '../components/FinalCTASection';
import CallGuardTrialSection from '../components/revprotect/RevProtectGuaranteeSection';
import PricingSection from '../components/PricingSection';
import CallGuardFAQSection from '../components/revprotect/RevProtectFAQSection';
import ClosingCTASection from '../components/ClosingCTASection';

const BG_GRADIENT = [
  'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0, 47, 255, 0.02) 100%)',
  'radial-gradient(ellipse 80% 35% at 50% 3%, rgba(37, 100, 235, 0.11), transparent)',
  'radial-gradient(ellipse 65% 25% at 25% 30%, rgba(37, 100, 235, 0.07), transparent)',
  'radial-gradient(ellipse 55% 20% at 75% 45%, rgba(37, 100, 235, 0.12), transparent)',
  'radial-gradient(ellipse 50% 18% at 35% 85%, rgba(37, 99, 235, 0.04), transparent)',
  'radial-gradient(ellipse 50% 30% at 70% 8%, rgba(99, 37, 235, 0.04), transparent)',
  'radial-gradient(ellipse 60% 22% at 20% 55%, rgba(116, 37, 235, 0.09), transparent)',
  'radial-gradient(ellipse 45% 15% at 60% 90%, rgba(100, 37, 235, 0.1), transparent)',
].join(', ');

const SystemPage = () => {
  return (
    <>
      <main style={{ backgroundColor: '#080c14', backgroundImage: BG_GRADIENT }}>
        <SystemHeroSection />
        <BusyMomentSection />
      
        <SystemFlowSection />

         <RevenueLeakCalculator />
        <CallGuardTrialSection />
        <PricingSection />
        <CallGuardFAQSection />
        <ClosingCTASection />
        <FinalCTASection />
      </main>
    </>
  );
};

export default SystemPage;
