import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModelDetails from "./pages/ModelDetails";
import "./App.css";
import ModelDashboard from "./pages/ModelDashboard";
import AgeVerificationModal from "./components/AgeVerificationModal";
import { UserProvider } from "./context/UserContext";
import AuthHandler from "./components/AuthHandler";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const selectedTheme = localStorage.getItem("selectedTheme");

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark");
  };

  if (selectedTheme === "dark") {
    setDarkMode();
  }

  return (
    <UserProvider>
      <Router>
        <AgeVerificationModal />
        <AuthHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model/:id" element={<ModelDetails />} />
          <Route path="/modeldashboard/:modelId" element={<ModelDashboard />} />
          <Route path="/modeldashboard" element={<ModelDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
