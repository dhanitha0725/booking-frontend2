import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// layouts
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AccountLayout from "../layouts/AccountLayout";

//pages
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import FacilitiesPage from "../pages/FacilitiesPage";
import BookingPage from "../pages/BookingPage";
import UserInfoPage from "../pages/UserInfoPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentInfoPage from "../pages/PaymentInfoPage";
import PaymentConfirmationPage from "../pages/PaymentConfirmationPage";

//components
import UserManagement from "../features/admin/staff/UserManagement";
import FacilityManagement from "../features/admin/facilities/FacilityManagement";
import CustomerManagement from "../features/admin/customers/CustomerManagement";
import EmployeeDashboard from "../features/employee/dashboard/EmployeeDashboard";
import ReservationManagement from "../features/employee/reservations/ReservationManagement";
import AccountDashboard from "../features/accountant/dashboard/AccountDashboard";
import PaymentManagement from "../features/accountant/payments/PaymentManagement";
import ReportManagement from "../features/accountant/reports/ReportManagement";
import PriceManagement from "../features/accountant/pricing/PriceManagement";
import InvoiceManagement from "../features/accountant/inovices/InvoiceManagement";

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
      {/* only admin can access these routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="staff" replace />} />{" "}
          <Route path="staff" element={<UserManagement />} />
          <Route
            path="facilities-management"
            element={<FacilityManagement />}
          />
          <Route path="customers-management" element={<CustomerManagement />} />
        </Route>
      </Route>

      {/* protected employee routes */}
      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route
            path="reservation-management"
            element={<ReservationManagement />}
          />
        </Route>
      </Route>

      {/* protected accountant routes */}
      <Route element={<ProtectedRoute allowedRoles={["accountant"]} />}>
        <Route path="/accountant" element={<AccountLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AccountDashboard />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="invoice" element={<InvoiceManagement />} />
          <Route path="pricing" element={<PriceManagement />} />
          <Route path="reports" element={<ReportManagement />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
