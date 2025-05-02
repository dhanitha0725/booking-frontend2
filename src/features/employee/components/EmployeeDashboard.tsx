import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
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
import api from "../../../services/api";
import { Reservation } from "../../../types/ReservationDetails";
import ReservationTable from "./reservations/ReservationTable";

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

  const handleModifyReservation = (reservationId: number) => {
    setSnackbar({
      open: true,
      message: `Opening reservation #${reservationId} for modification`,
      severity: "info",
    });
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await api.put(`/Reservation/cancel/${reservationId}`);
      const updatedReservations = reservations.map((reservation) =>
        reservation.reservationId === reservationId
          ? { ...reservation, status: "Cancelled" }
          : reservation
      );
      //setReservations(updatedReservations);
      setStatistics((prevStats) => ({
        ...prevStats,
        pending: prevStats.pending - 1,
        cancelled: prevStats.cancelled + 1,
      }));
      setSnackbar({
        open: true,
        message: `Reservation #${reservationId} has been cancelled`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setSnackbar({
        open: true,
        message: "Failed to cancel reservation",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

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
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "warning.light",
                  color: "warning.contrastText",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Pending
                    </Typography>
                    <PendingActions fontSize="large" />
                  </Box>
                  <Typography variant="h3" component="div">
                    {statistics.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Reservations awaiting action
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "success.light",
                  color: "success.contrastText",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Confirmed
                    </Typography>
                    <CheckCircle fontSize="large" />
                  </Box>
                  <Typography variant="h3" component="div">
                    {statistics.confirmed}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Active confirmed reservations
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "error.light",
                  color: "error.contrastText",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Cancelled
                    </Typography>
                    <Cancel fontSize="large" />
                  </Box>
                  <Typography variant="h3" component="div">
                    {statistics.cancelled}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Cancelled or expired
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Revenue
                    </Typography>
                    <AttachMoney fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="div" noWrap>
                    {formatCurrency(statistics.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Total from active bookings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Recent Reservations
          </Typography>

          <Box sx={{ mt: 2 }}>
            {reservations.length > 0 ? (
              <Paper elevation={2} sx={{ p: 1 }}>
                <ReservationTable
                  reservations={reservations}
                  onModify={handleModifyReservation}
                  onCancel={handleCancelReservation}
                />
              </Paper>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "background.default",
                }}
              >
                <Typography>No reservations found</Typography>
              </Paper>
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
