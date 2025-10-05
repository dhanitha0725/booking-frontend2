import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Alert,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { BookingItemDto, PackagesDto } from "../../../../types/selectedFacility";
import api from "../../../../services/api";

export type CustomerType = "corporate" | "public" | "private";

export interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

interface PackageDateTimePickerProps {
  selectedDateTime: Dayjs | null;
  onDateTimeChange: (dateTime: Dayjs | null) => void;
  customerType: CustomerType;
  onCustomerTypeChange: (type: CustomerType) => void;
  required?: boolean;
  facilityId?: number;
  selectedItems: BookingItemDto[];
  onAvailabilityChange: (availabilityResponse: AvailabilityResponseDto) => void;
  packages: PackagesDto[]; // added
}

const PackageDateTimePicker = ({
  selectedDateTime,
  onDateTimeChange,
  customerType,
  onCustomerTypeChange,
  required = false,
  facilityId,
  selectedItems,
  onAvailabilityChange,
  packages, // added
}: PackageDateTimePickerProps) => {
  const [error, setError] = useState<string | null>(null);

  const parseDurationToHours = (duration: string | number | undefined) => {
    if (duration == null) return 0;
    if (typeof duration === "number") return duration;
    // duration strings examples: "4 hours", "1 day", "1 day 4 hours"
    const dayMatch = duration.match(/(\d+)\s*day/);
    const hourMatch = duration.match(/(\d+)\s*hour/);
    const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    if (days || hours) return days * 24 + hours;
    // fallback: first number assume hours
    const numMatch = duration.match(/(\d+)/);
    return numMatch ? parseInt(numMatch[1], 10) : 0;
  };

  // Check availability when datetime changes
  const checkAvailability = useCallback(
    async (
      startDateTime: Dayjs | null,
      items: BookingItemDto[],
      facilityId: number | undefined
    ) => {
      if (!startDateTime || items.length === 0 || !facilityId) {
        onAvailabilityChange({ isAvailable: false, message: "" });
        return;
      }

      // compute endDateTime by finding package duration (for hourly packages)
      let endDateTime = startDateTime;
      const pkgItem = items.find((it) => it.type === "package");
      if (pkgItem) {
        const pkg = packages.find((p) => p.packageId === pkgItem.itemId);
        const hrs = pkg ? parseDurationToHours(pkg.duration) : 0;
        if (hrs > 0) {
          endDateTime = startDateTime.add(hrs, "hour");
        }
      }

      try {
        const response = await api.post("/Reservation/checkAvailability", {
          facilityId,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(), // now calculated correctly
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
    [onAvailabilityChange, packages]
  );

  // Debounced availability check
  const debouncedCheckAvailability = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (
        startDateTime: Dayjs | null,
        items: BookingItemDto[],
        facilityId: number | undefined
      ) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          checkAvailability(startDateTime, items, facilityId);
        }, 300);
      };
    })(),
    [checkAvailability]
  );

  // Effect to check availability when datetime or items change
  useEffect(() => {
    debouncedCheckAvailability(selectedDateTime, selectedItems, facilityId);
  }, [
    selectedDateTime?.toISOString(),
    selectedItems,
    facilityId,
    debouncedCheckAvailability,
  ]);

  const handleDateTimeChange = (newValue: Dayjs | null) => {
    if (!newValue && required) {
      setError("Please select a date and time.");
    } else {
      setError(null);
    }
    onDateTimeChange(newValue);
  };

  // Disable past dates and times
  const shouldDisableDate = (date: Dayjs) => {
    return date.isBefore(dayjs(), "day");
  };

  const shouldDisableTime = (value: Dayjs, view: string) => {
    if (!value) return false;

    // If it's today, disable past hours
    if (value.isSame(dayjs(), "day")) {
      const now = dayjs();
      if (view === "hours") {
        return value.hour() <= now.hour();
      }
      if (view === "minutes") {
        return value.hour() === now.hour() && value.minute() <= now.minute();
      }
    }
    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {required && !selectedDateTime && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please select a date and time for your event booking.
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Select the specific date and time when you want to start your event.
          The booking duration will be automatically calculated based on your
          selected package.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Select Date & Time
              </Typography>
              <StaticDateTimePicker
                value={selectedDateTime}
                onChange={handleDateTimeChange}
                disablePast
                shouldDisableDate={shouldDisableDate}
                shouldDisableTime={shouldDisableTime}
                ampm
                views={["year", "month", "day", "hours", "minutes"]}
                slotProps={{
                  actionBar: {
                    actions: ["clear", "today"],
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
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

export default PackageDateTimePicker;
