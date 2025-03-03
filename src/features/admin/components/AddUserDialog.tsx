import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="First Name" fullWidth />
        <TextField margin="dense" label="Last Name" fullWidth />
        <TextField margin="dense" label="Email" fullWidth />
        <TextField margin="dense" label="Phone Number" fullWidth />
        <TextField margin="dense" label="Role" fullWidth />
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

export default AddUserDialog;
