import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Stack,
} from "@mui/material";
import { ExpandMore, ExpandLess, Upload } from "@mui/icons-material";
import { format } from "date-fns";
import { CustomerType } from "./customerTypes";

interface Package {
  id: string;
  name: string;
  pricing: {
    [key: string]: number;
  };
}

interface Room {
  id: string;
  name: string;
  pricing: {
    [key: string]: number;
  };
}
interface Facility {
  name: string;
  hasPackages: boolean;
  packages: Package[];
  hasRooms: boolean;
  rooms: Room[];
}

const BookingSummary = ({
  facility,
  customerType,
  dateRange,
  selectedPackages,
  selectedRooms,
  duration,
}: {
  facility: Facility;
  customerType: CustomerType;
  dateRange: { startDate: Date; endDate: Date };
  selectedPackages: string[];
  selectedRooms: string[];
  duration: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [documentUploaded, setDocumentUploaded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
    setPaymentMethod(event.target.value);
  };

  // Calculate selected packages total
  const areDatesSelected = dateRange.startDate && dateRange.endDate;

  // Check if any items are selected
  const hasSelections = selectedPackages.length > 0 || selectedRooms.length > 0;

  // Validate selected IDs against available options
  const isValidSelection = () => {
    const validPackageIds = facility.hasPackages
      ? facility.packages.map((pkg) => pkg.id)
      : [];
    const validRoomIds = facility.hasRooms
      ? facility.rooms.map((room) => room.id)
      : [];

    return (
      selectedPackages.every((id) => validPackageIds.includes(id)) &&
      selectedRooms.every((id) => validRoomIds.includes(id))
    );
  };
  // Calculate selected packages total
  const calculatePackagesTotal = () => {
    if (!facility.hasPackages || selectedPackages.length === 0) return 0;

    return facility.packages
      .filter((pkg) => selectedPackages.includes(pkg.id))
      .reduce((total, pkg) => {
        const price = pkg.pricing[customerType] || 0;
        return total + price * duration;
      }, 0);
  };

  // Calculate selected rooms total
  const calculateRoomsTotal = () => {
    if (!facility.hasRooms || selectedRooms.length === 0) return 0;

    return facility.rooms
      .filter((room) => selectedRooms.includes(room.id))
      .reduce((total, room) => {
        const price = room.pricing[customerType] || 0;
        return total + price * duration;
      }, 0);
  };

  // Calculate grand total, only if selections are valid
  const calculateTotal = () => {
    return isValidSelection()
      ? calculatePackagesTotal() + calculateRoomsTotal()
      : 0;
  };
  const isValid = areDatesSelected && hasSelections && isValidSelection();

  return (
    <Box>
      {!isValid && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {(!areDatesSelected && "Please select start and end dates.") ||
            (!hasSelections && "Please select at least one package or room.") ||
            (!isValidSelection() &&
              "Invalid package or room selection. Please review your choices.")}
        </Alert>
      )}

      {isValid && (
        <>
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Booking Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Facility" secondary={facility.name} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Customer Type"
                  secondary={
                    customerType.charAt(0).toUpperCase() + customerType.slice(1)
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Dates"
                  secondary={`${format(
                    dateRange.startDate,
                    "MMM dd, yyyy"
                  )} - ${format(dateRange.endDate, "MMM dd, yyyy")}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Duration"
                  secondary={`${duration} day${duration !== 1 ? "s" : ""}`}
                />
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Items
            </Typography>

            {facility.hasPackages && selectedPackages.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Packages:
                </Typography>
                <List dense>
                  {facility.packages
                    .filter((pkg) => selectedPackages.includes(pkg.id))
                    .map((pkg) => (
                      <ListItem key={pkg.id}>
                        <ListItemText
                          primary={pkg.name}
                          secondary={`$${
                            pkg.pricing[customerType] || 0
                          } × ${duration} day${duration !== 1 ? "s" : ""}`}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          ${(pkg.pricing[customerType] || 0) * duration}
                        </Typography>
                      </ListItem>
                    ))}
                </List>
              </>
            )}

            {facility.hasRooms && selectedRooms.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Rooms:
                </Typography>
                <List dense>
                  {facility.rooms
                    .filter((room) => selectedRooms.includes(room.id))
                    .map((room) => (
                      <ListItem key={room.id}>
                        <ListItemText
                          primary={room.name}
                          secondary={`$${
                            room.pricing[customerType] || 0
                          } × ${duration} day${duration !== 1 ? "s" : ""}`}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          ${(room.pricing[customerType] || 0) * duration}
                        </Typography>
                      </ListItem>
                    ))}
                </List>
              </>
            )}

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
            >
              <Typography variant="subtitle1">Total</Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary.main"
              >
                ${calculateTotal()}
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Additional Options</Typography>
              <Button
                size="small"
                onClick={toggleExpand}
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              >
                {expanded ? "Hide" : "Show"}
              </Button>
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="payment-method-label">
                    Payment Method
                  </InputLabel>
                  <Select
                    labelId="payment-method-label"
                    value={paymentMethod}
                    label="Payment Method"
                    onChange={handlePaymentMethodChange}
                  >
                    <MenuItem value="online">Online Payment</MenuItem>
                    <MenuItem value="bank">Bank Transfer</MenuItem>
                    <MenuItem value="inperson">Pay in Person</MenuItem>
                  </Select>
                </FormControl>

                {(customerType === "corporate" ||
                  customerType === "private") && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Required Documents
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {customerType === "corporate"
                        ? "Corporate bookings require a company authorization letter."
                        : "Private bookings require ID verification."}
                    </Alert>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<Upload />}
                        onChange={() => setDocumentUploaded(true)}
                      >
                        <span style={{ display: "none" }}>Upload Document</span>
                        <input type="file" hidden id="upload-document-label" />
                      </Button>

                      {documentUploaded && (
                        <Typography variant="body2" color="success.main">
                          Document uploaded successfully
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}

                <TextField
                  label="Special Requests"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Any special requirements or requests for your booking..."
                  sx={{ mb: 2 }}
                />
              </Box>
            </Collapse>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default BookingSummary;
