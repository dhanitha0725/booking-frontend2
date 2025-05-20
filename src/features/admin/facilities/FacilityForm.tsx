import React, { useCallback } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { AddFacilityFormData } from "../../../validations/addFacilityValidation";
import {
  validateImageFiles,
  MAX_IMAGES,
  MIN_IMAGES,
} from "../../../validations/imageValidation";
import { FacilityType } from "../../../types/facilityTypes";

interface FacilityFormProps {
  facilityTypes: FacilityType[];
  facilities: { id: number; name: string }[];
  loadingFacilityTypes: boolean;
  error: string | null;
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageError: string | null;
  setImageError: React.Dispatch<React.SetStateAction<string | null>>;
  onAddFacilityType: () => void;
}

const statuses = ["Active", "Inactive", "Maintenance"];

const FacilityForm: React.FC<FacilityFormProps> = ({
  facilityTypes,
  facilities,
  loadingFacilityTypes,
  error,
  imageFiles,
  setImageFiles,
  imageError,
  setImageError,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddFacilityFormData>();

  // Validate images using our Zod validation
  const validateImages = (files: File[]): boolean => {
    const result = validateImageFiles(files);
    if (!result.success) {
      setImageError(result.error.errors[0]?.message || "Invalid image files");
      return false;
    }
    setImageError(null);
    return true;
  };

  // Handle image file changes
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (!fileList) return;

      const newFiles = Array.from(fileList);
      const updatedFiles = [...imageFiles, ...newFiles].slice(0, MAX_IMAGES);

      if (validateImages(updatedFiles)) {
        setImageFiles(updatedFiles);
      }

      // Reset input value to allow selecting the same file again
      event.target.value = "";
    },
    [imageFiles, setImageFiles]
  );

  // Handle image drop
  const handleImageDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const droppedFiles = event.dataTransfer.files;
      if (!droppedFiles) return;

      const newFiles = Array.from(droppedFiles);
      const updatedFiles = [...imageFiles, ...newFiles].slice(0, MAX_IMAGES);

      if (validateImages(updatedFiles)) {
        setImageFiles(updatedFiles);
      }
    },
    [imageFiles, setImageFiles]
  );

  // Remove image file
  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    validateImages(newFiles);
  };

  // Prevent default drag behaviors
  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Basic Facility Information */}
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
            aria-label="Facility Name"
            placeholder="Enter facility name"
          />
        )}
      />

      <Controller
        name="facilityTypeId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="dense" error={!!errors.facilityTypeId}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InputLabel
                id="facility-type-label"
                sx={{ background: "white", px: 1 }}
              >
                Facility Type
              </InputLabel>
            </Box>
            <Select
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              labelId="facility-type-label"
              label="Facility Type"
              disabled={loadingFacilityTypes}
              aria-label="Select Facility Type"
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
            <FormHelperText>{errors.facilityTypeId?.message}</FormHelperText>
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
            aria-label="Location"
            placeholder="Enter facility location"
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
            aria-label="Description"
            placeholder="Enter facility description"
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="dense" error={!!errors.status}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              {...field}
              labelId="status-label"
              label="Status"
              value={field.value || "Active"}
              aria-label="Facility Status"
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
            <InputLabel id="parent-facility-label">
              Parent Facility (Optional)
            </InputLabel>
            <Select
              labelId="parent-facility-label"
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
              aria-label="Parent Facility"
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
          <Box
            sx={{
              mt: 2,
              border: 1,
              p: 2,
              borderRadius: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1">Attributes</Typography>
            {field.value?.map((attr, index) => (
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
                  aria-label={`Attribute ${index + 1}`}
                />
                <IconButton
                  onClick={() =>
                    field.onChange(field.value.filter((_, i) => i !== index))
                  }
                  disabled={field.value.length <= 1}
                  aria-label={`Remove attribute ${index + 1}`}
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
              aria-label="Add Attribute"
            >
              Add Attribute
            </Button>
          </Box>
        )}
      />

      {/* Images Upload Section */}
      <Box
        sx={{
          mt: 3,
          border: 1,
          p: 2,
          borderRadius: 1,
          borderColor: imageError ? "error.main" : "divider",
          backgroundColor: "background.paper",
        }}
        role="region"
        aria-label="Facility Images Upload"
      >
        <Typography variant="subtitle1" gutterBottom>
          Facility Images
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload between {MIN_IMAGES} and {MAX_IMAGES} images (JPG, JPEG, PNG
          only, max 5MB each)
        </Typography>

        {/* Drag & Drop Area */}
        <Box
          onDragEnter={preventDefault}
          onDragOver={preventDefault}
          onDrop={handleImageDrop}
          onClick={() => document.getElementById("image-upload")?.click()}
          sx={{
            border: "2px dashed",
            borderColor: imageError ? "error.main" : "primary.light",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "action.hover",
            my: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.selected",
            },
          }}
          role="button"
          tabIndex={0}
          aria-label="Drop images here or click to browse"
          title="Drop images here or click to browse"
        >
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            style={{ display: "none" }}
            aria-label="Upload facility images"
          />
          <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography>Drag images here or click to browse</Typography>
          <Typography variant="caption" color="text.secondary">
            ({imageFiles.length}/{MAX_IMAGES}) images selected
          </Typography>
        </Box>

        {imageError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {imageError}
          </Typography>
        )}

        {/* Preview of uploaded images */}
        {imageFiles.length > 0 && (
          <List
            dense
            sx={{ mt: 2, maxHeight: "200px", overflow: "auto" }}
            aria-label="Uploaded images list"
          >
            {imageFiles.map((file, index) => (
              <ListItem key={`${file.name}-${index}`} sx={{ py: 0.5 }}>
                <ImageIcon color="primary" sx={{ mr: 1 }} />
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${file.name}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};

export default FacilityForm;
