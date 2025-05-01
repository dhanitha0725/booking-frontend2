import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

//pages
import AdminLayout from "../layouts/AdminLayout";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import UserManagement from "../features/admin/components/staff/UserManagement";
import FacilityManagement from "../features/admin/components/facilities/FacilityManagement";
import SignIn from "../pages/SignIn";
import FacilitiesPage from "../pages/FacilitiesPage";
import BookingPage from "../pages/BookingPage";
import UserInfoPage from "../pages/UserInfoPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentInfoPage from "../pages/PaymentInfoPage";
import PaymentConfirmationPage from "../pages/PaymentConfirmationPage";

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
        <Route
          path="/payment-confirmation"
          element={<PaymentConfirmationPage />}
        />
      </Route>

      {/* Protected Client Routes */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route element={<MainLayout />}>
          {/* Add client-specific protected routes here */}
          <Route path="/userinfo" element={<UserInfoPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/paymentInfo" element={<PaymentInfoPage />} />
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
          <Route index element={<Navigate to="staff" replace />} />{" "}
          <Route path="staff" element={<UserManagement />} />
          <Route
            path="facilities-management"
            element={<FacilityManagement />}
          />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
