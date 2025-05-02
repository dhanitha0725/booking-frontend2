import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EmployeeDrawer from "../components/EmployeeDrawer";
import { Outlet } from "react-router-dom";

const drawerWidth = 240; // Full drawer width

const EmployeeLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const miniDrawerWidth = parseFloat(theme.spacing(7)) + 1;

  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <EmployeeDrawer
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
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
