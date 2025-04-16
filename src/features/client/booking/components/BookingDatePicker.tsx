import { useState } from "react";
import {
  Box,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { BookingItemDto } from "../../../../types/selectedFacility";

export type CustomerType = "corporate" | "public" | "private";

interface BookingDatePickerProps {
  dateRange: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  };
  onDateChange: (range: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  }) => void;
  customerType: CustomerType;
  onCustomerTypeChange: (type: CustomerType) => void;
  required: boolean;
  facilityId: number | undefined;
  selectedItems: BookingItemDto[];
  onAvailabilityChange: (availability: boolean) => void;
}

const BookingDatePicker = ({
  dateRange,
  onDateChange,
  customerType,
  onCustomerTypeChange,
  required,
  facilityId,
  selectedItems,
  onAvailabilityChange,
}: BookingDatePickerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [, setIsAvailable] = useState<boolean | null>(null);

  // handle dates changes
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date && dateRange.endDate && date.isAfter(dateRange.endDate)) {
      setError("Start date cannot be after end date.");
    } else {
      setError(null);
    }
    onDateChange({ startDate: date, endDate: dateRange.endDate });
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date && dateRange.startDate && !date.isAfter(dateRange.startDate)) {
      setError("End date must be after the start date.");
    } else {
      setError(null);
    }
    onDateChange({ startDate: dateRange.startDate, endDate: date });
  };

  const handleCheckAvailability = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5162/api/Reservation/checkAvailability",
        {
          facilityId, // Use facilityId prop
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          items: selectedItems, // Use selectedItems prop
        }
      );

      setIsAvailable(response.data.isAvailable);
      onAvailabilityChange(response.data.isAvailable); // Notify parent
      if (response.data.isAvailable) {
        setError(null);
        alert("Facility is available for the selected dates.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setError(
        "An error occurred while checking availability. Please try again later."
      );
      setIsAvailable(false);
      onAvailabilityChange(false); // Notify parent
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {required && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please select booking dates
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={handleStartDateChange}
              disablePast
              slotProps={{
                textField: { fullWidth: true, variant: "outlined" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={handleEndDateChange}
              disablePast
              minDate={dateRange.startDate || dayjs().add(1, "day")}
              slotProps={{
                textField: { fullWidth: true, variant: "outlined" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="customer-type-label">Customer Type</InputLabel>
              <Select
                labelId="customer-type-label"
                value={customerType}
                onChange={(e) =>
                  onCustomerTypeChange(e.target.value as CustomerType)
                }
                label="Customer Type"
              >
                <MenuItem value="corporate">Corporate</MenuItem>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCheckAvailability}
            >
              Check Availability
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingDatePicker;
