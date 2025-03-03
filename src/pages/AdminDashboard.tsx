import React from "react";
import { Box, Typography } from "@mui/material";
import UserManagement from "../features/admin/components/UserManagement";
import FacilityManagement from "../features/admin/components/FacilityManagement";

const AdminDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ mb: 4 }}>
        <UserManagement />
      </Box>
      <Box>
        <FacilityManagement />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
