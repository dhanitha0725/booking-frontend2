import { useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { ReservationPayload } from "../../../../types/ReservationPayload";
import { PaymentRequest } from "../../../../types/PaymentTypes";
import {
  submitPaymentForm,
  initiatePayment,
} from "../../../../services/PaymentService";
import axios from "axios";

interface PaymentCheckoutProps {
  initialData?: ReservationPayload;
}

const PaymentCheckout = ({ initialData }: PaymentCheckoutProps) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: initialData?.UserDetails?.PhoneNumber || "",
    country: "Sri Lanka",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle changes to form fields
  const handleFormFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      //validate initial data
      if (!initialData || !initialData.ReservationId) {
        throw new Error("Invalid initial data provided.");
      }

      // Validate form fields
      const { address, city, phone } = formData;
      if (!address || !city || !phone) {
        setError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      // Validate phone number (must be 10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        setError("Phone number must be 10 digits.");
        setIsSubmitting(false);
        return;
      }

      // construct payment request for the backend
      const paymentRequest: PaymentRequest = {
        orderId: `RES-${initialData.ReservationId}-${Date.now()}`, // Unique order ID
        amount: initialData.Total,
        currency: "LKR",
        firstName: initialData.UserDetails.FirstName,
        lastName: initialData.UserDetails.LastName,
        email: initialData.UserDetails.Email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        items: initialData.Items.map(
          (item) => `${item.quantity} × ${item.type} (ID: ${item.itemId})`
        ).join(", "),
        reservationId: initialData.ReservationId,
      };

      // Validate payment data
      if (paymentRequest.amount <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }
      if (!paymentRequest.reservationId || paymentRequest.reservationId <= 0) {
        throw new Error("Invalid reservation ID");
      }

      // Initiate payment via backend
      console.log("Initiating payment with payload:", paymentRequest);
      const paymentResponse = await initiatePayment(paymentRequest);

      // Redirect to PayHere payment page
      if (paymentResponse && paymentResponse.actionUrl) {
        submitPaymentForm(paymentResponse);
      } else {
        throw new Error("Invalid payment response from server");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to initiate payment");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => handleFormFieldChange("address", e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            value={formData.city}
            onChange={(e) => handleFormFieldChange("city", e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleFormFieldChange("phone", e.target.value)}
            fullWidth
            required
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            value={formData.country}
            onChange={(e) => handleFormFieldChange("country", e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Complete Payment"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PaymentCheckout;
