import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SignInPromptModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInPromptModal: React.FC<SignInPromptModalProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign In Required</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          You need to sign in to reserve a facility. Please sign in to continue.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSignIn} variant="contained" color="primary">
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignInPromptModal;
