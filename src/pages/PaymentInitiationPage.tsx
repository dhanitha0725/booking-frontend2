import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress, Typography, Box } from "@mui/material";
import axios from "axios";
import { submitPaymentForm } from "../services/PaymentService";
import { PaymentInitiationResponse } from "../types/PaymentInitiationResponse";

const PaymentInitiationPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Function to submit the payment form to PayHere
  useEffect(() => {
    const initiatePayment = async () => {
      // Extract orderId from the URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const orderId = queryParams.get("orderId");

      if (!orderId) {
        setError("Invalid payment link. Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch payment initiation data from the backend
        const response = await axios.get<PaymentInitiationResponse>(
          `http://localhost:5162/api/payments/initiate?orderId=${encodeURIComponent(orderId)}`
        );
        const paymentData = response.data;

        // Submit form to PayHere
        submitPaymentForm(paymentData);
      } catch (err) {
        console.error("Error initiating payment:", err);
        setError("Failed to initiate payment. Please try again.");
        setLoading(false);
      }
    };

    initiatePayment();
  }, [location]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return null; // Form submission happens in useEffect
};

export default PaymentInitiationPage;
