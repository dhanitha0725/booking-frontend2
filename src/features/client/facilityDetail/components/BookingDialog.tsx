import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Facility } from "../../../types/facilityDetails";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  facility: Facility;
  initialCustomerType: string;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  facility,
  initialCustomerType,
}) => {
  const [customerType, setCustomerType] = useState(initialCustomerType);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState("");
  const [eventType, setEventType] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const handleSubmit = () => {
    alert(
      `Booking submitted for ${facility.name} on ${bookingDate?.toDateString()} as ${customerType} customer`
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Book {facility.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="booking-customer-type-label">
              Customer Type
            </InputLabel>
            <Select
              labelId="booking-customer-type-label"
              value={customerType}
              label="Customer Type"
              onChange={(e) => setCustomerType(e.target.value)}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="corporate">Corporate</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Booking Date"
              value={bookingDate}
              onChange={(newValue) => setBookingDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <TextField
            label="Number of Guests"
            type="number"
            fullWidth
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            InputProps={{
              inputProps: {
                min: 1,
                max: Number.parseInt(facility.capacity.split("-")[1]),
              },
            }}
          />
          <TextField
            label="Event Type"
            fullWidth
            select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <MenuItem value="wedding">Wedding</MenuItem>
            <MenuItem value="corporate">Corporate Event</MenuItem>
            <MenuItem value="birthday">Birthday Party</MenuItem>
            <MenuItem value="conference">Conference</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            label="Special Requests"
            multiline
            rows={4}
            fullWidth
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
          <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Pricing Summary ({customerType})
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Base Rate:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {facility.pricing[customerType].weekday}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Setup Fee:</Typography>
              <Typography variant="body2">
                {facility.pricing[customerType].setup}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">Cleaning Fee:</Typography>
              <Typography variant="body2">
                {facility.pricing[customerType].cleaning}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">Total:</Typography>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                {`$${
                  Number.parseInt(
                    facility.pricing[customerType].weekday.replace(/\D/g, "")
                  ) +
                  Number.parseInt(
                    facility.pricing[customerType].setup.replace(/\D/g, "")
                  ) +
                  Number.parseInt(
                    facility.pricing[customerType].cleaning.replace(/\D/g, "")
                  )
                }`}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!bookingDate}
        >
          Book Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
