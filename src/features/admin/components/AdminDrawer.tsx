import React from "react";
import {
  Box,
  Drawer as MuiDrawer, // Rename Drawer to avoid conflict
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  styled, // Import styled for creating styled components
  Theme, // Import Theme type
  CSSObject, // Import CSSObject type
  Avatar, // Import Avatar
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { menuItems } from "./AdminMenuItems"; // Ensure this import is correct
import { useAuth } from "../../../context/useAuth";

// Define the type for a menu item based on the imported array
type MenuItemType = (typeof menuItems)[0];

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  miniDrawerWidth: number; // Add miniDrawerWidth prop
}

// Helper function for opened drawer mixin
const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

// Helper function for closed drawer mixin
const closedMixin = (theme: Theme, miniDrawerWidth: number): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `${miniDrawerWidth}px`,
});

// Styled Drawer component
const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "drawerWidth" && prop !== "miniDrawerWidth",
})<{
  open?: boolean;
  drawerWidth: number;
  miniDrawerWidth: number;
}>(({ theme, open, drawerWidth, miniDrawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme, drawerWidth),
    "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
  }),
  ...(!open && {
    ...closedMixin(theme, miniDrawerWidth),
    "& .MuiDrawer-paper": closedMixin(theme, miniDrawerWidth),
  }),
}));

// Drawer Header component for spacing and close button alignment
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AdminDrawer: React.FC<AdminDrawerProps> = ({
  open,
  onClose,
  drawerWidth,
  miniDrawerWidth,
}) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // No need to navigate here, AuthContext handles it
  };

  // Get user initials for Avatar
  const getInitials = () => {
    // Assuming user object has firstName and lastName, adjust if needed
    // Fallback if user or names are not available
    if (!user || !user.email) return "?"; // Or some default
    // Simple email initial if names aren't directly available
    return user.email.charAt(0).toUpperCase();
    // If you fetch first/last names later, update this:
    // return `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase();
  };

  return (
    <StyledDrawer
      variant="permanent" // Use permanent variant for mini-drawer effect
      open={open}
      drawerWidth={drawerWidth}
      miniDrawerWidth={miniDrawerWidth}
    >
      {/* Use DrawerHeader for consistent spacing and alignment */}
      <DrawerHeader>
        {/* Show title only when open */}
        <Typography
          variant="h6"
          noWrap // Prevent wrapping
          sx={{
            flexGrow: 1,
            ml: 2,
            opacity: open ? 1 : 0,
            transition: (theme) => theme.transitions.create("opacity"),
            whiteSpace: "nowrap", // Keep on one line
          }}
        >
          Admin Panel
        </Typography>
        {/* Show close button only when open */}
        <IconButton
          onClick={onClose}
          sx={{
            opacity: open ? 1 : 0,
            transition: (theme) => theme.transitions.create("opacity"),
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {" "}
        {/* Allow list to scroll */}
        {menuItems.map((item: MenuItemType) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              // Use location.pathname for selection logic
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center", // Center icon when closed
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto", // Adjust margin based on open state
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {/* Hide text when closed */}
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  transition: (theme) => theme.transitions.create("opacity"),
                  whiteSpace: "nowrap", // Prevent text wrapping
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* User Profile Section */}
      <Box sx={{ p: 2, mt: "auto", overflow: "hidden", whiteSpace: "nowrap" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
            {getInitials()}
          </Avatar>
          <Box
            sx={{
              ml: 1.5, // Adjusted margin
              opacity: open ? 1 : 0,
              transition: (theme) => theme.transitions.create("opacity"),
              overflow: "hidden", // Hide overflow when closed
              flexGrow: 1, // Allow text to take space
            }}
          >
            <Typography variant="body2" fontWeight="medium" noWrap>
              {user?.email || "User"} {/* Display email or placeholder */}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.role || "Role"} {/* Display role or placeholder */}
            </Typography>
          </Box>
          {/* Logout Button - Show only when open */}
          <IconButton
            onClick={handleLogout}
            sx={{
              ml: "auto", // Push to the right
              opacity: open ? 1 : 0,
              transition: (theme) => theme.transitions.create("opacity"),
            }}
            size="small"
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default AdminDrawer;
