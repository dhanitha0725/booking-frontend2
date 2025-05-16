import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addFacilitySchema,
  AddFacilityFormData,
} from "../../../validations/addFacilityValidation";
import api from "../../../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ApiFacility } from "../../../types/addFacilityDetails";
import { AxiosError } from "axios";

// backend error response
interface BackendError {
  message?: string;
  error?: {
    message?: string;
  };
}
interface FacilityType {
  typeName: string;
  facilityTypeId: number;
}

interface AddFacilityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: AddFacilityFormData, newFacilityId?: number) => void;
  onSubmitError: (errorMessage: string) => void;
}

const statuses = ["Active", "Inactive", "Maintenance"];

const AddFacilityDialog: React.FC<AddFacilityDialogProps> = ({
  open,
  onClose,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [facilities, setFacilities] = useState<{ id: number; name: string }[]>(
    []
  );
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingFacilityTypes, setLoadingFacilityTypes] = useState(false);
  const [openTypeDialog, setOpenTypeDialog] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFacilityFormData>({
    resolver: zodResolver(addFacilitySchema),
    defaultValues: {
      facilityName: "",
      location: "",
      description: "",
      status: "Active",
      facilityTypeId: 0,
      attributes: [""],
      parentFacilityId: undefined,
    },
  });

  // Reset form when the dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
      setError(null);
    } else {
      reset({
        facilityName: "",
        location: "",
        description: "",
        status: "Active",
        facilityTypeId: 0,
        attributes: [""],
        parentFacilityId: undefined,
      });
    }
  }, [open, reset]);

  // Fetch facility types from API
  useEffect(() => {
    const fetchFacilityTypes = async () => {
      setLoadingFacilityTypes(true);
      try {
        const response = await api.get<FacilityType[]>(
          "http://localhost:5162/api/Facility/facility-types"
        );
        setFacilityTypes(response.data);
      } catch (error) {
        console.error("Error fetching facility types:", error);
        setError("Failed to load facility types.");
      } finally {
        setLoadingFacilityTypes(false);
      }
    };

    if (open) {
      fetchFacilityTypes();
    }
  }, [open]);

  // Fetch facilities for parent facility selection
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get<ApiFacility[]>("/Facility/admin");
        // validate sub facility does not have parent facility itself
        const facilityOptions = response.data.map((f: ApiFacility) => ({
          id: f.facilityId,
          name: f.facilityName,
        }));
        setFacilities(facilityOptions);
      } catch (error) {
        console.error("Error fetching facilities", error);
      }
    };

    if (open) fetchFacilities();
  }, [open]);

  const onSubmit: SubmitHandler<AddFacilityFormData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare payload for API
      const payload = {
        facilityName: data.facilityName,
        facilityTypeId: data.facilityTypeId,
        location: data.location,
        description: data.description || "",
        status: data.status,
        attributes: data.attributes.filter((attr) => attr.trim() !== ""),
        parentFacilityId: data.parentFacilityId
          ? Number(data.parentFacilityId)
          : null,
      };

      // Debug log the payload
      console.log("Facility payload being sent:", payload);

      // send facility data to the backend
      const response = await api.post(
        "http://localhost:5162/api/Facility/add-facility",
        payload
      );

      onSubmitSuccess(data, response.data?.facilityId);
    } catch (error) {
      console.error("Error adding facility:", error);

      // extract the backend error message
      const err = error as AxiosError<BackendError>;
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        "Failed to add facility. Please try again.";

      setError(errorMessage);

      // Pass the error message to the parent component
      onSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add New Facility</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Controller
            name="facilityName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Facility Name"
                fullWidth
                error={!!errors.facilityName}
                helperText={errors.facilityName?.message}
              />
            )}
          />

          <Controller
            name="facilityTypeId"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="dense"
                error={!!errors.facilityTypeId}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InputLabel sx={{ background: "white", px: 1 }}>
                    Facility Type
                  </InputLabel>
                  <Button
                    size="small"
                    onClick={() => setOpenTypeDialog(true)}
                    sx={{ ml: "auto", mb: -1 }}
                  >
                    Add New Type
                  </Button>
                </Box>
                <Select
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  label="Facility Type"
                  disabled={loadingFacilityTypes}
                >
                  {loadingFacilityTypes ? (
                    <MenuItem value="" disabled>
                      Loading facility types...
                    </MenuItem>
                  ) : (
                    facilityTypes.map((type) => (
                      <MenuItem
                        key={`facility-type-${type.facilityTypeId}`}
                        value={type.facilityTypeId}
                      >
                        {type.typeName}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText>
                  {errors.facilityTypeId?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Location"
                fullWidth
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense" error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  {...field}
                  label="Status"
                  value={field.value || "Active"}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="parentFacilityId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>Parent Facility (Optional)</InputLabel>
                <Select
                  value={
                    field.value === null || field.value === undefined
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? null : Number(e.target.value);
                    field.onChange(value);
                  }}
                  label="Parent Facility"
                >
                  <MenuItem value="">None</MenuItem>
                  {facilities.map((facility) => (
                    <MenuItem key={facility.id} value={String(facility.id)}>
                      {facility.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="attributes"
            control={control}
            render={({ field }) => (
              <Box sx={{ mt: 2, border: 1, p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1">Attributes</Typography>
                {field.value?.map((attr, index) => (
                  // Add a predictable unique key using the index
                  <Box
                    key={`attribute-${index}`}
                    sx={{ display: "flex", gap: 1, my: 1 }}
                  >
                    <TextField
                      value={attr}
                      onChange={(e) => {
                        const newAttrs = [...field.value];
                        newAttrs[index] = e.target.value;
                        field.onChange(newAttrs);
                      }}
                      fullWidth
                      placeholder={`Attribute ${index + 1}`}
                      error={!!errors.attributes?.[index]}
                      helperText={errors.attributes?.[index]?.message}
                    />
                    <IconButton
                      onClick={() =>
                        field.onChange(
                          field.value.filter((_, i) => i !== index)
                        )
                      }
                      disabled={field.value.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => field.onChange([...field.value, ""])}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Add Attribute
                </Button>
              </Box>
            )}
          />
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
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddFacilityDialog;
