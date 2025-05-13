import React from "react";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  styled,
  Theme,
  CSSObject,
  Avatar,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { menuItems } from "./AccountMenuItems";
import { useAuth } from "../context/useAuth";

// Define the type for a menu item based on the imported array
type MenuItemType = (typeof menuItems)[0];

interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  miniDrawerWidth: number;
  variant?: "permanent" | "persistent" | "temporary";
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

const AccountDrawer: React.FC<AccountDrawerProps> = ({
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
    if (!user || !user.email) return "?"; // Or some default
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <StyledDrawer
      variant="permanent" // Use permanent variant for mini-drawer effect
      open={true} // Keep the drawer always open
      drawerWidth={drawerWidth}
      miniDrawerWidth={miniDrawerWidth}
    >
      <DrawerHeader>
        <Typography
          variant="h6"
          noWrap // Prevent wrapping
          sx={{
            flexGrow: 1,
            ml: 2,
            opacity: 1, // Always visible
            whiteSpace: "nowrap", // Keep on one line
          }}
        >
          Account Panel
        </Typography>
      </DrawerHeader>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {menuItems.map((item: MenuItemType) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: 1, // Always visible
                  whiteSpace: "nowrap", // Prevent text wrapping
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: "auto", overflow: "hidden", whiteSpace: "nowrap" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
            {getInitials()}
          </Avatar>
          <Box
            sx={{
              ml: 1.5,
              opacity: 1, // Always visible
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium" noWrap>
              {user?.email || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.role || "Role"}
            </Typography>
          </Box>
          <IconButton onClick={handleLogout} sx={{ ml: "auto" }} size="small">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default AccountDrawer;
