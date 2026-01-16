import React from "react";
import "./App.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ServiceCards from "./components/ServiceCards";
import WhyChooseUs from "./components/WhyChooseUs";
import ServicesGrid from "./components/ServicesGrid";
import Testimonials from "./components/Testimonials";
import ConversionExplainer from "./components/ConversionExplainer";
import BeforeAfter from "./components/BeforeAfter";
import ServiceAreas from "./components/ServiceAreas";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import MobileCallButton from "./components/MobileCallButton";

function App() {
  return (
    <div className="App font-sans">
      <Header />
      <main>
        <HeroSection />
        <ServiceCards />
        <WhyChooseUs />
        <ServicesGrid />
        <Testimonials />
        <ConversionExplainer />
        <BeforeAfter />
        <ServiceAreas />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCallButton />
    </div>
  );
}

export default App;
