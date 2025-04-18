import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import AdminAppBar from "../features/admin/components/AdminAppBar"; 
import AdminDrawer from "../features/admin/components/AdminDrawer"; 
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar open={open} onDrawerOpen={handleDrawerOpen} />
      <AdminDrawer open={open} onClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
