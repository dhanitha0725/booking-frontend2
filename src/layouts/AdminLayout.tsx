import React, { useState } from "react";
import { Box, CssBaseline, Toolbar, useTheme } from "@mui/material";
import AdminAppBar from "../features/admin/components/AdminAppBar";
import AdminDrawer from "../features/admin/components/AdminDrawer";
import { Outlet } from "react-router-dom";

const drawerWidth = 240; // Full drawer width

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  // Ensure miniDrawerWidth is a number
  const miniDrawerWidth = parseFloat(theme.spacing(7)) + 1; // Use parseFloat
  const [open, setOpen] = useState(true); // Drawer starts open

  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const currentDrawerWidth = open ? drawerWidth : miniDrawerWidth;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar
        open={open}
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth} // Pass number
      />
      <AdminDrawer
        open={open}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth} // Pass number
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${currentDrawerWidth}px`,
          transition: theme.transitions.create(["margin"], {
            // Only transition margin now
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
