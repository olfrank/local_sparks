import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SiteNav from "./components/SiteNav";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";
import SystemPage from "./pages/SystemPage";
import DemoPage from "./pages/DemoPage";

function App() {
  return (
    <div className="App font-sans bg-ink min-h-screen">
      <PageTitle />
      <SiteNav />
      <Routes>
        <Route path="/" element={<SystemPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
