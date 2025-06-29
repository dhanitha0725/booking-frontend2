import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../../../services/api";
import { RoomType, RoomTypeResponse } from "../../../../types/roomTypes";
import { AxiosError } from "axios";

// Validation schema for adding rooms
const addRoomSchema = z.object({
  roomTypeId: z.number().min(1, "Please select a room type"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  numberOfBeds: z.number().int().min(1, "Number of beds must be at least 1"),
});

type AddRoomFormData = z.infer<typeof addRoomSchema>;

// Backend error response interface
interface BackendError {
  message?: string;
  error?: {
    message?: string;
  };
}

interface AddRoomDialogProps {
  open: boolean;
  onClose: () => void;
  facilityId: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// AddRoomDialog component for adding rooms to a facility
const AddRoomDialog: React.FC<AddRoomDialogProps> = ({
  open,
  onClose,
  facilityId,
  onSuccess,
  onError,
}) => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  // Form setup using react-hook-form
  // Using zod for validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddRoomFormData>({
    resolver: zodResolver(addRoomSchema),
    defaultValues: {
      roomTypeId: 0,
      quantity: 1,
      capacity: 1,
      numberOfBeds: 1,
    },
  });

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
      setError(null);
    } else {
      reset({
        roomTypeId: 0,
        quantity: 1,
        capacity: 1,
        numberOfBeds: 1,
      });
    }
  }, [open, reset]);

  // Fetch room types when dialog opens
  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!open) return;

      setLoadingRoomTypes(true);
      setError(null);

      try {
        // Fetch room types from the API
        const response = await api.get<RoomTypeResponse>(
          "/facilities/rooms/get-room-types"
        );
        setRoomTypes(response.data.roomTypes);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setError("Failed to load room types.");
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, [open]);

  // Handle form submission
  const onSubmit: SubmitHandler<AddRoomFormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure integers for numeric fields
      const payload = {
        roomTypeId: Number(data.roomTypeId),
        quantity: Number(data.quantity),
        capacity: Number(data.capacity),
        numberOfBeds: Number(data.numberOfBeds),
      };

      // Log the payload for debugging
      console.log("Adding rooms with payload:", payload);

      // Make API call to add rooms
      await api.post(`/facilities/rooms/add-rooms${facilityId}`, payload);

      // Show success message and close dialog
      onSuccess(`${data.quantity} rooms added successfully`);
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding rooms:", error);

      // Extract error message from various possible formats
      const err = error as AxiosError<BackendError>;
      let errorMessage = "Failed to add rooms. Please try again.";

      // Check if error response contains a message
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
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Rooms to Facility</DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Please fill in the details to add rooms to this facility
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="roomTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={!!errors.roomTypeId}
                    disabled={loadingRoomTypes}
                  >
                    <InputLabel id="room-type-label">Room Type</InputLabel>
                    <Select
                      {...field}
                      labelId="room-type-label"
                      label="Room Type"
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
                      <FormHelperText>
                        {errors.roomTypeId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Quantity"
                    fullWidth
                    margin="dense"
                    inputProps={{ min: 1 }}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Capacity"
                    fullWidth
                    margin="dense"
                    inputProps={{ min: 1 }}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="numberOfBeds"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Number of Beds"
                    fullWidth
                    margin="dense"
                    inputProps={{ min: 1 }}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.numberOfBeds}
                    helperText={errors.numberOfBeds?.message}
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
            {loading ? "Adding Rooms..." : "Add Rooms"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddRoomDialog;
