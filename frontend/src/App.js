import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/App.css";
import SiteNav from "./components/layout/SiteNav";
import Footer from "./components/layout/Footer";
import PageTitle from "./components/layout/PageTitle";
import SystemPage from "./pages/SystemPage";
import DemoPage from "./pages/DemoPage";
import OnboardPage from "./pages/OnboardPage";

function App() {
  return (
    <div className="App font-sans bg-ink min-h-screen">
      <PageTitle />
      <SiteNav />
      <Routes>
        <Route path="/" element={<SystemPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/onboard" element={<OnboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
