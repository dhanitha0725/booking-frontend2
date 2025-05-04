import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import api from "../../../services/api";
import { AdminFacilityDetails } from "../../../types/adminFacilityDetails";
import FacilityTable from "./FacilityTable";
import AddFacilityDialog from "./AddFacilityDialog";
import FullFacilityInfo from "./FullFacilityInfo";
import { AddFacilityFormData } from "../../../validations/addFacilityValidation";
import axios, { AxiosError } from "axios";

const FacilityManagement: React.FC = () => {
  // store all facilities data retrieved from the backend
  const [facilities, setFacilities] = useState<AdminFacilityDetails[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  // to view details of a facility
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null
  );

  const [openFacilityInfo, setOpenFacilityInfo] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // notification feedback to users (success/error messages)
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch facilities from the API
  const fetchFacilities = async () => {
    try {
      const response = await api.get("/Facility/admin");
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities", error);
      setSnackbar({
        open: true,
        message: "Failed to load facilities",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Handle opening the facility info dialog
  const handleViewDetails = (facilityId: number) => {
    setSelectedFacilityId(facilityId);
    setOpenFacilityInfo(true);
  };

  // Handle closing the facility info dialog
  const handleCloseFacilityInfo = () => {
    setOpenFacilityInfo(false);
  };

  // Handle adding a facility
  const handleAddFacilitySuccess = (
    data: AddFacilityFormData, //validated data from the form
    newFacilityId?: number
  ) => {
    if (newFacilityId) {
      const newFacility: AdminFacilityDetails = {
        facilityId: newFacilityId,
        facilityName: data.facilityName,
        status: data.status,
        location: data.location,
        description: data.description,
      };
      setFacilities([...facilities, newFacility]);
    } else {
      fetchFacilities();
    }
    setOpenDialog(false);
    setSnackbar({
      open: true,
      message: "Facility added successfully",
      severity: "success",
    });
  };

  const handleAddFacilityError = (errorMessage: string) => {
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error",
    });
  };

  // Handle deleting a facility
  const handleDeleteInitiate = (facilityId: number) => {
    setFacilityToDelete(facilityId);
    setDeleteDialogOpen(true);
  };

  // Handle confirming the deletion of a facility
  const handleConfirmDelete = async () => {
    if (!facilityToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/Facility/${facilityToDelete}`);
      setFacilities(
        facilities.filter((f) => f.facilityId !== facilityToDelete)
      );
      setSnackbar({
        open: true,
        message: "Facility deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setFacilityToDelete(null);
    } catch (error) {
      console.error("Error deleting facility:", error);
      let errorMessage = "Failed to delete facility";
      if (axios.isAxiosError(error)) {
        // Check if the error is an AxiosError
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response?.data?.error) {
          // Check if the error response has a message
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.response?.status === 403) {
          // Check for 403 unauthorized status
          errorMessage = "You don't have permission to delete this facility";
        } else if (axiosError.response?.status === 404) {
          // Check for 404 Not Found status
          errorMessage = "Facility not found";
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setFacilityToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Facility Management</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Facility
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <FacilityTable
        facilities={facilities}
        onViewDetails={handleViewDetails}
        onDeleteInitiate={handleDeleteInitiate}
      />

      <AddFacilityDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmitSuccess={handleAddFacilitySuccess}
        onSubmitError={handleAddFacilityError}
      />

      <FullFacilityInfo
        open={openFacilityInfo}
        onClose={handleCloseFacilityInfo}
        facilityId={selectedFacilityId}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this facility? This action cannot be
            undone.
            <br />
            <br />
            <strong>Note:</strong> If this facility has child facilities, you
            must delete them first.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FacilityManagement;
