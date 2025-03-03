"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FacilityBook
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            component={Link}
            to={item.path}
            sx={{
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ backgroundColor: "white" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            FacilityBook
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                fontWeight: 700,
                color: "primary.main",
                textDecoration: "none",
                alignItems: "center",
              }}
            >
              FacilityBook
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.path}
                sx={{ mx: 1, color: "text.primary" }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mr: 1, display: { xs: "none", sm: "block" } }}
            >
              Log In
            </Button>
            <Button variant="contained" color="primary">
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="top"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: "100%" },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
