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
import api from "../../../services/api";
import { AxiosError } from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  packageSchema,
  PackageFormData,
  formatTimeToString,
} from "../../../validations/pricingValidation";

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
      duration: dayjs().hour(1).minute(0).second(0), // Default to 1 hour
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
      // Convert the dayjs duration to the expected string format
      const durationString = formatTimeToString(data.duration);

      const payload = {
        packageName: data.packageName,
        duration: durationString,
        pricings: {
          public: data.publicPrice,
          corporate: data.corporatePrice,
          private: data.privatePrice,
        },
      };

      console.log("Adding package:", payload);
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

  // Rest of the component remains unchanged
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      {/* Dialog content remains unchanged */}
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
              <Typography variant="body2" sx={{ mb: 1 }}>
                Duration (hours)
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => {
                    // Calculate display hour - special case for 24 hours which is stored as day+1 hour 0
                    // Add null checks using optional chaining operator
                    const displayHour =
                      field.value?.date &&
                      field.value?.hour &&
                      field.value.date() > 1 &&
                      field.value.hour() === 0
                        ? 24
                        : field.value?.hour?.() || 1;

                    return (
                      <FormControl fullWidth>
                        <Select
                          value={displayHour}
                          onChange={(e) => {
                            const hours = Number(e.target.value);

                            // For 24 hours (1 day), create a special representation
                            if (hours === 24) {
                              // Use a date offset to represent 24 hours as "next day at midnight"
                              field.onChange(
                                dayjs().date(2).hour(0).minute(0).second(0)
                              );
                            } else {
                              // For normal hours, just set the hours directly
                              field.onChange(
                                dayjs().date(1).hour(hours).minute(0).second(0)
                              );
                            }
                          }}
                          displayEmpty
                          sx={{ width: "100%" }}
                        >
                          {[...Array(24)].map((_, i) => {
                            const hours = i + 1; // 1 to 24 hours
                            return (
                              <MenuItem key={hours} value={hours}>
                                {hours} {hours === 1 ? "hour" : "hours"}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    );
                  }}
                />
              </LocalizationProvider>
              <Typography variant="caption" color="text.secondary">
                Select duration in hours (1-24 hours)
              </Typography>
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
                    onFocus={() => {
                      if (field.value === 0) {
                        field.onChange("");
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        field.onChange(0);
                      }
                    }}
                    value={field.value}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? "" : Number(e.target.value);
                      field.onChange(value);
                    }}
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
                    onFocus={() => {
                      if (field.value === 0) {
                        field.onChange("");
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        field.onChange(0);
                      }
                    }}
                    value={field.value}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? "" : Number(e.target.value);
                      field.onChange(value);
                    }}
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
                    onFocus={() => {
                      if (field.value === 0) {
                        field.onChange("");
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        field.onChange(0);
                      }
                    }}
                    value={field.value}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? "" : Number(e.target.value);
                      field.onChange(value);
                    }}
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
