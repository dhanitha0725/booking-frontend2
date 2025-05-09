import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { BookingItemDto } from "../../../../types/selectedFacility";

export interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

export type CustomerType = "corporate" | "public" | "private";

interface DateRangeType {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

interface BookingDatePickerProps {
  dateRange: DateRangeType;
  onDateChange: (dateRange: DateRangeType) => void;
  customerType: "corporate" | "public" | "private";
  onCustomerTypeChange: (type: "corporate" | "public" | "private") => void;
  required: boolean;
  facilityId?: number;
  selectedItems: BookingItemDto[];
  onAvailabilityChange: (availabilityResponse: AvailabilityResponseDto) => void;
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
  const [availability, setAvailability] =
    useState<AvailabilityResponseDto | null>(null);

  // Automatically check availability when dependencies change
  useEffect(() => {
    const checkAvailability = async () => {
      if (
        !dateRange.startDate ||
        !dateRange.endDate ||
        selectedItems.length === 0 ||
        !facilityId
      ) {
        setAvailability(null);
        onAvailabilityChange({ isAvailable: false, message: "" });
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5162/api/Reservation/checkAvailability",
          {
            facilityId,
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString(),
            items: selectedItems,
          }
        );

        setAvailability(response.data);
        onAvailabilityChange(response.data);
      } catch (error) {
        console.error("Error checking availability:", error);
        setError("An error occurred while checking availability.");
        setAvailability(null);
        onAvailabilityChange({
          isAvailable: false,
          message: "Error checking availability",
        });
      }
    };

    checkAvailability();
  }, [dateRange, selectedItems, facilityId, onAvailabilityChange]);

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Only show date selection prompt if required AND dates are missing */}
        {required && (!dateRange.startDate || !dateRange.endDate) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Date selection is required for rooms and daily packages
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
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingDatePicker;
