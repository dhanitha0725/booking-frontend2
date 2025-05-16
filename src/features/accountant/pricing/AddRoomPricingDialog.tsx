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
import * as z from "zod";
import api from "../../../services/api";
import { AxiosError } from "axios";
import { RoomType } from "../../../types/roomTypes";

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

// Validation schema for room pricing form
const roomPricingSchema = z.object({
  facilityId: z.number().min(1, "Please select a facility"),
  roomTypeId: z.number().min(1, "Please select a room type"),
  publicPrice: z.number().min(0, "Price cannot be negative"),
  corporatePrice: z.number().min(0, "Price cannot be negative"),
  privatePrice: z.number().min(0, "Price cannot be negative"),
});

type RoomPricingFormData = z.infer<typeof roomPricingSchema>;

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
    watch,
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

  const selectedFacilityId = watch("facilityId");

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
  }, [open]); // Only dependency is dialog open state

  const onSubmit: SubmitHandler<RoomPricingFormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Format payload according to API requirements
      const payload = {
        roomTypeId: data.roomTypeId,
        pricings: {
          public: data.publicPrice,
          corporate: data.corporatePrice,
          private: data.privatePrice,
        },
      };

      await api.post(`/Facility/${data.facilityId}/room-pricing`, payload);
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
            {loading ? "Adding..." : "Add Room Pricing"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddRoomPricingDialog;
