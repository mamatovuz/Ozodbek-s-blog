import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home.jsx";
import Blog from "./pages/blog/blog.jsx";
import Skills from "./pages/Skills/Skills.jsx";
import About from "./pages/About/About.jsx";
import Login from "./pages/Dashboard/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./pages/Dashboard/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Blog />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/dashboard/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Navigate to="/dashboard/login" replace />} />
      <Route path="/ozodbeks" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
