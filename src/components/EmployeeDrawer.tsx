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
import { employeeMenuItems } from "./EmployeeMenuItems";
import { useAuth } from "../context/useAuth";

type MenuItemType = (typeof employeeMenuItems)[0];

interface EmployeeDrawerProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  miniDrawerWidth: number;
}

const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme, miniDrawerWidth: number): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `${miniDrawerWidth}px`,
});

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({
  open,
  drawerWidth,
  miniDrawerWidth,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = () => {
    if (!user || !user.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      drawerWidth={drawerWidth}
      miniDrawerWidth={miniDrawerWidth}
    >
      <DrawerHeader>
        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            ml: 2,
            opacity: 1,
            whiteSpace: "nowrap",
          }}
        >
          Employee Panel
        </Typography>
      </DrawerHeader>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {employeeMenuItems.map((item: MenuItemType) => (
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
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  whiteSpace: "nowrap",
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
              opacity: open ? 1 : 0,
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

export default EmployeeDrawer;
