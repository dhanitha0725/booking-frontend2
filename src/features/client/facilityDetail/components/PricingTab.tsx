import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { Event } from "@mui/icons-material";
import { Facility } from "../../../types/facilityDetails";

type CustomerType = "public" | "private" | "corporate";
interface PricingTabProps {
  facility: Facility;
  customerType: CustomerType;
  onCustomerTypeChange: (event: SelectChangeEvent<CustomerType>) => void;
  onBookNow: () => void;
}

const PricingTab: React.FC<PricingTabProps> = ({
  facility,
  customerType,
  onCustomerTypeChange,
  onBookNow,
}) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ maxWidth: 300, mb: 2 }}>
          <InputLabel id="customer-type-label">Customer Type</InputLabel>
          <Select
            labelId="customer-type-label"
            value={customerType}
            label="Customer Type"
            onChange={onCustomerTypeChange}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="corporate">Corporate</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {customerType === "public" &&
            "Standard rates for public events and general bookings."}
          {customerType === "private" &&
            "Discounted rates for private individuals and small gatherings."}
          {customerType === "corporate" &&
            "Premium rates for corporate events with additional services."}
        </Typography>
      </Box>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Rate Type
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Weekday (Mon-Thu)</TableCell>
              <TableCell align="right">
                {facility.pricing[customerType].weekday}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Weekend (Fri-Sun)</TableCell>
              <TableCell align="right">
                {facility.pricing[customerType].weekend}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hourly Rate</TableCell>
              <TableCell align="right">
                {facility.pricing[customerType].hourly}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Setup Fee</TableCell>
              <TableCell align="right">
                {facility.pricing[customerType].setup}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cleaning Fee</TableCell>
              <TableCell align="right">
                {facility.pricing[customerType].cleaning}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onBookNow}
          startIcon={<Event />}
        >
          Book Now
        </Button>
      </Box>
    </>
  );
};

export default PricingTab;
