import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Grid, Paper, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface BookingDetailsFormProps {
  values: {
    date: Date | null;
    startTime: Date | null;
    endTime: Date | null;
    customerType: string;
  };
  errors: Record<string, string>;
  facilityCapacity: string;
  onFieldChange: (field: string, value: Date | null | string) => void;
}

const BookingDetailsForm = ({
  values,
  errors,
  onFieldChange,
}: BookingDetailsFormProps) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Booking Details
      </Typography>
      <Grid container spacing={3}>
        {/* date and time pickers */}
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Booking Date"
              value={values.date}
              onChange={(date) => onFieldChange("date", date)}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookingDetailsForm;
