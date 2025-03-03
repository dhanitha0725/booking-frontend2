import React from "react";
import UserManagement from "../components/UserManagement";
import { Box, Typography } from "@mui/material";

const UsersPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      <UserManagement />
    </Box>
  );
};

export default UsersPage;
