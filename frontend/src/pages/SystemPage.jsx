import React from 'react';
import SystemHeroSection from '../components/SystemHeroSection';
import BusyMomentSection from '../components/BusyMomentSection';
import RevenueLeakCalculator from '../components/RevenueLeakCalculator';
import SystemFlowSection from '../components/SystemFlowSection';
import FinalCTASection from '../components/FinalCTASection';
import CallGuardTrialSection from '../components/revprotect/RevProtectGuaranteeSection';
import CallGuardFAQSection from '../components/revprotect/RevProtectFAQSection';
import ClosingCTASection from '../components/ClosingCTASection';

const SystemPage = () => {
  return (
    <>
      <main>
        <SystemHeroSection />
        {/* 2. Silent leak / problem */}
        <BusyMomentSection />
        {/* 2.5 Missed revenue calculator */}
        <RevenueLeakCalculator />
        {/* 3. How it works */}
        <SystemFlowSection />
        {/* 5. 30 day trial */}
        <CallGuardTrialSection />
        {/* 7. FAQ */}
        <CallGuardFAQSection />
        {/* 8. Closing CTA */}
        <ClosingCTASection />
        {/* 9. Contact form */}
        <FinalCTASection />
      </main>
    </>
  );
};

export default SystemPage;
