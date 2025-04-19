import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import api from "../../../services/api";
import { User } from "../../../types/user";
import AddUserDialog from "./AddUserDialog";
import { AddUserFormData } from "../../../validations/addUserValidation";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/Auth/get-user-details");
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

  const handleAddUserSuccess = (formData: AddUserFormData) => {
    // Transform AddUserFormData into a User object
    const newUser: User = {
      userId: Math.random().toString(36).substr(2, 9),
      ...formData,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    handleClose(); // Close the dialog after successful submission
  };

  // Use chips for roles
  const renderRoleChip = (role: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error" = "default";

    switch (role.toLowerCase()) {
      case "admin":
        color = "primary";
        break;
      case "accountant":
        color = "secondary";
        break;
      case "employee":
        color = "success";
        break;
      case "hostel":
        color = "warning";
        break;
      default:
        color = "default";
    }

    return <Chip label={role} color={color} size="small" />;
  };

  // Material React Table columns
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        size: 150,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 150,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 120,
        Cell: ({ cell }) => renderRoleChip(cell.getValue<string>()),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    layoutMode: "grid",
    muiTableContainerProps: {
      sx: { maxWidth: "100%" },
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ width: "200px" }}
        >
          Add User
        </Button>
      </Box>
      <MaterialReactTable table={table} />
      <AddUserDialog
        open={openDialog}
        onClose={handleClose}
        onSubmitSuccess={handleAddUserSuccess} // Pass the success handler
      />
    </Box>
  );
};

export default UserManagement;
