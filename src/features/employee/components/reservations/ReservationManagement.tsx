import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import api from "../../../../services/api";
import ReservationTable from "../reservations/ReservationTable";
import { Reservation } from "../../../../types/ReservationDetails";

const ReservationManagement: React.FC = () => {
  // State for storing reservation data retrieved from the API
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch reservations data for the table
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "http://localhost:5162/api/Reservation/reservation-data"
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);

        // Extract error message from the backend response
        let errorMessage = "Failed to load reservations";
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ error: string }>;
          if (axiosError.response?.data?.error) {
            errorMessage = axiosError.response.data.error;
          }
        }

        // Show error notification
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

  // Handle reservation modification
  const handleModifyReservation = async (reservationId: number) => {
    try {
      // In a real app, this might open a dialog or navigate to a detail page
      // For now, we'll just show a notification
      setSnackbar({
        open: true,
        message: `Modification for reservation #${reservationId} initiated`,
        severity: "info",
      });
    } catch (error) {
      console.error("Error initiating modification:", error);
      setSnackbar({
        open: true,
        message: "Failed to initiate modification",
        severity: "error",
      });
    }
  };

  // Handle reservation cancellation
  const handleCancelReservation = async (reservationId: number) => {
    try {
      // Call the API to cancel the reservation
      await api.put(
        `http://localhost:5162/api/Reservation/cancel/${reservationId}`
      );

      // Update the local state to reflect the cancellation
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.reservationId === reservationId
            ? { ...reservation, status: "Cancelled" }
            : reservation
        )
      );

      // Show success message
      setSnackbar({
        open: true,
        message: `Reservation #${reservationId} has been cancelled`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error cancelling reservation:", error);

      // Extract error message from the backend response
      let errorMessage = "Failed to cancel reservation";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }

      // Show error notification
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  // Close the snackbar notification
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header section with title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Reservation Management</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Display loading state or reservation data */}
      {loading ? (
        <Paper
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography variant="body1">Loading reservations...</Typography>
        </Paper>
      ) : reservations.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography variant="body1">No reservations found</Typography>
        </Paper>
      ) : (
        <ReservationTable
          reservations={reservations}
          onModify={handleModifyReservation}
          onCancel={handleCancelReservation}
        />
      )}

      {/* Feedback notification */}
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

export default ReservationManagement;
