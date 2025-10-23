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
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Check if we're on the home page
  useEffect(() => {
    setIsTransparent(location.pathname === "/");
  }, [location.pathname]);

  // Add scroll listener to change transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsTransparent(false);
      } else if (location.pathname === "/") {
        setIsTransparent(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", backgroundColor: "red" }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        NICD Bookings
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
      position="fixed"
      color="default"
      elevation={isTransparent ? 0 : 1}
      sx={{
        backgroundColor: isTransparent ? "transparent" : "white",
        transition: "background-color 0.3s ease",
        zIndex: 1100,
        
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "#222222",
          borderRadius: 20,
          mt: 2,
          minHeight: 60,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: isTransparent ? "white" : "primary.main",
              textDecoration: "none",
              textShadow: isTransparent
                ? "0px 1px 2px rgba(0,0,0,0.3)"
                : "none",
            }}
          >
            NICD Bookings
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                color: isTransparent ? "white" : "inherit",
              }}
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
                color: isTransparent ? "white" : "primary.main",
                textDecoration: "none",
                alignItems: "center",
                textShadow: isTransparent
                  ? "0px 1px 2px rgba(0,0,0,0.3)"
                  : "none",
              }}
            >
              NICD Bookings
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
                sx={{
                  color: isTransparent ? "white" : "text.primary",
                  mx: 1,
                  textShadow: isTransparent
                    ? "0px 1px 2px rgba(0,0,0,0.3)"
                    : "none",
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex" }}>
            {isAuthenticated ? (
              <Button
                variant={isTransparent ? "outlined" : "outlined"}
                color={isTransparent ? "inherit" : "primary"}
                sx={{
                  mr: 1,
                  display: { xs: "none", sm: "block" },
                  borderColor: isTransparent ? "white" : undefined,
                  color: isTransparent ? "white" : undefined,
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  mr: 1,
                  display: { xs: "none", sm: "block" },
                  backgroundColor: "#e4e4e4ff",
                  borderRadius: 12,
                  p: "8px 20px",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "none",
                }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
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
