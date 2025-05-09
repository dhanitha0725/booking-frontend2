import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { ErrorOutline, WarningAmber } from "@mui/icons-material";

interface UnavailabilityWarningDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const UnavailabilityWarningDialog = ({
  open,
  onClose,
  message,
}: UnavailabilityWarningDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", color: "error.main" }}
      >
        <ErrorOutline color="error" sx={{ mr: 1 }} /> Availability Issue
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <WarningAmber color="warning" sx={{ mr: 1, mt: 0.5 }} />
          <Typography variant="body1" color="text.primary">
            {message ||
              "Some of the selected items are not available for the chosen dates."}
          </Typography>
        </Box>
        <DialogContentText sx={{ mt: 2 }}>
          You have two options:
        </DialogContentText>
        <Box component="ul" sx={{ mt: 1 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body2">
              Try different dates for your booking
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body2">
              Adjust your room or package selection
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          Adjust My Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnavailabilityWarningDialog;
