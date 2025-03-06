import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import UserManagement from "../features/admin/components/UserManagement";
import FacilityManagement from "../features/admin/components/FacilityManagement";
import { useAuth } from "../context/AuthContext";
import SignIn from "../pages/SignIn";

const Router: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* root routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            {" "}
            <Home />{" "}
          </MainLayout>
        }
      />
      <Route
        path="/home"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route path="/login" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>

      {/* protected routes */}

      {/* admin routes */}
      {/* only authenticated users can access these routes */}
      <Route
        path="/admin/*"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminLayout />
          ) : (
            <Navigate to="/login" state={{ from: "/admin" }} replace />
          )
        }
      >
        {/* redirect to /admin to /admin/facilities */}
        <Route index element={<Navigate to="/admin/facilities" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="facilities" element={<FacilityManagement />} />
      </Route>

      {/* catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
