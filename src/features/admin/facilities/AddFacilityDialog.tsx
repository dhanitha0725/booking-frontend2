import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addFacilitySchema,
  AddFacilityFormData,
} from "../../../validations/addFacilityValidation";
import api from "../../../services/api";
import { ApiFacility } from "../../../types/addFacilityDetails";
import { AxiosError } from "axios";
import { FacilityType } from "../../../types/facilityTypes";
import { validateImageFiles } from "../../../validations/imageValidation";
import FacilityTypeDialog from "./FacilityTypeDialog";
import FacilityForm from "./FacilityForm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// backend error response
interface BackendError {
  message?: string;
  error?: {
    message?: string;
  };
}

interface AddFacilityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: AddFacilityFormData, newFacilityId?: number) => void;
  onSubmitError: (errorMessage: string) => void;
}

// Add a state type to track different phases of the submission process
type SubmissionState =
  | "idle"
  | "submitting"
  | "uploading"
  | "success"
  | "error";

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
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [loadingFacilityTypes, setLoadingFacilityTypes] = useState(false);
  const [openTypeDialog, setOpenTypeDialog] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newFacilityId, setNewFacilityId] = useState<number | null>(null);

  const methods = useForm<AddFacilityFormData>({
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
      methods.reset();
      setError(null);
      setImageFiles([]);
      setImageError(null);
      setSubmissionState("idle");
      setUploadProgress(0);
      setNewFacilityId(null);
    } else {
      methods.reset({
        facilityName: "",
        location: "",
        description: "",
        status: "Active",
        facilityTypeId: 0,
        attributes: [""],
        parentFacilityId: undefined,
      });
    }
  }, [open, methods]);

  // Fetch facility types from API
  useEffect(() => {
    const fetchFacilityTypes = async () => {
      setLoadingFacilityTypes(true);
      try {
        const response = await api.get<FacilityType[]>(
          "/Facility/facility-types"
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

  // Upload images after facility is created with progress tracking
  const uploadFacilityImages = async (facilityId: number): Promise<boolean> => {
    if (imageFiles.length === 0) return true;

    try {
      setSubmissionState("uploading");
      setUploadProgress(0);

      const formData = new FormData();

      // Add files to the FormData with the correct field name that backend expects
      imageFiles.forEach((file) => {
        formData.append("Files", file);
      });

      // Debug what we're sending
      console.log("Uploading images for facility:", facilityId);
      console.log("Number of files being uploaded:", imageFiles.length);

      const response = await api.post(
        `/Facility/${facilityId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      console.log("Image upload successful:", response.data);
      setSubmissionState("success");
      return true;
    } catch (error) {
      console.error("Error uploading images:", error);
      const err = error as AxiosError<BackendError>;

      // Enhanced error logging for diagnosing issues
      if (err.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
      }

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        "Failed to upload facility images.";

      setError(`Facility created but images failed to upload: ${errorMessage}`);
      setSubmissionState("error");
      return false;
    }
  };

  const onSubmit: SubmitHandler<AddFacilityFormData> = async (data) => {
    // Validate images first
    const result = validateImageFiles(imageFiles);
    if (!result.success) {
      setImageError(result.error.errors[0]?.message || "Invalid image files");
      return;
    }

    setSubmissionState("submitting");
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

      // Debug log to see what we're sending
      console.log("Sending facility payload:", payload);

      // Send facility data to the backend
      const response = await api.post("/Facility/add-facility", payload);

      console.log("Facility creation response:", response.data);

      // Extract facility ID from the response - check different possible formats
      let facilityId = null;
      if (response.data) {
        // Check for both possible property names
        if (response.data.facilityId) {
          facilityId = response.data.facilityId;
        } else if (response.data.facility) {
          facilityId = response.data.facility;
        } else if (typeof response.data === "number") {
          // In case the API just returns the ID directly
          facilityId = response.data;
        }
      }

      // Store the facility ID for reference
      if (facilityId) {
        console.log("Facility created with ID:", facilityId);
        setNewFacilityId(facilityId);

        // If we got a facility ID back, upload the images
        if (imageFiles.length > 0) {
          await uploadFacilityImages(facilityId);
        } else {
          setSubmissionState("success");
        }

        // Call the success callback only when everything is done
        // Note: We don't use submissionState here because it might not be updated yet
        if (submissionState !== "error") {
          onSubmitSuccess(data, facilityId);
        }
      } else {
        throw new Error(
          `No facility ID found in response: ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      console.error("Error adding facility:", error);

      // extract the backend error message
      const err = error as AxiosError<BackendError>;
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to add facility. Please try again.");

      setError(errorMessage);
      setSubmissionState("error");

      // Pass the error message to the parent component
      onSubmitError(errorMessage);
    }
  };

  // Close the dialog only when we're done with everything or on error
  const handleClose = () => {
    if (submissionState !== "submitting" && submissionState !== "uploading") {
      onClose();
    }
  };

  // Close on success after showing success state briefly
  useEffect(() => {
    if (submissionState === "success") {
      const timer = setTimeout(() => {
        if (newFacilityId) {
          const formData = methods.getValues();
          onSubmitSuccess(formData, newFacilityId);
          onClose();
        }
      }, 1500); // Delay closure to show success state

      return () => clearTimeout(timer);
    }
  }, [submissionState, newFacilityId, methods, onSubmitSuccess, onClose]);

  // Handle facility type dialog
  const handleAddFacilityType = () => {
    setOpenTypeDialog(true);
  };

  const handleFacilityTypeSuccess = () => {
    setOpenTypeDialog(false);
    // Refresh facility types
    const fetchFacilityTypes = async () => {
      try {
        const response = await api.get<FacilityType[]>(
          "/Facility/facility-types"
        );
        setFacilityTypes(response.data);
      } catch (error) {
        console.error("Error refreshing facility types:", error);
      }
    };
    fetchFacilityTypes();
  };

  // Is the form in a processing state?
  const isProcessing =
    submissionState === "submitting" || submissionState === "uploading";

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {submissionState === "uploading" ? (
          // Upload in progress view
          <Box sx={{ p: 4, textAlign: "center" }}>
            <DialogTitle>Uploading Facility Images</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  my: 3,
                }}
              >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Please wait while we upload your images
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  This may take a few moments depending on the file sizes
                </Typography>
                <Box sx={{ width: "100%", mt: 4 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ height: 10, borderRadius: 2 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    {uploadProgress}% Complete
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </Box>
        ) : submissionState === "success" ? (
          // Success view
          <Box sx={{ p: 4, textAlign: "center" }}>
            <DialogTitle>Success!</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  my: 3,
                }}
              >
                <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Facility created successfully
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  All images were uploaded successfully
                </Typography>
              </Box>
            </DialogContent>
          </Box>
        ) : (
          // Normal form view
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <DialogTitle>Add New Facility</DialogTitle>
              <DialogContent dividers>
                <FacilityForm
                  facilityTypes={facilityTypes}
                  facilities={facilities}
                  loadingFacilityTypes={loadingFacilityTypes}
                  error={error}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  imageError={imageError}
                  setImageError={setImageError}
                  onAddFacilityType={handleAddFacilityType}
                />
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={handleClose}
                  disabled={isProcessing}
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isProcessing}
                  startIcon={isProcessing && <CircularProgress size={20} />}
                  aria-label="Add facility"
                >
                  {submissionState === "submitting"
                    ? "Creating Facility..."
                    : "Add Facility"}
                </Button>
              </DialogActions>
            </form>
          </FormProvider>
        )}
      </Dialog>

      {/* Facility Type Dialog */}
      <FacilityTypeDialog
        open={openTypeDialog}
        onClose={() => setOpenTypeDialog(false)}
        onSuccess={handleFacilityTypeSuccess}
      />
    </>
  );
};

export default AddFacilityDialog;
