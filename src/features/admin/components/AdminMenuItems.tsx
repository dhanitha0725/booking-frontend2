import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MeetingRoom as MeetingRoomIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

export const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/admin/dashboard",
    selected: window.location.pathname === "/admin/dashboard",
  },
  {
    text: "Staff Management",
    icon: <PeopleIcon />,
    path: "/admin/users",
    selected: window.location.pathname === "/admin/users",
  },
  {
    text: "Facilities",
    icon: <MeetingRoomIcon />,
    path: "/admin/facilities",
    selected: window.location.pathname === "/admin/facilities",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/admin/settings",
    selected: window.location.pathname === "/admin/settings",
  },
];
