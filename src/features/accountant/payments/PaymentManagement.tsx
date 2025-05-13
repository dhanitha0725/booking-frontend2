import React from "react";
import { Box, Typography, Container } from "@mui/material";

const PaymentManagement: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Management
      </Typography>
      <Box sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
        <Typography>
          Payment management interface will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentManagement;
