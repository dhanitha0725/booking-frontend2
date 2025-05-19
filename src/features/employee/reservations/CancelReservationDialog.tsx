import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

interface CancelReservationDialogProps {
  open: boolean;
  loading: boolean;
  reservationId: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelReservationDialog: React.FC<CancelReservationDialogProps> = ({
  open,
  loading,
  reservationId,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="cancel-reservation-dialog-title"
    >
      <DialogTitle id="cancel-reservation-dialog-title">
        Confirm Cancellation
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel Reservation Id.{reservationId}? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          No, Keep Reservation
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? "Cancelling..." : "Yes, Cancel Reservation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelReservationDialog;
