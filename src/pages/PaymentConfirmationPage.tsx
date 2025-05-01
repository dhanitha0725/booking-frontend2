import { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axios from "axios";

// Define all possible steps in the booking process
const steps = [
  "Booking Details",
  "User Information",
  "Payment",
  "Confirmation",
];

// Define the possible payment statuses
type PaymentStatus = "success" | "failed" | "pending" | "cancelled";

// Define the payment result structure (coming from backend)
interface PaymentResult {
  reservationId: number;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  message?: string;
}

const PaymentConfirmationPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );

  useEffect(() => {
    // Parse the URL parameters to get order_id and status
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");
    const status = queryParams.get("status");

    // If there's a status=cancelled parameter, handle it directly
    if (status === "cancelled") {
      setPaymentResult({
        reservationId: parseInt(queryParams.get("reservationId") || "0"),
        orderId: orderId || "unknown",
        status: "cancelled" as PaymentStatus,
        amount: 0,
        message: "Payment cancelled",
      });
      setLoading(false);
      return;
    }

    // Check if we have the necessary parameters
    if (!orderId) {
      setError("Missing required payment information");
      setLoading(false);
      return;
    }

    // Function to verify payment status
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5162/api/Payments/status?orderId=${orderId}`
        );

        console.log("Payment response:", response.data);

        if (response.data.isSuccess) {
          // Map backend status to frontend expected status
          let paymentStatus: PaymentStatus = "pending";

          // Normalize and map the status
          const backendStatus = response.data.value.status?.toLowerCase();

          // status mapping
          if (backendStatus === "completed" || backendStatus === "success") {
            paymentStatus = "success";
          } else if (backendStatus === "failed") {
            paymentStatus = "failed";
          } else if (backendStatus === "cancelled") {
            paymentStatus = "cancelled";
          }
          // Else remains as "pending" by default

          setPaymentResult({
            reservationId: response.data.value.reservationId,
            orderId: response.data.value.orderId,
            status: paymentStatus,
            amount: response.data.value.amount,
            message: response.data.value.message,
          });
        } else {
          setError(response.data.error || "Failed to verify payment status");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setError(
          "An error occurred while verifying your payment. Please contact support."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  // Handle loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying payment status...
        </Typography>
      </Container>
    );
  }

  // Handle error state
  if (error || !paymentResult) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: theme.palette.error.main,
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            Payment Verification Failed
          </Typography>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error ||
              "Unable to verify payment status. Please contact support."}
          </Alert>

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
  }

  // Determine content based on payment status
  const renderContent = () => {
    switch (paymentResult.status) {
      case "success":
        return (
          <>
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 2,
              }}
            />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
              Payment Successful!
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Your reservation ID:{" "}
              <strong>{paymentResult.reservationId}</strong>
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Order ID: <strong>{paymentResult.orderId}</strong>
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Amount Paid:{" "}
              <strong>Rs. {paymentResult.amount.toFixed(2)}</strong>
            </Typography>

            <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
              <Typography variant="body1" paragraph>
                Thank you for your payment. Your reservation has been confirmed.
              </Typography>

              <Typography variant="body1" paragraph>
                You will receive a confirmation email with all the details of
                your reservation.
              </Typography>

              <Alert severity="info" sx={{ mt: 3 }}>
                Please save your reservation ID for future reference.
              </Alert>
            </Box>
          </>
        );

      // Handle other cancel payment statuses
      case "cancelled":
        return (
          <>
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                color: theme.palette.warning.main,
                mb: 2,
              }}
            />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
              Payment Cancelled
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Your payment for reservation ID:{" "}
              <strong>{paymentResult.reservationId}</strong> was cancelled.
            </Typography>

            <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
              <Typography variant="body1" paragraph>
                You have cancelled the payment process. Your reservation is not
                confirmed.
              </Typography>

              <Typography variant="body1" paragraph>
                If you would like to complete your booking, please try again or
                contact our support team.
              </Typography>

              <Alert severity="warning" sx={{ mt: 3 }}>
                No payment has been processed for this reservation.
              </Alert>
            </Box>
          </>
        );

      // handle failed payment statuses
      case "failed":
        return (
          <>
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                color: theme.palette.error.main,
                mb: 2,
              }}
            />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
              Payment Failed
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Your payment for reservation ID:{" "}
              <strong>{paymentResult.reservationId}</strong> could not be
              processed.
            </Typography>

            <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
              <Typography variant="body1" paragraph>
                Unfortunately, your payment could not be processed. This could
                be due to insufficient funds, card restrictions, or a temporary
                issue with the payment service.
              </Typography>

              <Typography variant="body1" paragraph>
                Please check your payment details and try again, or use a
                different payment method.
              </Typography>

              <Alert severity="error" sx={{ mt: 3 }}>
                {paymentResult.message ||
                  "Payment transaction failed. No charge has been made."}
              </Alert>
            </Box>

            <Button
              variant="outlined"
              size="large"
              onClick={() =>
                navigate("/paymentInfo", {
                  state: { reservationId: paymentResult.reservationId },
                })
              }
              sx={{ mt: 3, mr: 2 }}
            >
              Try Again
            </Button>
          </>
        );

      default:
        return (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
              Payment Processing
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Your payment for reservation ID:{" "}
              <strong>{paymentResult.reservationId}</strong> is being processed.
            </Typography>

            <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
              <Typography variant="body1" paragraph>
                Your payment is currently being processed. This may take a few
                moments.
              </Typography>

              <Typography variant="body1" paragraph>
                Please do not refresh the page or navigate away until the
                process is complete.
              </Typography>

              <Alert severity="info" sx={{ mt: 3 }}>
                You will receive a confirmation once the payment is processed.
              </Alert>
            </Box>
          </>
        );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={3} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        {renderContent()}

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

export default PaymentConfirmationPage;
