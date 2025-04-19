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
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
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
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
          sx={{
            flexGrow: 1,
            ml: 2,
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          Admin Panel
        </Typography>
        {/* Show close button only when open */}
        <IconButton
          onClick={onClose}
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item: MenuItemType) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={item.selected}
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
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Logout Button - Adjust for mini state */}
      <Box sx={{ padding: 2, mt: "auto", overflow: "hidden" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center", // Corrected prop name
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>{" "}
        {/* Correct closing tag placement */}
      </Box>
    </StyledDrawer>
  );
};

export default AdminDrawer;
