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

const SystemPage = () => {
  return (
    <>
      <main>
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
