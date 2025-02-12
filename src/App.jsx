import React from "react";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TaxCalculator from "./pages/TaxCalculator";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculator" element={<TaxCalculator />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
