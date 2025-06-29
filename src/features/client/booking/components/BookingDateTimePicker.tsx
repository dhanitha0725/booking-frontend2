import { useState, useEffect, useMemo, useCallback } from "react";
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
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  BookingItemDto,
  PackagesDto,
} from "../../../../types/selectedFacility";
import api from "../../../../services/api";

// Extend dayjs with plugins for date comparison
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Define the types for the booking items and packages
export interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

// Define the customer types
export type CustomerType = "corporate" | "public" | "private";

// Define the date range type
interface DateRangeType {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

// Define the booking date time picker properties
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

  // Check if any daily package is selected
  const hasDailyPackageSelected = useMemo(() => {
    return selectedItems.some((item) => {
      if (item.type !== "package") return false;
      const pkg = packages.find((p) => p.packageId === item.itemId);
      if (!pkg) return false;

      // Handle different duration formats
      if (typeof pkg.duration === "number") {
        return pkg.duration >= 24;
      } else if (typeof pkg.duration === "string") {
        return pkg.duration.includes("day");
      }
      return false;
    });
  }, [selectedItems, packages]);

  // Check if any room is selected
  const hasRoomSelected = useMemo(() => {
    return selectedItems.some((item) => item.type === "room");
  }, [selectedItems]);

  // Only apply strict date validation for rooms, not for packages
  const requireStrictDateValidation = useMemo(() => {
    return hasRoomSelected;
  }, [hasRoomSelected]);

  // Calculate the minimum allowed date based on whether a room is selected
  const minAllowedDate = useMemo(() => {
    const today = dayjs().startOf("day");
    if (hasRoomSelected) {
      const now = dayjs();
      const cutoffTime = today.hour(8).minute(0).second(0);
      if (now.isAfter(cutoffTime)) {
        return today.add(1, "day");
      }
    }
    return today;
  }, [hasRoomSelected]);

  // Function to check availability of selected items
  const checkAvailability = useCallback(
    async (
      startDate: dayjs.Dayjs | null,
      endDate: dayjs.Dayjs | null,
      items: BookingItemDto[],
      facilityId: number | undefined
    ) => {
      if (!startDate || !endDate || items.length === 0 || !facilityId) {
        onAvailabilityChange({ isAvailable: false, message: "" });
        return;
      }

      try {
        // check availability via API
        const response = await api.post("/Reservation/checkAvailability", {
          facilityId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          items,
        });
        onAvailabilityChange(response.data);
      } catch (error) {
        console.error("Error checking availability:", error);
        setError("An error occurred while checking availability.");
        onAvailabilityChange({
          isAvailable: false,
          message: "Error checking availability",
        });
      }
    },
    [onAvailabilityChange]
  );

