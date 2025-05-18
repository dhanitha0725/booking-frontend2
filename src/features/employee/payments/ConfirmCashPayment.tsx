import React, { useState } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { z } from "zod";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import api from "../../../services/api";

// zod validation schema for cash payment
const cashPaymentSchema = z.object({
  amountPaid: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than zero"),
});

interface ConfirmCashPaymentProps {
  paymentId: string;
  reservationId: number;
  expectedAmount?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ConfirmCashPayment: React.FC<ConfirmCashPaymentProps> = ({
  paymentId,
  expectedAmount,
  onSuccess,
  onError,
}) => {
  const [amountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate amount using ZOD
      const parsedAmount = parseFloat(amountPaid);

      try {
        cashPaymentSchema.parse({ amountPaid: parsedAmount });
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMsg =
            validationError.errors[0]?.message || "Invalid amount";
          setError(errorMsg);
          if (onError) onError(errorMsg);
          setLoading(false);
          return;
        }
      }

      // Submit to backend
      const response = await api.post("/Payments/confirm-cash-payment", {
        paymentId,
        amountPaid: parsedAmount,
      });

      if (response.data.isSuccess) {
        setSuccessMessage("Cash payment confirmed successfully");
        setAmountPaid("");
        if (onSuccess) onSuccess();
      } else {
        const errorMessage =
          response.data.error || "Failed to confirm cash payment";
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (err) {
      let errorMessage =
        "An unexpected error occurred while confirming the payment";

      if (axios.isAxiosError(err)) {
        // Handle error messages from backend
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          errorMessage;
      }

      setError(errorMessage);
      if (onError) onError(errorMessage);
      console.error("Error confirming cash payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5", mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MonetizationOnIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6">Confirm Cash Payment</Typography>
      </Box>

      {expectedAmount && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Expected Amount: LKR {expectedAmount.toFixed(2)}
        </Alert>
      )}

      <TextField
        label="Amount Received (LKR)"
        type="number"
        value={amountPaid}
        onChange={(e) => setAmountPaid(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
        inputProps={{ step: "0.01", min: "0" }}
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirm}
        disabled={loading || !amountPaid || parseFloat(amountPaid) <= 0}
        startIcon={
          loading ? <CircularProgress size={20} /> : <MonetizationOnIcon />
        }
      >
        {loading ? "Processing..." : "Confirm Cash Payment"}
      </Button>
    </Paper>
  );
};

export default ConfirmCashPayment;
