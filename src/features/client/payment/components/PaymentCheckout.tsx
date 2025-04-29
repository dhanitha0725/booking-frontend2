import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Alert } from "@mui/material";
import { ReservationPayload } from "../../../../types/ReservationPayload";
import { FormData, UserDetails } from "../../../../types/PaymentTypes";
import {
  createReservation,
  submitPaymentForm,
} from "../../../../services/PaymentService";
import { validateItems } from "../../../../validations/ValidationUtils";
import AdditionalFormFields from "./AdditionalFormFields";
import axios from "axios";

interface PaymentCheckoutProps {
  initialData?: ReservationPayload;
}

const PaymentCheckout = ({ initialData }: PaymentCheckoutProps) => {
  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    items: [],
    userDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Sri Lanka",
      organizationName: "",
    },
    customerType: "private",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        startDate: initialData.StartDate || "",
        endDate: initialData.EndDate || "",
        items: initialData.Items || [],
        userDetails: {
          firstName: initialData.UserDetails?.FirstName || "",
          lastName: initialData.UserDetails?.LastName || "",
          email: initialData.UserDetails?.Email || "",
          phone: initialData.UserDetails?.PhoneNumber || "",
          address: "",
          city: "",
          country: "Sri Lanka",
          organizationName: initialData.UserDetails?.OrganizationName || "",
        },
        customerType: initialData.CustomerType || "private",
      });
    }
  }, [initialData]);

  const handleFormFieldChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      userDetails: {
        ...formData.userDetails,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Make sure startDate and endDate are always strings and never undefined
      if (!formData.startDate && !initialData?.StartDate) {
        setError("Start date is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.endDate && !initialData?.EndDate) {
        setError("End date is required");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        startDate: formData.startDate || initialData?.StartDate || "", // Add fallback empty string
        endDate: formData.endDate || initialData?.EndDate || "", // Add fallback empty string
        total: initialData?.Total || 0, // Add fallback for total
        customerType: formData.customerType.toLowerCase(),
        items:
          initialData?.Items?.map((item) => ({
            itemId: item.itemId || 1,
            quantity: item.quantity || 1,
            type: item.type || "package",
          })) || [],
        userDetails: {
          firstName: formData.userDetails.firstName,
          lastName: formData.userDetails.lastName,
          email: formData.userDetails.email,
          phoneNumber: formData.userDetails.phone,
          phone: formData.userDetails.phone,
          address: formData.userDetails.address,
          city: formData.userDetails.city,
          country: formData.userDetails.country,
          organizationName: formData.userDetails.organizationName,
        },
      };

      // Validate items
      const validation = validateItems(payload.items);
      if (!validation.isValid) {
        console.error("Invalid items in reservation", validation.invalidItems);
        setError("Invalid items in reservation. Please check your selection.");
        setIsSubmitting(false);
        return;
      }

      // Debug: Log the payload being sent to help diagnose issues
      console.log("Reservation payload:", JSON.stringify(payload, null, 2));

      // Create reservation
      const reservationResponse = await createReservation(payload);

      // Process the response
      if (reservationResponse.data.isSuccess) {
        handleSuccessfulReservation(
          reservationResponse.data,
          formData.userDetails
        );
      } else {
        handleFailedReservation(reservationResponse.data);
      }
    } catch (error) {
      handleSubmissionError(error);
    }
  };

  const handleSuccessfulReservation = (
    responseData: any,
    userDetails: UserDetails
  ) => {
    if (formData.customerType.toLowerCase() === "private") {
      const paymentDetails =
        responseData.value.paymentDetails || responseData.value;

      if (paymentDetails && paymentDetails.actionUrl) {
        const paymentData = {
          actionUrl: paymentDetails.actionUrl,
          merchantId: paymentDetails.merchantId,
          returnUrl: paymentDetails.returnUrl,
          cancelUrl: paymentDetails.cancelUrl,
          notifyUrl: paymentDetails.notifyUrl,
          orderId: paymentDetails.orderId,
          items: paymentDetails.items,
          currency: paymentDetails.currency,
          amount:
            paymentDetails.amountFormatted ||
            (typeof paymentDetails.amount === "number"
              ? paymentDetails.amount.toFixed(2)
              : paymentDetails.amount),
          firstName: paymentDetails.firstName || userDetails.firstName,
          lastName: paymentDetails.lastName || userDetails.lastName,
          email: paymentDetails.email || userDetails.email,
          phone: paymentDetails.phone || userDetails.phone,
          address: paymentDetails.address || userDetails.address,
          city: paymentDetails.city || userDetails.city,
          country: paymentDetails.country || userDetails.country,
          hash: paymentDetails.hash,
        };

        submitPaymentForm(paymentData);
      } else {
        console.error(
          "Payment details missing in API response:",
          paymentDetails
        );
        setError("Payment initialization failed. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      console.log("Reservation created successfully for non-private customer");
      // Redirect or show confirmation as needed
    }
  };

  const handleFailedReservation = (responseData: any) => {
    console.error("Reservation failed:", responseData.error);
    setError(responseData.error || "Failed to create reservation");
    setIsSubmitting(false);
  };

  const handleSubmissionError = (error: any) => {
    console.error("Payment process failed:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "Server response:",
        error.response.status,
        error.response.data
      );
      setError(error.response.data.message || "Server error occurred");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <AdditionalFormFields
          userDetails={formData.userDetails}
          onChange={handleFormFieldChange}
        />

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
