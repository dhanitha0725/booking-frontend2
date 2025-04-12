import { useState } from "react";
import {
  Box,
  Grid,
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
  required: boolean;
}

const BookingDatePicker = ({
  dateRange,
  onDateChange,
  customerType,
  onCustomerTypeChange,
  required,
}: BookingDatePickerProps) => {
  const [error, setError] = useState<string | null>(null);

  // handle dates changes
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date && dateRange.endDate && date.isAfter(dateRange.endDate)) {
      setError("Start date cannot be after end date.");
    } else {
      setError(null);
    }
    onDateChange({ ...dateRange, startDate: date });
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date && dateRange.startDate && !date.isAfter(dateRange.startDate)) {
      setError("End date must be after the start date.");
    } else {
      setError(null);
    }
    onDateChange({ ...dateRange, endDate: date });
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
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingDatePicker;
