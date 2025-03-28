import * as React from "react";
import { extendTheme } from "@mui/material/styles";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Typography } from "@mui/material";
import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Define admin navigation items that match router paths
  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: "Administration",
    },

    {
      segment: "users",
      title: "Users",
      icon: <PeopleIcon />,
      onClick: () => navigate("/admin/users"),
      selected: location.pathname.includes("/admin/users"),
    },
    {
      segment: "facilities",
      title: "Facilities",
      icon: <MeetingRoomIcon />,
      onClick: () => navigate("/admin/facilities"),
      selected: location.pathname.includes("/admin/facilities"),
    },
    {
      segment: "settings",
      title: "Settings",
      icon: <SettingsIcon />,
      onClick: () => navigate("/admin/settings"),
      selected: location.pathname.includes("/admin/settings"),
    },
    {
      kind: "divider",
    },
    {
      title: "Logout",
      icon: <LogoutIcon />,
      onClick: handleLogout,
    },
  ];

  // Create admin theme
  const adminTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: "class",
  });

  // Create router adapter to connect React Router with toolpad/core AppProvider
  const routerAdapter = React.useMemo(() => {
    return {
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path: string | URL) => navigate(String(path)),
    };
  }, [navigate, location]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={routerAdapter}
      theme={adminTheme}
      appName={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div">
            Facility Booking Admin
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              ml: 2,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            Logged in as: {user?.role || "Admin"}
          </Typography>
        </Box>
      }
      userMenu={
        <Typography variant="body2" sx={{ px: 2, py: 1 }}>
          Logged in as: {user?.role || "Admin"}
        </Typography>
      }
    >
      <DashboardLayout>
        <PageContainer
          maxWidth={false}
          disableGutters={true}
          sx={{
            width: "100%",
            height: "100%",
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Outlet />
          </Box>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default AdminLayout;
