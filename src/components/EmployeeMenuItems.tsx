import {
  BookOnline as BookOnlineIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

export const employeeMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/employee/dashboard",
    selected: window.location.pathname === "/employee/dashboard",
  },

  {
    text: "Reservations",
    icon: <BookOnlineIcon />,
    path: "/employee/reservation-management",
    selected: window.location.pathname === "/employee/reservation-management",
  },
];
