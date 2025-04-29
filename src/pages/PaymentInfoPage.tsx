import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import PaymentCheckout from "../features/client/payment/components/PaymentCheckout";

const steps = [
  "Booking Details",
  "User Information",
  "Payment",
  "Confirmation",
];

const PaymentInfoPage: React.FC = () => {
  const [activeStep] = useState(2); // Payment is step 3
  const [pendingReservation, setPendingReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve reservation data from localStorage
    const reservationData = localStorage.getItem("pendingReservation");

    if (!reservationData) {
      setError(
        "No reservation data found. Please start the booking process again."
      );
      setLoading(false);
      return;
    }

    try {
      // Parse the reservation data
      const parsedData = JSON.parse(reservationData);
      setPendingReservation(parsedData);
    } catch (err) {
      setError("Invalid reservation data. Please try again.");
      console.error("Error parsing reservation data:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading payment information...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box textAlign="center">
          <Typography variant="body1" gutterBottom>
            Please return to the home page and try again.
          </Typography>
          <button onClick={() => navigate("/")}>Return to Home</button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Payment Details
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6" gutterBottom>
          Complete Your Payment
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Please review your reservation details and complete the payment to
          confirm your booking.
        </Typography>

        {pendingReservation && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Reservation Summary
            </Typography>
            <Typography>
              Start Date:{" "}
              {new Date(pendingReservation.StartDate).toLocaleString()}
            </Typography>
            <Typography>
              End Date: {new Date(pendingReservation.EndDate).toLocaleString()}
            </Typography>
            <Typography fontWeight="bold">
              Total Amount: Rs. {pendingReservation.Total.toFixed(2)}
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Payment Information
        </Typography>

        <PaymentCheckout
          initialData={pendingReservation} // Pass the reservation data
        />
      </Paper>
    </Container>
  );
};

export default PaymentInfoPage;
