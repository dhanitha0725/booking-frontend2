import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AdminDrawer from "../components/AdminDrawer";
import { Outlet } from "react-router-dom";

const drawerWidth = 240; // Full drawer width

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const miniDrawerWidth = parseFloat(theme.spacing(7)) + 1;

  // Start with drawer open on desktop, closed on mobile
  const [open, setOpen] = useState(!isMobile);

  // Handle responsive behavior when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminDrawer
        open={open}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
          },
          // Remove the ml property that was causing the gap
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />{" "}
        {/* This creates space at the top for the AppBar if needed */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
