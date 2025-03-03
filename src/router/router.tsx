import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import UserManagement from "../features/admin/components/UserManagement";
import FacilityManagement from "../features/admin/components/FacilityManagement";
import { useAuth } from "../context/AuthContext";

const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <Login />
      } />
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />
      } />
      
      {/* Protected routes */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
      } />
      <Route path="/home" element={
        isAuthenticated ? <Home /> : <Navigate to="/login" replace />
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Redirect /admin to /admin/facilities */}
        <Route index element={<Navigate to="/admin/facilities" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="facilities" element={<FacilityManagement />} />
        {/* Add settings route as a placeholder */}
        <Route path="settings" element={<div>Settings Page</div>} />
      </Route>
    </Routes>
  );
};

export default Router;
