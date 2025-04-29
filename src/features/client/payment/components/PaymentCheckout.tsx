import { useState, useEffect } from "react";
import axios from "axios";
//import { PaymentInitiationResponse } from "../../../../types/PaymentInitiationResponse";
import { Grid, TextField, Button, CircularProgress } from "@mui/material";
import { ReservationPayload } from "../../../../types/ReservationPayload";
import { useNavigate } from "react-router-dom";

interface PaymentCheckoutProps {
  initialData?: ReservationPayload;
}

const PaymentCheckout = ({ initialData }: PaymentCheckoutProps) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    items: [] as Array<{ itemId: number; quantity: number; type: string }>,
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
  const navigate = useNavigate();

  // Initialize form with data from props when available
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        startDate: formData.startDate || initialData?.StartDate,
        endDate: formData.endDate || initialData?.EndDate,
        total: initialData?.Total,
        customerType: formData.customerType.toLowerCase(),
        items:
          initialData?.Items?.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            type: item.type,
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

      // for debugging
      console.log(
        "Creating reservation with payload:",
        JSON.stringify(payload, null, 2)
      );

      // create reservation with payment
      const reservationResponse = await axios.post(
        "http://localhost:5162/api/Reservation/createReservation",
        payload
      );

      if (
        reservationResponse.data.isSuccess &&
        formData.customerType.toLowerCase() === "private"
      ) {
        console.log(
          "Received response:",
          JSON.stringify(reservationResponse.data, null, 2)
        );

        // API returns paymentUrl  in the response
        if (reservationResponse.data.value.paymentUrl) {
          console.log(
            "Redirecting to payment URL:",
            reservationResponse.data.value.paymentUrl
          );
          // redirect to payment gateway
          window.location.href = reservationResponse.data.value.paymentUrl;
        } else {
          console.error(
            "Payment URL not found in response",
            reservationResponse.data
          );
        }
      } else {
        // For non-private customers or if payment not needed
        console.log(
          "Reservation created successfully",
          JSON.stringify(reservationResponse.data, null, 2)
        );
        // Redirect to confirmation
        navigate("/confirmation", {
          state: {
            reservationId: reservationResponse.data.value.reservationId,
          },
        });
      }
    } catch (error) {
      console.error("Payment process failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error details:", error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            label="Address"
            fullWidth
            value={formData.userDetails.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                userDetails: {
                  ...formData.userDetails,
                  address: e.target.value,
                },
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="City"
            fullWidth
            value={formData.userDetails.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                userDetails: {
                  ...formData.userDetails,
                  city: e.target.value,
                },
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            fullWidth
            value={formData.userDetails.country}
            disabled
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
