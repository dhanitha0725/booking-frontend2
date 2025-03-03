"use client";

import { useState, useEffect } from "react";
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
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { scrollToElement } from "../utils/scrollUtils";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle hash in URL for direct navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => scrollToElement(id), 100);
    }
  }, [location.hash]);

  const handleHowItWorksClick = () => {
    if (isHomePage) {
      scrollToElement("how-it-works");
    } else {
      navigate("/#how-it-works"); // Update URL
      setTimeout(() => scrollToElement("how-it-works"), 100); // Delay scroll for smooth navigation
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FacilityBook
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            component={RouterLink}
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
            component={RouterLink}
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
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={RouterLink}
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
                component={RouterLink}
                to={item.path}
                sx={{ color: "text.primary", mx: 1 }}
                onClick={
                  item.name === "How It Works"
                    ? handleHowItWorksClick
                    : undefined
                }
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
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
