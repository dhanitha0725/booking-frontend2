import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { ReservationPayload } from "../types/ReservationPayload";

const steps = [
  "Booking Details",
  "User Information",
  "Payment",
  "Confirmation",
];

// Define a proper type for the reservation data
interface PendingReservation {
  StartDate: string;
  EndDate: string;
  Total: number;
  UserDetails: {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    OrganizationName?: string;
  };
  Items: Array<{
    itemId: number;
    quantity: number;
    type: string;
    name?: string;
  }>;
  CustomerType: string;
  ReservationId?: number;
}

const PaymentInfoPage: React.FC = () => {
  const [activeStep] = useState(2); // Payment is step 3
  const [pendingReservation, setPendingReservation] =
    useState<PendingReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // First try to get data from router state
    if (location.state && location.state.reservationId) {
      console.log("Using reservation data from router state");

      // Create a properly structured PendingReservation object from location.state
      // with appropriate fallbacks for missing properties
      const pendingData: PendingReservation = {
        StartDate: location.state.startDate || new Date().toISOString(),
        EndDate: location.state.endDate || new Date().toISOString(),
        Total: location.state.total || 0,
        UserDetails: {
          FirstName: location.state.userDetails?.firstName || "",
          LastName: location.state.userDetails?.lastName || "",
          Email: location.state.userDetails?.email || "",
          PhoneNumber: location.state.userDetails?.phoneNumber || "",
          OrganizationName: location.state.userDetails?.organizationName,
        },
        Items: location.state.items || [], // Fix the naming mismatch here
        CustomerType: location.state.customerType || "private",
        ReservationId: location.state.reservationId,
      };

      setPendingReservation(pendingData);
      setLoading(false);
      return;
    }

    // Rest of the existing code for localStorage fallback
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
      const parsedData = JSON.parse(reservationData) as PendingReservation;
      setPendingReservation(parsedData);

      // Validate required fields
      if (!parsedData.ReservationId) {
        console.warn("ReservationId is missing from the data");
      }
    } catch (err) {
      setError("Invalid reservation data. Please try again.");
      console.error("Error parsing reservation data:", err);
    } finally {
      setLoading(false);
    }
  }, [location.state, navigate]);

  // Helper function to convert PendingReservation to ReservationPayload
  const getFormattedReservationData = (): ReservationPayload | undefined => {
    if (!pendingReservation) return undefined;

    return {
      StartDate: pendingReservation.StartDate,
      EndDate: pendingReservation.EndDate,
      Total: pendingReservation.Total,
      UserDetails: pendingReservation.UserDetails,
      Items: (pendingReservation.Items || []).map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        type: validateItemType(item.type),
      })),
      CustomerType: validateCustomerType(pendingReservation.CustomerType), // Convert string to union type
      ReservationId: pendingReservation.ReservationId,
    };
  };

  // Helper function to validate and convert the item type
  const validateItemType = (type: string): "room" | "package" => {
    if (type === "room" || type === "package") {
      return type;
    }
    // Default to "package" if the type is not valid
    console.warn(`Invalid item type "${type}" - defaulting to "package"`);
    return "package";
  };

  // Helper function to validate and convert the customer type
  const validateCustomerType = (
    customerType: string
  ): "private" | "public" | "corporate" => {
    if (
      customerType === "private" ||
      customerType === "public" ||
      customerType === "corporate"
    ) {
      return customerType as "private" | "public" | "corporate";
    }
    // Default to "private" if the type is not valid
    console.warn(
      `Invalid customer type "${customerType}" - defaulting to "private"`
    );
    return "private";
  };

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
          <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
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
            <Typography>
              {/* Displaying item details */}
              Items:{" "}
              {pendingReservation.Items && pendingReservation.Items.length > 0
                ? pendingReservation.Items.map(
                    (item) => `${item.quantity} × ${item.name || item.type}`
                  ).join(", ")
                : "No items available"}
            </Typography>
            <Typography fontWeight="bold" sx={{ mt: 1 }}>
              Total Amount: Rs. {pendingReservation.Total.toFixed(2)}
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Payment Information
        </Typography>

        <PaymentCheckout
          initialData={getFormattedReservationData()} // Pass properly typed data
        />
      </Paper>
    </Container>
  );
};

export default PaymentInfoPage;
