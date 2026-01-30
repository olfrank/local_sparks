import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SiteNav from "./components/SiteNav";
import Footer from "./components/Footer";
import PageTitle from "./components/PageTitle";
import SystemPage from "./pages/SystemPage";
import DemoElectricianSitePage from "./pages/DemoElectricianSitePage";

function App() {
  return (
    <div className="App font-sans bg-ink min-h-screen">
      <PageTitle />
      <SiteNav />
      <SystemPage />
      <Footer />
    </div>
  );
}

export default App;
