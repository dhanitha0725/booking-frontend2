import React from "react";
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
import dayjs, { Dayjs } from "dayjs";
import { CustomerType } from "../../../../types/employeeReservation";

interface DateSelectionStepProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  onDateChange: (dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }) => void;
  customerType: CustomerType;
  onCustomerTypeChange: (type: CustomerType) => void;
  requiresDates: boolean;
  error: string | null;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  dateRange,
  onDateChange,
  customerType,
  onCustomerTypeChange,
  requiresDates,
  error,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        {requiresDates && (!dateRange.startDate || !dateRange.endDate) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Date selection is required for this facility
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
              onChange={(date) =>
                onDateChange({ ...dateRange, startDate: date })
              }
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
              onChange={(date) => onDateChange({ ...dateRange, endDate: date })}
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

export default DateSelectionStep;
