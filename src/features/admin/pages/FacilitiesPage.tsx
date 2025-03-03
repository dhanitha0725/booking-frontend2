import React from "react";
import FacilityManagement from "../components/FacilityManagement";
import { Box, Typography } from "@mui/material";

const FacilitiesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Facility Management
      </Typography>
      <FacilityManagement />
    </Box>
  );
};

export default FacilitiesPage;
