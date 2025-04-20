import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { User, BackendError } from "../../../../types/user";
import AddUserDialog from "./AddUserDialog";
import { AddUserFormData } from "../../../../validations/addUserValidation";
import UserTable from "./UserTable";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5162/api/Auth/get-user-details"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddUserSuccess = async (formData: AddUserFormData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5162/api/Auth/add-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new user to the users list
      const newUser: User = {
        userId: response.data.userId,
        ...formData,
      };

      setUsers((prevUsers) => [...prevUsers, newUser]);
      handleClose();

      // Show success snackbar
      setSnackbar({
        open: true,
        message: "User added successfully!",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error adding user", error);

      // Extract error message from the backend response
      const backendError = error.response?.data as BackendError;
      const errorMessage =
        backendError?.error?.message || "Failed to add user. Please try again.";

      // Show error snackbar with the backend error message
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Staff Management</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ width: "200px" }}
        >
          Add User
        </Button>
      </Box>
      <UserTable users={users} />
      <AddUserDialog
        open={openDialog}
        onClose={handleClose}
        onSubmitSuccess={handleAddUserSuccess}
      />
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

export default UserManagement;
