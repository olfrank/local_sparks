import React from 'react';
import SystemHeroSection from '../components/SystemHeroSection';
import BusyMomentSection from '../components/BusyMomentSection';
import RevenueLeakCalculator from '../components/RevenueLeakCalculator';
import SystemFlowSection from '../components/SystemFlowSection';
import ChatDemo from '../components/ChatDemo';
import FinalCTASection from '../components/FinalCTASection';
import CallGuardTrialSection from '../components/revprotect/RevProtectGuaranteeSection';
import CallGuardROISection from '../components/revprotect/RevProtectROISection';
import CallGuardFAQSection from '../components/revprotect/RevProtectFAQSection';

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
        {/* 4. Demo (60-second visual) */}
        <section className="bg-ink">
          <ChatDemo />
        </section>
        {/* 5. 30-day trial / revenue audit */}
        <CallGuardTrialSection />
        {/* 6. ROI */}
        <CallGuardROISection />
        {/* 7. FAQ */}
        <CallGuardFAQSection />
        {/* 8. Final CTA */}
        <FinalCTASection />
      </main>
    </>
  );
};

export default SystemPage;
