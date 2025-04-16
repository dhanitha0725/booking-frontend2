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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ReservationResultDto } from "../types/reservationData";

const steps = ["Booking Details", "User Information", "Confirmation"];

const ConfirmationPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const reservationState = location.state as ReservationResultDto | undefined;

  useEffect(() => {
    // If reservationState is missing, redirect to home (not confirmation)
    if (!reservationState || !reservationState.reservationId) {
      navigate("/", { replace: true });
    }
  }, [navigate, reservationState]);

  if (!reservationState || !reservationState.reservationId) {
    // Don't show loading spinner, just return null (redirect will happen)
    return null;
  }

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
          Your reservation ID: <strong>{reservationState.reservationId}</strong>
        </Typography>

        <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
          <Typography variant="body1" paragraph>
            We've received your reservation request and will review your
            documents shortly. Once approved, we'll send the payment link to
            your email address.
          </Typography>

          <Typography variant="body1" paragraph>
            You can expect to receive:
          </Typography>

          <ul style={{ textAlign: "left", paddingLeft: "1.5rem" }}>
            <li>Immediate confirmation of your reservation submission</li>
            <li>Document review status update within 24 hours</li>
            <li>Payment link email after document approval</li>
            <li>Final booking confirmation after payment completion</li>
          </ul>
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
