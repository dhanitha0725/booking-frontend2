import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import {
  BookingItemDto,
  PackagesDto,
} from "../../../../types/selectedFacility";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extend dayjs with the plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

export type CustomerType = "corporate" | "public" | "private";

interface DateRangeType {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

interface BookingDateTimePickerProps {
  dateRange: DateRangeType;
  onDateChange: (dateRange: DateRangeType) => void;
  customerType: CustomerType;
  onCustomerTypeChange: (type: CustomerType) => void;
  required: boolean;
  facilityId?: number;
  selectedItems: BookingItemDto[];
  onAvailabilityChange: (availabilityResponse: AvailabilityResponseDto) => void;
  packages: PackagesDto[];
}

const BookingDateTimePicker = ({
  dateRange,
  onDateChange,
  customerType,
  onCustomerTypeChange,
  required,
  facilityId,
  selectedItems,
  onAvailabilityChange,
  packages,
}: BookingDateTimePickerProps) => {
  const [error, setError] = useState<string | null>(null);

  // Centralized configuration based on selected items
  const config = useMemo(() => {
    const hasSelectedRooms = selectedItems.some((item) => item.type === "room");
    const hasSelectedPackages = selectedItems.some(
      (item) => item.type === "package"
    );

    if (hasSelectedRooms) {
      return {
        showTimeSelection: false,
        defaultHour: 8,
        minDays: 1,
        description:
          "For room bookings, check-in/check-out time is set to 8 AM by default",
      };
    } else if (hasSelectedPackages) {
      const hasSubDayPackage = selectedItems.some(
        (item) =>
          item.type === "package" &&
          packages
            .find((p) => p.packageId === item.itemId)
            ?.duration?.includes("hour")
      );

      if (hasSubDayPackage) {
        return {
          showTimeSelection: true,
          defaultHour: null,
          minDays: 0,
          description: null,
        };
      } else {
        return {
          showTimeSelection: false,
          defaultHour: 0,
          minDays: 0,
          description:
            "For daily packages, time is set to 00:00. Same-day selection is treated as a 1-day booking.",
        };
      }
    } else {
      return {
        showTimeSelection: false,
        defaultHour: null,
        minDays: 0,
        description: null,
      };
    }
  }, [selectedItems, packages]);

  const { showTimeSelection, defaultHour, minDays, description } = config;

  // Apply default times based on configuration
  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate || defaultHour === null)
      return;

    const newStartDate = dateRange.startDate
      .hour(defaultHour)
      .minute(0)
      .second(0);
    let newEndDate = dateRange.endDate.hour(defaultHour).minute(0).second(0);

    // For one-day packages, ensure endDate is at least the same day or later
    if (minDays === 0 && newEndDate.isBefore(newStartDate, "day")) {
      newEndDate = newStartDate.clone(); // Set endDate to same day as startDate for single-day booking
    }

    if (
      !dateRange.startDate.isSame(newStartDate) ||
      !dateRange.endDate.isSame(newEndDate)
    ) {
      onDateChange({ startDate: newStartDate, endDate: newEndDate });
    }
  }, [config, dateRange, onDateChange]);

  // Check availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (
        !dateRange.startDate ||
        !dateRange.endDate ||
        selectedItems.length === 0 ||
        !facilityId
      ) {
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
        onAvailabilityChange(response.data);
      } catch (error) {
        console.error("Error checking availability:", error);
        setError("An error occurred while checking availability.");
        onAvailabilityChange({
          isAvailable: false,
          message: "Error checking availability",
        });
      }
    };

    checkAvailability();
  }, [dateRange, selectedItems, facilityId, onAvailabilityChange]);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) {
      onDateChange({ startDate: null, endDate: dateRange.endDate });
      return;
    }

    // Apply default time if specified in config
    if (defaultHour !== null) {
      date = date.hour(defaultHour).minute(0).second(0);
    }

    if (dateRange.endDate) {
      // Validate based on configuration
      if (minDays > 0 && dateRange.endDate.diff(date, "day") < minDays) {
        setError(
          `End date must be at least ${minDays} day(s) after start date.`
        );
        return;
      } else if (
        showTimeSelection &&
        date.isSame(dateRange.endDate, "day") &&
        date.isAfter(dateRange.endDate)
      ) {
        setError("Start time must be before end time on the same day.");
        return;
      } else if (!showTimeSelection && date.isAfter(dateRange.endDate, "day")) {
        setError("Start date cannot be after end date.");
        return;
      }
    }
    setError(null);
    onDateChange({ startDate: date, endDate: dateRange.endDate });
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) {
      onDateChange({ startDate: dateRange.startDate, endDate: null });
      return;
    }

    // Apply default time if specified in config
    if (defaultHour !== null) {
      date = date.hour(defaultHour).minute(0).second(0);
    }

    if (dateRange.startDate) {
      // Validate based on configuration
      if (minDays > 0 && date.diff(dateRange.startDate, "day") < minDays) {
        setError(
          `End date must be at least ${minDays} day(s) after start date.`
        );
        return;
      } else if (
        showTimeSelection &&
        date.isSame(dateRange.startDate, "day") &&
        !date.isAfter(dateRange.startDate)
      ) {
        setError("End time must be after start time on the same day.");
        return;
      } else if (
        !showTimeSelection &&
        date.isBefore(dateRange.startDate, "day")
      ) {
        setError("End date cannot be before start date.");
        return;
      }
    }
    setError(null);
    onDateChange({ startDate: dateRange.startDate, endDate: date });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {required && (!dateRange.startDate || !dateRange.endDate) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Date selection is required for rooms and packages
          </Alert>
        )}

        {description && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {description}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <DateTimePicker
              label="Start Date & Time"
              value={dateRange.startDate}
              onChange={handleStartDateChange}
              disablePast
              views={
                showTimeSelection
                  ? ["year", "month", "day", "hours", "minutes"]
                  : ["year", "month", "day"]
              }
              ampm={false}
              slotProps={{
                textField: { fullWidth: true, variant: "outlined" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DateTimePicker
              label="End Date & Time"
              value={dateRange.endDate}
              onChange={handleEndDateChange}
              disablePast
              views={
                showTimeSelection
                  ? ["year", "month", "day", "hours", "minutes"]
                  : ["year", "month", "day"]
              }
              ampm={false}
              minDate={dateRange.startDate || dayjs()}
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

          {/* Display selected date and time info */}
          {dateRange.startDate && dateRange.endDate && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Selected period: {dateRange.startDate.format("MMM DD, YYYY")}{" "}
                {showTimeSelection &&
                  `at ${dateRange.startDate.format("HH:mm")}`}{" "}
                - {dateRange.endDate.format("MMM DD, YYYY")}{" "}
                {showTimeSelection && `at ${dateRange.endDate.format("HH:mm")}`}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingDateTimePicker;