  // Debounced function to check availability after date changes
  const debouncedCheckAvailability = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (
        startDate: dayjs.Dayjs | null,
        endDate: dayjs.Dayjs | null,
        items: BookingItemDto[],
        facilityId: number | undefined
      ) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          checkAvailability(startDate, endDate, items, facilityId);
        }, 300);
      };
    })(),
    [checkAvailability]
  );

  // Effect to check availability whenever the date range or selected items change
  useEffect(() => {
    debouncedCheckAvailability(
      dateRange.startDate,
      dateRange.endDate,
      selectedItems,
      facilityId
    );
    return () => clearTimeout(undefined);
  }, [
    dateRange.startDate?.toISOString(),
    dateRange.endDate?.toISOString(),
    selectedItems,
    facilityId,
    debouncedCheckAvailability,
  ]);

  // Effect to normalize start and end dates to 8:00 AM for rooms
  useEffect(() => {
    if (!hasRoomSelected) return;

    const now = dayjs();
    const todayCutoff = dayjs().startOf("day").hour(8).minute(0).second(0);
    const isPastCutoff = now.isAfter(todayCutoff);
    let newStartDate = dateRange.startDate;
    let newEndDate = dateRange.endDate;

    if (dateRange.startDate) {
      const isToday = dateRange.startDate.isSame(dayjs(), "day");
      if (isToday && isPastCutoff) {
        newStartDate = dayjs()
          .add(1, "day")
          .startOf("day")
          .hour(8)
          .minute(0)
          .second(0);
      } else {
        const updatedStartDate = dateRange.startDate
          .hour(8)
          .minute(0)
          .second(0);
        if (!updatedStartDate.isSame(dateRange.startDate)) {
          newStartDate = updatedStartDate;
        }
      }
    }

    if (dateRange.endDate) {
      const updatedEndDate = dateRange.endDate.hour(8).minute(0).second(0);
      if (!updatedEndDate.isSame(dateRange.endDate)) {
        newEndDate = updatedEndDate;
      }
    }

    if (
      newStartDate !== dateRange.startDate ||
      newEndDate !== dateRange.endDate
    ) {
      onDateChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  }, [hasRoomSelected, dateRange.startDate, dateRange.endDate, onDateChange]);

  // Handlers for start and end date changes
  // These handlers normalize the dates to 8:00 AM for rooms and handle validation
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) {
      onDateChange({ startDate: null, endDate: dateRange.endDate });
      return;
    }

    if (dateRange.endDate) {
      // Only apply this validation for rooms, not packages
      if (hasRoomSelected && date.isAfter(dateRange.endDate)) {
        setError("Start date cannot be after end date.");
        return;
      }

      // For rooms, ensure end date is at least one day after start date
      if (hasRoomSelected && date.isSame(dateRange.endDate, "day")) {
        const normalizedDate = date.hour(8).minute(0).second(0);
        onDateChange({
          startDate: normalizedDate,
          endDate: normalizedDate.add(1, "day").hour(8).minute(0).second(0),
        });
        return;
      }
    }

    setError(null);

    const normalizedDate = hasRoomSelected
      ? date.hour(8).minute(0).second(0)
      : date.hour(0).minute(0).second(0);

    onDateChange({
      startDate: normalizedDate,
      endDate: dateRange.endDate,
    });
  };

  // Handler for end date changes
  // This handler ensures the end date is at least one day after the start date for rooms
  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) {
      onDateChange({ startDate: dateRange.startDate, endDate: null });
      return;
    }

    if (dateRange.startDate) {
      // Apply room-specific validation only for room bookings
      if (hasRoomSelected && date.isSame(dateRange.startDate, "day")) {
        setError(
          "For room bookings, check-out date must be at least one day after check-in date."
        );
        return;
      } else if (
        requireStrictDateValidation &&
        date.isBefore(dateRange.startDate)
      ) {
        setError("End date cannot be before start date.");
        return;
      }
    } else {
      setError("Please select a start date first.");
      return;
    }

    setError(null);

    const normalizedDate = hasRoomSelected
      ? date.hour(8).minute(0).second(0)
      : date.hour(0).minute(0).second(0);

    onDateChange({
      startDate: dateRange.startDate,
      endDate: normalizedDate,
    });
  };

  // Function to determine if a date should be disabled
  // This function disables past dates and today's date after 8:00 AM for room bookings
  const shouldDisableDate = (date: dayjs.Dayjs) => {
    if (date.isBefore(dayjs(), "day")) {
      return true;
    }
    if (hasRoomSelected && date.isSame(dayjs(), "day")) {
      const now = dayjs();
      const todayCutoff = dayjs().startOf("day").hour(8).minute(0).second(0);
      return now.isAfter(todayCutoff);
    }
    return false;
  };

  // Function to get the minimum end date based on the start date
  // For room bookings, it ensures the end date is at least one day after the start
  const getMinEndDate = () => {
    if (hasRoomSelected && dateRange.startDate) {
      return dateRange.startDate.add(1, "day");
    }
    return dateRange.startDate || minAllowedDate;
  };

  // Function to validate the date selection
  // This function checks if the start and end dates are selected and validates them based on the booking type
  // For room bookings, it ensures the end date is at least one day after the start date
  const validateDateSelection = () => {
    if (!dateRange.startDate) {
      return "Please select a start date";
    }
    if (!dateRange.endDate) {
      return "Please select an end date";
    }

    // For room bookings, require at least one day between dates
    if (
      hasRoomSelected &&
      !dateRange.endDate.isAfter(dateRange.startDate, "day")
    ) {
      return "For room bookings, check-out date must be at least one day after check-in date.";
    }

    // For daily packages, allow same-day reservations
    if (!hasRoomSelected && dateRange.endDate.isBefore(dateRange.startDate)) {
      return "End date cannot be before start date.";
    }

    return null;
  };

  // Function to get the description message based on the booking type
  const getDescriptionMessage = () => {
    if (hasRoomSelected) {
      const now = dayjs();
      const todayCutoff = dayjs().startOf("day").hour(8).minute(0).second(0);
      const isPastCutoff = now.isAfter(todayCutoff);
      if (isPastCutoff) {
        return "For room bookings, check-in time is 8:00 AM. Since it's after 8 AM today, you can only book from tomorrow. Room bookings require at least one night stay.";
      }
      return "For room bookings, check-in and check-out time is set to 8:00 AM. Room bookings require at least one night stay.";
    }
    if (hasDailyPackageSelected) {
      return "For daily packages, you can select the same day for start and end dates.";
    }
    if (selectedItems.some((item) => item.type === "package")) {
      return "For hourly packages, you can select the same day for start and end dates.";
    }
    return null;
  };

  const descriptionMessage = getDescriptionMessage();
  const validationError = validateDateSelection();

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
              minDate={getMinEndDate()}
              shouldDisableDate={
                hasRoomSelected
                  ? (date) =>
                      shouldDisableDate(date) ||
                      (dateRange.startDate
                        ? date.isSame(dateRange.startDate, "day")
                        : false)
                  : shouldDisableDate
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  error:
                    !!validationError &&
                    !!dateRange.startDate &&
                    !dateRange.endDate,
                  helperText:
                    dateRange.startDate && !dateRange.endDate
                      ? "Please select an end date"
                      : "",
                },
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

export default BookingDateTimePicker;
