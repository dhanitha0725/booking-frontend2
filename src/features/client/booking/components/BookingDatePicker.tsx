import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export type CustomerType = "corporate" | "public" | "private";
interface DateRangeType {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
}

interface BookingDatePickerProps {
  dateRange: DateRangeType;
  onDateChange: (range: DateRangeType) => void;
  customerType: CustomerType;
  onCustomerTypeChange: (type: CustomerType) => void;
}

const BookingDatePicker = ({
  dateRange,
  onDateChange,
  customerType,
  onCustomerTypeChange,
}: BookingDatePickerProps) => {
  const [error, setError] = useState("");

  // handle dates changes
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (dateRange.endDate && date && date.isAfter(dateRange.endDate)) {
      setError("Start date cannot be after end date");
      return;
    }

    setError("");
    onDateChange({ ...dateRange, startDate: date });
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (dateRange.startDate && date && date.isBefore(dateRange.startDate)) {
      setError("End date cannot be before start date");
      return;
    }

    setError("");
    onDateChange({ ...dateRange, endDate: date });
  };

  // calculate duration
  const duration =
    dateRange.startDate && dateRange.endDate
      ? dateRange.endDate.diff(dateRange.startDate, "day") + 1
      : 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
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

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {duration > 0 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Duration:{" "}
            <strong>
              {duration} day{duration !== 1 ? "s" : ""}
            </strong>
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default BookingDatePicker;
