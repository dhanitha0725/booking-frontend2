import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { Customer, BackendError } from "../../../types/user";
import CustomerTable from "./CustomerTable";
import api from "../../../services/api";

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  //   manage notification feedback
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch customers from the API when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Use the correct API endpoint for customers
        const response = await api.get("/User/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers", error);

        // Extract error message from the backend response
        let errorMessage = "Failed to load customers";
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<BackendError>;
          if (axiosError.response?.data?.error?.message) {
            errorMessage = axiosError.response.data.error.message;
          }
        }

        // Show error notification
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Close the snackbar notification
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header section with title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Customer Management</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Display loading state or customer data */}
      {loading ? (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography variant="body1">Loading customers...</Typography>
        </Paper>
      ) : (
        <CustomerTable customers={customers} />
      )}

      {/* Feedback notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;
