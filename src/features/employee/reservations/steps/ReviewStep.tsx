import React from "react";
import { Box, Grid, Typography, Paper, Alert } from "@mui/material";
import { Dayjs } from "dayjs";
import { UserInfo } from "../../../../types/reservationData";
import {
  BookingItemDto,
  CustomerType,
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
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  facilityName,
  dateRange,
  customerType,
  total,
  selectedItems,
  userDetails,
  error,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
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
            <Typography variant="subtitle2">Total Amount:</Typography>
            <Typography>Rs. {total.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selected Items
        </Typography>
        {selectedItems.map((item) => (
          <Box key={`${item.type}-${item.itemId}`} sx={{ mb: 1 }}>
            <Typography>
              {item.name || item.itemId} ({item.type}) - Quantity:{" "}
              {item.quantity}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Grid container spacing={2}>
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
      </Paper>
    </Box>
  );
};

export default ReviewStep;
