import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  useTheme,
  Alert,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
//import { ReservationResultDto } from "../types/reservationData";

const steps = ["Booking Details", "User Information", "Confirmation"];

interface ConfirmationState {
  reservationId: number;
  status: string;
  paymentMethod?: "Online" | "Bank" | "Cash";
}

const ConfirmationPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const confirmationState = location.state as ConfirmationState | undefined;

  useEffect(() => {
    // If state is missing, redirect to home
    if (!confirmationState || !confirmationState.reservationId) {
      navigate("/", { replace: true });
    }
  }, [navigate, confirmationState]);

  if (!confirmationState || !confirmationState.reservationId) {
    // Don't show loading spinner, just return null (redirect will happen)
    return null;
  }

  const renderPaymentMethodMessage = () => {
    switch (confirmationState.paymentMethod) {
      case "Bank":
        return (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: theme.palette.info.light,
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccountBalanceIcon
                sx={{ mr: 1, color: theme.palette.info.dark }}
              />
              <Typography variant="h6">Bank Transfer Payment</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              We've received your bank transfer receipt. Our team will verify
              your payment within 24-48 hours.
            </Typography>
            <Typography variant="body1">
              Once verified, you'll receive a payment confirmation email and
              your reservation will be confirmed.
            </Typography>
          </Box>
        );

      case "Cash":
        return (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: theme.palette.warning.light,
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <MonetizationOnIcon
                sx={{ mr: 1, color: theme.palette.warning.dark }}
              />
              <Typography variant="h6">Cash Payment</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Your reservation has been temporarily reserved. Please complete
              your cash payment within 2 days to confirm your reservation.
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              Important: If payment is not received within 2 days, your
              reservation will be automatically cancelled.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={2} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: theme.palette.success.main,
            mb: 2,
          }}
        />

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Reservation Submitted Successfully!
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your reservation ID:{" "}
          <strong>{confirmationState.reservationId}</strong>
        </Typography>

        {renderPaymentMethodMessage()}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ maxWidth: 600, mx: "auto", my: 4, textAlign: "left" }}>
          <Typography variant="h6" gutterBottom>
            Next Steps:
          </Typography>

          {confirmationState.paymentMethod === "Bank" && (
            <ul>
              <li>Your bank transfer receipt is being reviewed</li>
              <li>Payment verification will be completed within 24 hours</li>
              <li>You'll receive an email confirmation once verified</li>
            </ul>
          )}

          {confirmationState.paymentMethod === "Cash" && (
            <ul>
              <li>Visit our office to make your cash payment</li>
              <li>Payment must be completed within 2 days</li>
            </ul>
          )}

          {confirmationState.status === "PendingApproval" && (
            <ul>
              <li>Your documents are being reviewed</li>
              <li>Document review typically takes 24 hours</li>
              <li>You'll receive a payment link after approval</li>
              <li>Final booking confirmation will be sent after payment</li>
            </ul>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{ mt: 3 }}
        >
          Return to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default ConfirmationPage;
