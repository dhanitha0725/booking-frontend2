import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../../../services/api";
import { AdminFacilityDetails } from "../../../../types/adminFacilityDetails";
import FacilityTable from "./FacilityTable";
import AddFacilityDialog from "./AddFacilityDialog";
import { AddFacilityFormData } from "../../../../validations/addFacilityValidation";

const FacilityManagement: React.FC = () => {
  const [facilities, setFacilities] = useState<AdminFacilityDetails[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchFacilities = async () => {
    try {
      const response = await api.get("/Facility/admin");
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities", error);
      setNotification({
        open: true,
        message: "Failed to load facilities",
        severity: "error",
      });
    }
  };

  // Initial load of facilities
  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleViewDetails = (facilityId: number) => {
    // Handle viewing facility details
    console.log(`View details for facility: ${facilityId}`);
  };

  const handleAddFacilitySuccess = (
    data: AddFacilityFormData,
    newFacilityId?: number
  ) => {
    if (newFacilityId) {
      // If we got a new facility ID back, create a new facility object
      const newFacility: AdminFacilityDetails = {
        facilityId: newFacilityId,
        facilityName: data.facilityName,
        status: data.status,
        location: data.location,
        description: data.description,
      };

      setFacilities([...facilities, newFacility]);
    } else {
      // If we don't have a facility ID, refresh the full list
      fetchFacilities();
    }

    // Close the dialog and show success notification
    setOpenDialog(false);
    setNotification({
      open: true,
      message: "Facility added successfully",
      severity: "success",
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
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
      />

      <AddFacilityDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmitSuccess={handleAddFacilitySuccess}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FacilityManagement;
