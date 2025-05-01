import {
  People as PeopleIcon,
  MeetingRoom as MeetingRoomIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

export const menuItems = [
  {
    text: "Staff",
    icon: <PeopleIcon />,
    path: "/admin/staff",
    selected: window.location.pathname === "/admin/staff",
  },
  {
    text: "Facilities",
    icon: <MeetingRoomIcon />,
    path: "/admin/facilities-management",
    selected: window.location.pathname === "/admin/facilities-management",
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/admin/settings",
    selected: window.location.pathname === "/admin/settings",
  },
];
