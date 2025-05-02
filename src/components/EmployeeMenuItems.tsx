import {
  MeetingRoom as MeetingRoomIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export const employeeMenuItems = [
  {
    text: "Customers",
    icon: <PersonIcon />,
    path: "/employee/customers-management",
    selected: window.location.pathname === "/employee/customers-management",
  },
  {
    text: "Facilities",
    icon: <MeetingRoomIcon />,
    path: "/employee/facilities-management",
    selected: window.location.pathname === "/employee/facilities-management",
  },
];
