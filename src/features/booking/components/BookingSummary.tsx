import { Box, Typography, Paper, Divider, Chip, Grid } from "@mui/material";
import {
  LocationOn,
  CalendarMonth,
  AccessTime,
  People,
  Receipt,
} from "@mui/icons-material";
import { format } from "date-fns";

interface BookingData {
  facility: {
    name: string;
    location: string;
    pricing: {
      [key: string]: {
        hourly: string;
        setup: string;
        cleaning: string;
      };
    };
  };
  date: Date;
  startTime: string;
  endTime: string;
  customerType: string;
  eventType: string;
  guestCount: number;
  specialRequests?: string;
}

const BookingSummary = ({
  bookingData,
  showPrice = true,
}: {
  bookingData: BookingData;
  showPrice?: boolean;
}) => {
  const {
    facility,
    date,
    startTime,
    endTime,
    customerType,
    eventType,
    guestCount,
    specialRequests,
  } = bookingData;

  //calculate duration in hours assuming startTime and endTime are in HH:mm format
  const calculateDuration = () => {
    const [startHour, startMin] = startTime
      .split(":")
      .map((num: string) => parseInt(num));
    const [endHour, endMin] = endTime
      .split(":")
      .map((num: string) => parseInt(num));

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  // Calculate total price based on customer type and duration
  const calculatePrice = () => {
    // Base price from the pricing object
    const basePrice = parseInt(
      facility.pricing[customerType].hourly.replace(/\D/g, "")
    );

    // Calculate duration in hours
    const [startHour, startMin] = startTime
      .split(":")
      .map((num: string) => parseInt(num));
    const [endHour, endMin] = endTime
      .split(":")
      .map((num: string) => parseInt(num));

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const durationHours = (endMinutes - startMinutes) / 60;

    // Calculate the rental cost
    const rentalCost = basePrice * durationHours;

    // Additional fees
    const setupFee = parseInt(
      facility.pricing[customerType].setup.replace(/\D/g, "")
    );
    const cleaningFee = parseInt(
      facility.pricing[customerType].cleaning.replace(/\D/g, "")
    );

    return {
      rentalCost,
      setupFee,
      cleaningFee,
      total: rentalCost + setupFee + cleaningFee,
    };
  };

  const prices = calculatePrice();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Booking Summary
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {facility.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {facility.location}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarMonth fontSize="small" color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Date
              </Typography>
              <Typography variant="body1">
                {format(date, "EEEE, MMMM d, yyyy")}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTime fontSize="small" color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Time
              </Typography>
              <Typography variant="body1">
                {startTime} - {endTime} ({calculateDuration()})
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <People fontSize="small" color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Guests
              </Typography>
              <Typography variant="body1">{guestCount} people</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Event Type
            </Typography>
            <Chip
              label={eventType}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Customer Type
        </Typography>
        <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
          {customerType}
        </Typography>
      </Box>

      {specialRequests && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Special Requests
          </Typography>
          <Typography variant="body2">{specialRequests}</Typography>
        </Box>
      )}

      {showPrice && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Receipt fontSize="small" sx={{ mr: 1 }} />
              Price Details
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                Rental ({facility.pricing[customerType].hourly} ×{" "}
                {calculateDuration()})
              </Typography>
              <Typography variant="body2">
                ${prices.rentalCost.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Setup Fee</Typography>
              <Typography variant="body2">
                ${prices.setupFee.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Cleaning Fee</Typography>
              <Typography variant="body2">
                ${prices.cleaningFee.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                ${prices.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default BookingSummary;
