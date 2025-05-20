import React from "react";
import { Box, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Reservation } from "../../../../types/updateReservation";

// Define props interface for the component
interface ReservationSummaryProps {
  reservation: Reservation;
}

// Define type for status colors
type StatusColorType = "warning" | "info" | "success" | "error" | "default";

const ReservationSummary: React.FC<ReservationSummaryProps> = ({
  reservation,
}) => {
  if (!reservation) return null;

  // Format date for display
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "N/A";
    return dayjs(date).format("MMM DD, YYYY");
  };

  // Get status color
  const getStatusColor = (status: string): StatusColorType => {
    switch (status) {
      case "PendingApproval":
      case "PendingPaymentVerification":
        return "warning";
      case "PendingPayment":
        return "info";
      case "Completed":
      case "Approved":
      case "Confirmed":
        return "success";
      case "Cancelled":
      case "Expired":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Reservation Summary
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Date Range:
          </Typography>
          <Typography variant="body1">
            {formatDate(reservation.startDate)} -{" "}
            {formatDate(reservation.endDate)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Status:
          </Typography>
          <Chip
            label={reservation.status}
            size="small"
            color={getStatusColor(reservation.status)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ mt: 1.5, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1" fontWeight="bold">
          Total Amount:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Rs. {reservation.total.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ReservationSummary;
