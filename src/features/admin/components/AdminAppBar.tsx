import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

interface AdminAppBarProps {
  open: boolean;
  onDrawerOpen: () => void;
}

const AdminAppBar: React.FC<AdminAppBarProps> = ({ open, onDrawerOpen }) => {
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Facility Booking Admin
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} size="small">
              <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
