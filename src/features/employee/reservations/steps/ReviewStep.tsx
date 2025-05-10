import React from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { UserInfo } from "../../../../types/reservationData";
import {
  BookingItemDto,
  CustomerType,
  PaymentInfo,
} from "../../../../types/employeeReservation";

interface ReviewStepProps {
  facilityName: string | undefined;
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  customerType: CustomerType;
  total: number;
  selectedItems: BookingItemDto[];
  userDetails: UserInfo;
  error: string | null;
  paymentInfo: PaymentInfo;
  onPaymentInfoChange: (paymentInfo: PaymentInfo) => void;
}

const paymentMethods = ["Cash"];

const ReviewStep: React.FC<ReviewStepProps> = ({
  facilityName,
  dateRange,
  customerType,
  total,
  selectedItems,
  userDetails,
  error,
  paymentInfo,
  onPaymentInfoChange,
}) => {
  // Handle payment received checkbox change
  const handlePaymentReceivedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onPaymentInfoChange({
      ...paymentInfo,
      paymentReceived: event.target.checked,
      // Reset payment method to Cash when toggling payment received
      paymentMethod: event.target.checked ? "Cash" : null,
      amountPaid: event.target.checked ? total : null,
    });
  };

  // Handle payment method change
  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    onPaymentInfoChange({
      ...paymentInfo,
      paymentMethod: event.target.value,
    });
  };

  // Handle amount paid change
  const handleAmountPaidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onPaymentInfoChange({
      ...paymentInfo,
      amountPaid: parseFloat(event.target.value) || 0,
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Reservation Summary Section */}
      <Typography variant="h6" gutterBottom>
        Reservation Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">Facility:</Typography>
          <Typography>{facilityName}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">Start Date:</Typography>
          <Typography>
            {dateRange.startDate
              ? dateRange.startDate.format("MMM D, YYYY")
              : "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">End Date:</Typography>
          <Typography>
            {dateRange.endDate
              ? dateRange.endDate.format("MMM D, YYYY")
              : "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">Customer Type:</Typography>
          <Typography sx={{ textTransform: "capitalize" }}>
            {customerType}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="subtitle2" color="primary">
            Total Amount:
          </Typography>
          <Typography color="primary" fontWeight="bold">
            Rs. {total.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Selected Items Section */}
      <Typography variant="h6" gutterBottom>
        Selected Items
      </Typography>
      {selectedItems.map((item) => (
        <Typography key={`${item.type}-${item.itemId}`} sx={{ mb: 1 }}>
          {item.name || item.itemId} ({item.type}) - Quantity: {item.quantity}
        </Typography>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Customer Information Section */}
      <Typography variant="h6" gutterBottom>
        Customer Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Name:</Typography>
          <Typography>
            {userDetails.firstName} {userDetails.lastName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Email:</Typography>
          <Typography>{userDetails.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Phone:</Typography>
          <Typography>{userDetails.phoneNumber}</Typography>
        </Grid>
        {userDetails.organizationName && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Organization:</Typography>
            <Typography>{userDetails.organizationName}</Typography>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Payment Information Section */}
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={paymentInfo.paymentReceived}
              onChange={handlePaymentReceivedChange}
              color="primary"
            />
          }
          label="Payment Received"
        />
      </Box>

      {paymentInfo.paymentReceived && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentInfo.paymentMethod || ""}
                onChange={handlePaymentMethodChange}
                label="Payment Method"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount Paid"
              type="number"
              fullWidth
              value={paymentInfo.amountPaid || ""}
              onChange={handleAmountPaidChange}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 0.5 }}>Rs.</Typography>,
              }}
              placeholder="Enter amount"
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ReviewStep;
