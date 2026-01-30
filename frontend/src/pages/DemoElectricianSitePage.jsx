import React from 'react';
import DemoHeroSection from '../components/DemoHeroSection';
import ServiceCards from '../components/ServiceCards';
import WhyChooseUs from '../components/WhyChooseUs';
import ServicesGrid from '../components/ServicesGrid';
import Testimonials from '../components/Testimonials';
import ServiceAreas from '../components/ServiceAreas';
import DemoContactSection from '../components/DemoContactSection';
import MobileCallButton from '../components/MobileCallButton';

const DemoElectricianSitePage = () => {
  return (
    <>
      <main>
        <DemoHeroSection />
        <ServiceCards />
        <WhyChooseUs />
        <ServicesGrid />
        <Testimonials />
        <ServiceAreas />
        <DemoContactSection />
      </main>
      <MobileCallButton />
    </>
  );
};

export default DemoElectricianSitePage;
