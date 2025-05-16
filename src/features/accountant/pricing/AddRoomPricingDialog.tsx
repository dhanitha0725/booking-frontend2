import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../services/api";
import { AxiosError } from "axios";
import { RoomType } from "../../../types/roomTypes";
import {
  roomPricingSchema,
  RoomPricingFormData,
} from "../../../validations/pricingValidation";

// Backend error response interface
interface BackendError {
  message?: string;
  error?: {
    message?: string;
  };
}

// Props for the dialog component
interface AddRoomPricingDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  facilities: { id: number; name: string }[];
}

const AddRoomPricingDialog: React.FC<AddRoomPricingDialogProps> = ({
  open,
  onClose,
  onSuccess,
  facilities,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomPricingFormData>({
    resolver: zodResolver(roomPricingSchema),
    defaultValues: {
      facilityId: 0,
      roomTypeId: 0,
      publicPrice: 0,
      corporatePrice: 0,
      privatePrice: 0,
    },
  });

  // Reset form when dialog is opened or closed
  useEffect(() => {
    if (!open) {
      reset();
      setError(null);
      setRoomTypes([]);
    }
  }, [open, reset]);

  // Fetch room types independent of selected facility
  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!open) return;

      setLoadingRoomTypes(true);
      try {
        const response = await api.get("/facilities/rooms/get-room-types");
        if (response.data && response.data.roomTypes) {
          setRoomTypes(response.data.roomTypes);
        } else {
          setRoomTypes([]);
          setError("Invalid room types data format returned from server");
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
        setError("Failed to load room types");
        setRoomTypes([]);
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, [open]);

  const onSubmit: SubmitHandler<RoomPricingFormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Format payload according to API requirements
      const payload = {
        facilityId: data.facilityId,
        roomTypeId: data.roomTypeId,
        pricings: {
          public: data.publicPrice,
          private: data.privatePrice,
          corporate: data.corporatePrice,
        },
      };

      // Use the correct API endpoint for setting room pricing
      await api.post("/facilities/rooms/set-room-pricing", payload);
      onSuccess();
      reset();
    } catch (error) {
      console.error("Error adding room pricing:", error);

      // Extract error message from various possible formats
      const err = error as AxiosError<BackendError>;
      let errorMessage = "Failed to add room pricing. Please try again.";

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
        <DialogTitle>Add Room Pricing</DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <Controller
                name="roomTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.roomTypeId}
                    disabled={loadingRoomTypes}
                  >
                    <InputLabel id="room-type-select-label">
                      Room Type
                    </InputLabel>
                    <Select
                      labelId="room-type-select-label"
                      label="Room Type"
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem value={0} disabled>
                        {loadingRoomTypes
                          ? "Loading room types..."
                          : "Select a room type"}
                      </MenuItem>
                      {roomTypes.map((type) => (
                        <MenuItem key={type.roomTypeId} value={type.roomTypeId}>
                          {type.roomTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.roomTypeId && (
                      <Typography color="error" variant="caption">
                        {errors.roomTypeId.message}
                      </Typography>
                    )}
                  </FormControl>
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
            {loading ? "Adding..." : "Add Room Pricing"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddRoomPricingDialog;
