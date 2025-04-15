import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

//pages
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import UserManagement from "../features/admin/components/UserManagement";
import FacilityManagement from "../features/admin/components/FacilityManagement";
import SignIn from "../pages/SignIn";
import FacilitiesPage from "../pages/FacilitiesPage";
import BookingPage from "../pages/BookingPage";
import UserInfoPage from "../pages/UserInfoPage";

const Router: React.FC = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/facilities/:facilityId" element={<FacilitiesPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/userinfo" element={<UserInfoPage />} />
      </Route>

      {/* Protected Client Routes */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route element={<MainLayout />}>
          {/* Add client-specific protected routes here */}
        </Route>
      </Route>

      {/* protected admin routes */}
      {/* only authenticated users can access these routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "employee", "accountant"]} />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="facilities" element={<FacilityManagement />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
