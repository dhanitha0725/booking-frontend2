import React, { useState, useEffect } from "react";
import {
  AppBar as MuiAppBar, // Rename to avoid conflict
  Toolbar,
  Typography,
  IconButton,
  Box,
  styled, // Import styled
  AppBarProps as MuiAppBarProps, // Import AppBarProps
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "../../../context/useAuth";
import { useLocation } from "react-router-dom"; // Import useLocation

// Extend AppBarProps to include custom props for styling
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerwidth: number; // Use lowercase to match styled prop convention
  minidrawerwidth: number; // Use lowercase
}

// Styled AppBar component
const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "drawerwidth" && prop !== "minidrawerwidth",
})<AppBarProps>(({ theme, open, drawerwidth, minidrawerwidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerwidth,
    width: `calc(100% - ${drawerwidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: minidrawerwidth,
    width: `calc(100% - ${minidrawerwidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen, // Use leaving duration when closed
    }),
  }),
  backgroundColor: "white", // Set background to white
  color: theme.palette.text.primary, // Use theme text color
  boxShadow: "none", // Remove default shadow
  borderBottom: `1px solid ${theme.palette.divider}`, // Add a subtle border instead
}));

interface AdminAppBarProps {
  open: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
  miniDrawerWidth: number;
}

// Helper function to generate title from path
const getTitleFromPath = (path: string): string => {
  const segments = path.split("/").filter(Boolean); // Remove empty segments
  if (segments.length === 0 || segments[0] !== "admin") {
    return "Dashboard"; // Default or handle non-admin routes
  }
  if (segments.length === 1) {
    return "Admin Dashboard"; // Base admin path
  }
  const title = segments[segments.length - 1]; // Get the last segment
  return title
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

const AdminAppBar: React.FC<AdminAppBarProps> = ({
  open,
  onDrawerToggle,
  drawerWidth,
  miniDrawerWidth,
}) => {
  const { user } = useAuth();
  const location = useLocation(); // Get location object
  const [pageTitle, setPageTitle] = useState("Admin Dashboard");

  useEffect(() => {
    setPageTitle(getTitleFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <StyledAppBar
      position="fixed"
      open={open}
      drawerwidth={drawerWidth} // Pass lowercase props
      minidrawerwidth={miniDrawerWidth} // Pass lowercase props
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{
            marginRight: 2,
            // Optionally hide if drawer is always open on large screens
            // display: { xs: 'block', sm: 'none' } // Example
          }}
        >
          <MenuIcon />
        </IconButton>
        {/* Page Title */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{ mr: 1, display: { xs: "none", sm: "block" } }}
          >
            {" "}
            {/* Hide on xs */}
            {user?.email || "User"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textTransform: "capitalize",
              display: { xs: "none", md: "block" },
            }}
          >
            {" "}
            {/* Hide on xs/sm */}({user?.role || "Role"})
          </Typography>
          {/* Add other icons like Notifications, Help if needed */}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AdminAppBar;
