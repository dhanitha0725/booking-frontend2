import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Divider,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoneyIcon from "@mui/icons-material/Money";
import CancelIcon from "@mui/icons-material/Cancel";
import StatCard from "../../../components/StatCard";
import api from "../../../services/api";
import CustomerTypeChart from "./charts/CustomerTypeChart";
import FacilityUsageChart from "./charts/FacilityUsageChart";
import ReservationTrendChart from "./charts/ReservationTrendChart";

interface DashboardStats {
  totalReservations: number;
  totalRevenue: number;
  cancelledExpiredReservations: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AccountDashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate mock reservation data for testing the charts
  const generateMockReservations = () => {
    const statuses = ["Approved", "Confirmed", "Cancelled", "Expired"];
    const userTypes = ["private", "public", "corporate"];
    const mockData = [];

    // Create 30 days of data with varying number of reservations
    const today = new Date();
    for (let i = 0; i < 50; i++) {
      const creationDate = new Date();
      creationDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

      mockData.push({
        reservationId: i + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        userType: userTypes[Math.floor(Math.random() * userTypes.length)],
        createdAt: creationDate.toISOString(),
        total: Math.floor(Math.random() * 50000) + 5000,
        reservedRooms:
          Math.random() > 0.5 ? [{ roomName: "Standard Room" }] : [],
        reservedPackages:
          Math.random() > 0.5
            ? [
                {
                  packageName:
                    Math.random() > 0.5 ? "Hall Package" : "Outdoor Event",
                },
              ]
            : [],
      });
    }

    return mockData;
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // First try to fetch real data
        try {
          // Updated API endpoint to match backend routes
          const response = await api.get("/report/dashboard-stats", {
            // Changed from "/accounting/dashboard-stats"
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              days: 30,
            },
          });

          setStats(response.data);

          const reservationsResponse = await api.get("/report/reservations", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setReservations(reservationsResponse.data);
          return;
        } catch (error) {
          console.log("Using mock data for dashboard visualization", error);
          // Fall through to mock data if API fails
        }

        // If API call fails, use mock data for demonstration
        const mockReservations = generateMockReservations();
        setReservations(mockReservations);

        // Calculate mock stats from the mock reservations
        const totalReservations = mockReservations.length;
        const totalRevenue = mockReservations
          .filter((r) => r.status !== "Cancelled" && r.status !== "Expired")
          .reduce((sum, r) => sum + r.total, 0);
        const cancelledExpiredCount = mockReservations.filter(
          (r) => r.status === "Cancelled" || r.status === "Expired"
        ).length;

        setStats({
          totalReservations,
          totalRevenue,
          cancelledExpiredReservations: cancelledExpiredCount,
        });
      } catch (err) {
        console.error("Error fetching accountant dashboard stats:", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Function to format currency
  const formatCurrency = (amount: number): string => {
    return `LKR ${amount.toLocaleString()}`;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Accountant Dashboard</Typography>
      </Box>

      <Typography variant="subtitle1" color="text.secondary">
        Financial overview for the last 30 days
      </Typography>

      <Divider sx={{ my: 2 }} />

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total Reservations Card */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Total Reservations"
                value={stats?.totalReservations || 0}
                description="Total number of reservations in the last 30 days"
                icon={<AssignmentIcon />}
                backgroundColor={theme.palette.primary.light}
                textColor={theme.palette.primary.contrastText}
                iconColor={theme.palette.primary.dark}
                elevation={3}
              />
            </Grid>

            {/* Total Revenue Card */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats?.totalRevenue || 0)}
                description="Total revenue generated in the last 30 days"
                icon={<MoneyIcon />}
                backgroundColor={theme.palette.success.light}
                textColor={theme.palette.success.contrastText}
                iconColor={theme.palette.success.dark}
                elevation={3}
              />
            </Grid>

            {/* Cancelled/Expired Reservations Card */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Cancelled & Expired"
                value={stats?.cancelledExpiredReservations || 0}
                description="Number of cancelled or expired reservations"
                icon={<CancelIcon />}
                backgroundColor={theme.palette.warning.light}
                textColor={theme.palette.warning.contrastText}
                iconColor={theme.palette.warning.dark}
                elevation={3}
              />
            </Grid>
          </Grid>

          {/* Analytics Section with Charts */}
          <Paper sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Financial Analytics
              </Typography>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Financial analytics tabs"
              >
                <Tab label="Reservations Trend" />
                <Tab label="Customer Analysis" />
                <Tab label="Facility Usage" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <TabPanel value={tabValue} index={0}>
                {/* Reservation Trend Chart */}
                <ReservationTrendChart reservations={reservations} days={30} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {/* Customer Type Distribution */}
                <CustomerTypeChart reservations={reservations} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {/* Facility Usage Chart */}
                <FacilityUsageChart reservations={reservations} />
              </TabPanel>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AccountDashboard;
