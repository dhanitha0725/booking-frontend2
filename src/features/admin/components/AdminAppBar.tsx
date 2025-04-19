import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material"; // Added Divider
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "../../../context/useAuth";

interface AdminAppBarProps {
  open: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
  miniDrawerWidth: number;
}

const AdminAppBar: React.FC<AdminAppBarProps> = ({
  open,
  onDrawerToggle,
  drawerWidth,
  miniDrawerWidth,
}) => {
  const { user } = useAuth();

  const currentDrawerWidth = open ? drawerWidth : miniDrawerWidth;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0} // Remove shadow
        sx={{
          ml: { sm: `${currentDrawerWidth}px` },
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white", // Set background to white
          color: "inherit", // Keep icon color default (usually black/grey on white)
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit" // Inherit color (will be dark on white bg)
            aria-label="toggle drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />{" "}
          {/* Spacer to push user info to the right */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2, color: "black" }}>
              {user?.email || "Admin"} ({user?.role || "Role"})
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Divider
        sx={{
          position: "fixed",
          top: 64, // Adjust based on your AppBar height (default is 64px)
          left: { sm: `${currentDrawerWidth}px` },
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(["width", "left"], {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
        }}
      />
    </>
  );
};

export default AdminAppBar;
