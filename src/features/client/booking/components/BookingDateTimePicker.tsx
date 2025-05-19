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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  BookingItemDto,
  PackagesDto,
} from "../../../../types/selectedFacility";
import api from "../../../../services/api";

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

  // Determine if there are any daily packages
  const hasDailyPackageSelected = useMemo(() => {
    return selectedItems.some((item) => {
      if (item.type !== "package") return false;
      const pkg = packages.find((p) => p.packageId === item.itemId);
      // Check if package duration is 1 day or more (contains "day" in the duration string)
      return pkg?.duration?.includes("day") || false;
    });
  }, [selectedItems, packages]);

  // Determine if there are any rooms selected
  const hasRoomSelected = useMemo(() => {
    return selectedItems.some((item) => item.type === "room");
  }, [selectedItems]);

  // Determine if we need to enforce the "end date after start date" rule
  // For daily packages and rooms, end date must be after start date
  // For hourly packages (< 24h), same day selection is allowed
  const requireStrictDateValidation = useMemo(() => {
    return hasRoomSelected || hasDailyPackageSelected;
  }, [hasRoomSelected, hasDailyPackageSelected]);

  // Calculate the minimum allowed date based on current time
  const minAllowedDate = useMemo(() => {
    // Default to today
    const today = dayjs().startOf("day");

    // For rooms, if it's past 8 AM, the earliest available date is tomorrow
    if (hasRoomSelected) {
      const now = dayjs();
      const cutoffTime = today.hour(8).minute(0).second(0); // 8 AM today

      if (now.isAfter(cutoffTime)) {
        // After 8 AM, the minimum date is tomorrow
        return today.add(1, "day");
      }
    }

    return today;
  }, [hasRoomSelected]);

  // Check availability whenever dates or items change
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
        const response = await api.post("/Reservation/checkAvailability", {
          facilityId,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          items: selectedItems,
        });
        console.log("Availability response:", response.data);
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

  // Update dates when room selection changes
  useEffect(() => {
    if (hasRoomSelected && dateRange.startDate) {
      // Check if the current start date is valid for rooms
      const now = dayjs();
      const todayCutoff = dayjs().startOf("day").hour(8).minute(0).second(0); // 8 AM today
      const isPastCutoff = now.isAfter(todayCutoff);
      const isToday = dateRange.startDate.isSame(dayjs(), "day");

      // If it's today but past 8 AM, update to tomorrow
      if (isToday && isPastCutoff) {
        const tomorrow = dayjs()
          .add(1, "day")
          .startOf("day")
          .hour(8)
          .minute(0)
          .second(0);

        // Update start date to tomorrow at 8 AM
        onDateChange({
          startDate: tomorrow,
          endDate: dateRange.endDate
            ? dateRange.endDate.isSame(dateRange.startDate, "day")
              ? tomorrow.add(1, "day")
              : dateRange.endDate
            : null,
        });
      } else if (dateRange.startDate) {
        // Ensure time is set to 8 AM
        const updatedStartDate = dateRange.startDate
          .hour(8)
          .minute(0)
          .second(0);

        if (!updatedStartDate.isSame(dateRange.startDate)) {
          onDateChange({
            startDate: updatedStartDate,
            endDate: dateRange.endDate,
          });
        }
      }
    }
  }, [hasRoomSelected, dateRange.startDate, dateRange.endDate, onDateChange]);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) {
      onDateChange({ startDate: null, endDate: dateRange.endDate });
      return;
    }

    // If end date exists and needs to be validated
    if (dateRange.endDate) {
      // For rooms and daily packages, start date must be before or same as end date
      if (requireStrictDateValidation && date.isAfter(dateRange.endDate)) {
        setError("Start date cannot be after end date.");
        return;
      }
    }

    setError(null);

    // Set appropriate time based on selection type
    let normalizedDate;
    if (hasRoomSelected) {
      // For rooms, set time to 8:00 AM
      normalizedDate = date.hour(8).minute(0).second(0);
    } else {
      // For packages, set time to 00:00
      normalizedDate = date.hour(0).minute(0).second(0);
    }

    onDateChange({
      startDate: normalizedDate,
      endDate: dateRange.endDate,
    });

    // For hourly packages with same-day booking, ensure end date is set to same day if not set
    if (!dateRange.endDate) {
      if (!requireStrictDateValidation) {
        // For hourly packages, same day is fine
        onDateChange({
          startDate: normalizedDate,
          endDate: normalizedDate,
        });
      } else if (hasRoomSelected) {
        // For rooms, automatically set end date to next day at 8 AM
        onDateChange({
          startDate: normalizedDate,
          endDate: normalizedDate.add(1, "day"),
        });
      }
    }
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) {
      onDateChange({ startDate: dateRange.startDate, endDate: null });
      return;
    }

    // If start date exists and needs to be validated
    if (dateRange.startDate) {
      // For rooms and daily packages, end date must be after or same as start date
      if (requireStrictDateValidation && date.isBefore(dateRange.startDate)) {
        setError("End date cannot be before start date.");
        return;
      }
    }

    setError(null);

    // Set appropriate time based on selection type
    let normalizedDate;
    if (hasRoomSelected) {
      // For rooms, set time to 8:00 AM
      normalizedDate = date.hour(8).minute(0).second(0);
    } else {
      // For packages, set time to 00:00
      normalizedDate = date.hour(0).minute(0).second(0);
    }

    onDateChange({
      startDate: dateRange.startDate,
      endDate: normalizedDate,
    });
  };

  // Determine if a date should be disabled
  const shouldDisableDate = (date: dayjs.Dayjs) => {
    // Basic past date check
    if (date.isBefore(dayjs(), "day")) {
      return true;
    }

    // For room bookings, if current time is after 8 AM, disable today
    if (hasRoomSelected && date.isSame(dayjs(), "day")) {
      const now = dayjs();
      const todayCutoff = dayjs().startOf("day").hour(8).minute(0).second(0);
      return now.isAfter(todayCutoff);
    }

    return false;
  };

  // Provide a description message to the user based on the selection
  const getDescriptionMessage = () => {
    if (hasRoomSelected) {
      const now = dayjs();
      const todayCutoff = dayjs().startOf("day").hour(8).minute(0).second(0);
      const isPastCutoff = now.isAfter(todayCutoff);

      if (isPastCutoff) {
        return "For room bookings, check-in time is 8:00 AM. Since it's after 8 AM today, you can only book from tomorrow.";
      }
      return "For room bookings, check-in and check-out time is set to 8:00 AM.";
    }

    if (hasDailyPackageSelected) {
      return "For daily packages, you need to select different dates for multi-day bookings.";
    }

    if (selectedItems.some((item) => item.type === "package")) {
      return "For hourly packages, you can select the same day for start and end dates.";
    }

    return null;
  };

  const descriptionMessage = getDescriptionMessage();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {required && (!dateRange.startDate || !dateRange.endDate) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Date selection is required for rooms and packages
          </Alert>
        )}

        {descriptionMessage && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {descriptionMessage}
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
              shouldDisableDate={shouldDisableDate}
              minDate={minAllowedDate}
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
              minDate={dateRange.startDate || minAllowedDate}
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

          {/* Display selected date info with time for room bookings */}
          {dateRange.startDate && dateRange.endDate && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Selected period: {dateRange.startDate.format("MMM DD, YYYY")}
                {hasRoomSelected ? ` at 8:00 AM` : ""} -{" "}
                {dateRange.endDate.format("MMM DD, YYYY")}
                {hasRoomSelected ? ` at 8:00 AM` : ""}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingDateTimePicker;
