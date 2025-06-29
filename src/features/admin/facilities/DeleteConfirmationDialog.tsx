import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  facilityId: number | null;
}

// DeleteConfirmationDialog component for confirming facility deletion
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  loading,
  onClose,
  onConfirm,
  facilityId,
}) => {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          {facilityId ? `facility #${facilityId}` : "this facility"}? This
          action cannot be undone.
        </DialogContentText>

        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body2" color="error">
            <strong>Warning:</strong> If this facility has child facilities, you
            must delete them first.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
