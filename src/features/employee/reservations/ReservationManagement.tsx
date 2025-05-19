import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import api from "../../../services/api";
import ReservationTable from "./ReservationTable";
import { Reservation } from "../../../types/ReservationDetails";
import AddReservationDialog from "./AddReservationDialog";
import CancelReservationDialog from "./CancelReservationDialog";

const ReservationManagement: React.FC = () => {
  // State for storing reservation data retrieved from the API
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(
    null
  );
  const [cancelLoading, setCancelLoading] = useState(false);
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
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Reservation/reservation-data");
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

  useEffect(() => {
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

  // Show confirmation dialog before cancellation
  const handleCancelReservation = async (reservationId: number) => {
    // Store the reservation ID to cancel and show confirmation dialog
    setReservationToCancel(reservationId);
    setCancelDialogOpen(true);
  };

  // Close confirmation dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setReservationToCancel(null);
  };

  // Process the actual cancellation after confirmation
  const confirmCancelReservation = async () => {
    if (reservationToCancel === null) return;

    setCancelLoading(true);
    try {
      // Call the API to cancel the reservation with the updated endpoint and payload format
      await api.post(`/Reservation/cancel-reservation`, {
        reservationId: reservationToCancel,
      });

      // Update the local state to reflect the cancellation
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.reservationId === reservationToCancel
            ? { ...reservation, status: "Cancelled" }
            : reservation
        )
      );

      // Show success message
      setSnackbar({
        open: true,
        message: `Reservation #${reservationToCancel} has been cancelled`,
        severity: "success",
      });

      // Close the dialog
      setCancelDialogOpen(false);
      setReservationToCancel(null);
    } catch (error) {
      console.error("Error cancelling reservation:", error);

      // Extract error message from the backend response
      let errorMessage = "Failed to cancel reservation";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message?: string;
          error?: string;
        }>;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Failed to cancel reservation";
      }

      // Show error notification
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle reservation creation
  const handleReservationCreated = (reservationId: number) => {
    setSnackbar({
      open: true,
      message: `Reservation #${reservationId} has been created successfully`,
      severity: "success",
    });
    fetchReservations(); // Refresh the list
  };

  // Close the snackbar notification
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Reservation Management</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Reservation
        </Button>
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
          <CircularProgress />
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

      {/* Add Reservation Dialog */}
      <AddReservationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onReservationCreated={handleReservationCreated}
      />

      {/* Cancel Reservation Confirmation Dialog */}
      <CancelReservationDialog
        open={cancelDialogOpen}
        loading={cancelLoading}
        reservationId={reservationToCancel}
        onClose={handleCloseCancelDialog}
        onConfirm={confirmCancelReservation}
      />

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
