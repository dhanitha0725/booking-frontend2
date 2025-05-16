import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../../services/api";
import { AxiosError } from "axios";

// Backend error response interface
interface BackendError {
  message?: string;
  error?: {
    message?: string;
  };
}

// Props for the dialog component
interface AddPackageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facilities: { id: number; name: string }[];
}

// Validation schema for package form
const packageSchema = z.object({
  facilityId: z.number().min(1, "Please select a facility"),
  packageName: z
    .string()
    .min(3, "Package name must be at least 3 characters")
    .max(100),
  duration: z.string().min(1, "Duration is required"),
  publicPrice: z.number().min(0, "Price cannot be negative"),
  corporatePrice: z.number().min(0, "Price cannot be negative"),
  privatePrice: z.number().min(0, "Price cannot be negative"),
});

type PackageFormData = z.infer<typeof packageSchema>;

const AddPackageDialog: React.FC<AddPackageDialogProps> = ({
  open,
  onClose,
  onSuccess,
  facilities,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      facilityId: 0,
      packageName: "",
      duration: "",
      publicPrice: 0,
      corporatePrice: 0,
      privatePrice: 0,
    },
  });

  // Reset form when dialog is opened or closed
  React.useEffect(() => {
    if (!open) {
      reset();
      setError(null);
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<PackageFormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Format payload according to API requirements
      const payload = {
        packageName: data.packageName,
        duration: data.duration,
        pricings: {
          public: data.publicPrice,
          corporate: data.corporatePrice,
          private: data.privatePrice,
        },
      };

      await api.post(`/Package/${data.facilityId}/packages`, payload);
      onSuccess();
      reset();
    } catch (error) {
      console.error("Error adding package:", error);

      // Extract error message from various possible formats
      const err = error as AxiosError<BackendError>;
      let errorMessage = "Failed to add package. Please try again.";

      if (err.response?.data) {
        if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error;
        } else if (err.response.data.error?.message) {
          errorMessage = err.response.data.error.message;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add New Package</DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="facilityId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.facilityId}>
                    <InputLabel id="facility-select-label">Facility</InputLabel>
                    <Select
                      labelId="facility-select-label"
                      label="Facility"
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem value={0} disabled>
                        Select a facility
                      </MenuItem>
                      {facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.facilityId && (
                      <Typography color="error" variant="caption">
                        {errors.facilityId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Controller
                name="packageName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Package Name"
                    fullWidth
                    error={!!errors.packageName}
                    helperText={errors.packageName?.message}
                    placeholder="e.g., Weekend Special, Full Day Conference"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Duration"
                    fullWidth
                    error={!!errors.duration}
                    helperText={
                      errors.duration?.message ||
                      "e.g., 2 hours, 1 day, 3 nights"
                    }
                    placeholder="e.g., 2:00:00 for 2 hours"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Pricing Information
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="publicPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Public Price"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.publicPrice}
                    helperText={errors.publicPrice?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs.</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="corporatePrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Corporate Price"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.corporatePrice}
                    helperText={errors.corporatePrice?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs.</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="privatePrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Private Price"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.privatePrice}
                    helperText={errors.privatePrice?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs.</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Adding..." : "Add Package"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPackageDialog;
