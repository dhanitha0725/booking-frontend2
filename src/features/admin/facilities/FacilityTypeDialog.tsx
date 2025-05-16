import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Box,
  Snackbar,
} from "@mui/material";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../services/api";
import { AxiosError } from "axios";

// Validation schema
const facilityTypeSchema = z.object({
  typeName: z
    .string()
    .min(1, "Type name is required")
    .max(50, "Type name cannot exceed 50 characters"),
});

type FacilityTypeFormData = z.infer<typeof facilityTypeSchema>;

interface BackendError {
  message?: string;
  error?:
    | string
    | {
        message?: string;
      };
}

interface FacilityTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (typeName: string) => void;
}

const FacilityTypeDialog: React.FC<FacilityTypeDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacilityTypeFormData>({
    resolver: zodResolver(facilityTypeSchema),
    defaultValues: {
      typeName: "",
    },
  });

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      reset();
      setError(null);
    }
  }, [open, reset]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: FacilityTypeFormData) => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/Facility/new-facility-type", {
        typeName: data.typeName,
      });

      onSuccess(data.typeName);
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding facility type:", error);

      const err = error as AxiosError<BackendError>;

      // Handle various error response structures
      let errorMessage = "Failed to add facility type. Please try again.";

      if (err.response?.data) {
        if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error;
        } else if (err.response.data.error?.message) {
          errorMessage = err.response.data.error.message;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      // Set the error for inline display
      setError(errorMessage);

      // Show in the snackbar
      setSnackbar({
        open: true,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add New Facility Type</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Controller
                name="typeName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    label="Type Name"
                    fullWidth
                    placeholder="e.g., Conference Room, Auditorium, Lecture Hall"
                    error={!!errors.typeName}
                    helperText={errors.typeName?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Adding..." : "Add Type"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for error messages positioned on the left side */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FacilityTypeDialog;
