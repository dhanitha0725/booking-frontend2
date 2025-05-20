import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  PriceChange,
} from "@mui/icons-material";

export const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/accountant/dashboard",
    selected: window.location.pathname === "/accountant/dashboard",
  },
  {
    text: "Invoice",
    icon: <ReceiptIcon />,
    path: "/accountant/invoice",
    selected: window.location.pathname === "/accountant/invoice",
  },
  {
    text: "Pricing",
    icon: <PriceChange />,
    path: "/accountant/pricing",
    selected: window.location.pathname === "/accountant/pricing",
  },
  {
    text: "Reports",
    icon: <AssessmentIcon />,
    path: "/accountant/reports",
    selected: window.location.pathname === "/accountant/reports",
  },
];
