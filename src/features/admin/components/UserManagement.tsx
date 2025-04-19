import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import api from "../../../services/api";
import { User } from "../../../types/user";
import AddUserDialog from "./AddUserDialog";

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

  // material-react-table columns
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "userId",
        header: "User ID",
        size: 100,
      },
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">User Management</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add User
        </Button>
      </Box>
      <MaterialReactTable table={table} />
      <AddUserDialog open={openDialog} onClose={handleClose} />
    </Box>
  );
};

export default UserManagement;
