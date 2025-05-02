import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  PendingActions,
  CheckCircle,
  Cancel,
  AttachMoney,
} from "@mui/icons-material";
import axios from "axios";
import api from "../../../../services/api";
import { Reservation } from "../../../../types/ReservationDetails";
import ReservationTable from "../reservations/ReservationTable";
import StatCard from "./StatCard";

const EmployeeDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statistics, setStatistics] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/Reservation/reservation-data");
        const data: Reservation[] = response.data;

        setReservations(data);

        const pendingCount = data.filter(
          (r) => r.status === "PendingApproval" || r.status === "PendingPayment"
        ).length;
        const confirmedCount = data.filter(
          (r) => r.status === "Approved" || r.status === "Confirmed"
        ).length;
        const cancelledCount = data.filter(
          (r) => r.status === "Cancelled" || r.status === "Expired"
        ).length;
        const totalRevenue = data
          .filter((r) => r.status !== "Cancelled" && r.status !== "Expired")
          .reduce((sum, reservation) => sum + reservation.total, 0);

        setStatistics({
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to load reservation data"
          : "Failed to load reservation data";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get the 5 most recent reservations for the table
  const recentReservations = reservations.slice(0, 5);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Employee Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending"
                value={statistics.pending}
                description="Reservations awaiting action"
                icon={<PendingActions />}
                iconColor="warning.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Confirmed"
                value={statistics.confirmed}
                description="Active confirmed reservations"
                icon={<CheckCircle />}
                iconColor="success.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Cancelled"
                value={statistics.cancelled}
                description="Cancelled or expired"
                icon={<Cancel />}
                iconColor="error.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={`Rs. ${statistics.totalRevenue.toFixed(2)}`}
                description="Total from active bookings"
                icon={<AttachMoney />}
                iconColor="primary.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Recent Reservations
          </Typography>

          <Box sx={{ mt: 2 }}>
            {reservations.length > 0 ? (
              <ReservationTable
                reservations={recentReservations}
                showActions={false}
                enablePagination={false}
                enableFilters={false}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  p: 4,
                  textAlign: "center",
                }}
              >
                No reservations found
              </Typography>
            )}
          </Box>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeDashboard;
