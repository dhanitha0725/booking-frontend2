import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface AddFacilityDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddFacilityDialog: React.FC<AddFacilityDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Facility</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Facility Name" fullWidth />
        <TextField margin="dense" label="Status" fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFacilityDialog;
