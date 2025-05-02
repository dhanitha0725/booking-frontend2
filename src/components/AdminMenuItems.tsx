import {
  People as PeopleIcon,
  MeetingRoom as MeetingRoomIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export const menuItems = [
  {
    text: "Staff",
    icon: <PeopleIcon />,
    path: "/admin/staff",
    selected: window.location.pathname === "/admin/staff",
  },
  {
    text: "Customers",
    icon: <PersonIcon />,
    path: "/admin/customers-management",
    selected: window.location.pathname === "/admin/customers-management",
  },
  {
    text: "Facilities",
    icon: <MeetingRoomIcon />,
    path: "/admin/facilities-management",
    selected: window.location.pathname === "/admin/facilities-management",
  },
];
