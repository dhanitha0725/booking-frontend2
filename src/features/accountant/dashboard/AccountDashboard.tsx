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
import {
  PendingActions,
  CheckCircle,
  Cancel,
  AttachMoney,
} from "@mui/icons-material";
import StatCard from "../../../components/StatCard";
import api from "../../../services/api";
import CustomerTypeChart from "./charts/CustomerTypeChart";
import FacilityUsageChart from "./charts/FacilityUsageChart";
import ReservationTrendChart from "./charts/ReservationTrendChart";

// Define the statistics response type to match API response
interface ReservationStats {
  totalPendingReservations: number;
  totalCompletedReservations: number;
  totalCancelledOrExpiredReservations: number;
  totalRevenue: number;
}

// Define interface for the daily count data from the backend
interface DailyCount {
  date: string;
  count: number;
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
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<ReservationStats>({
    totalPendingReservations: 0,
    totalCompletedReservations: 0,
    totalCancelledOrExpiredReservations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [dailyReservationCounts, setDailyReservationCounts] = useState<
    DailyCount[]
  >([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch statistics from the reservation-stats endpoint
        const statsResponse = await api.get<ReservationStats>(
          "/Reservation/reservation-stats"
        );
        setStats(statsResponse.data);

        // Fetch daily reservation counts for the trend chart
        try {
          const trendsResponse = await api.get(
            "/Reservation/daily-reservation-counts"
          );
          setDailyReservationCounts(trendsResponse.data.dailyCounts);
        } catch (error) {
          console.log("Error fetching daily reservation counts:", error);
          // Generate mock data for daily counts
          setDailyReservationCounts(generateMockDailyCounts(30));
        }

        // Continue to fetch reservations for other charts
        try {
          const reservationsResponse = await api.get("/report/reservations");
          setReservations(reservationsResponse.data);
        } catch (error) {
          console.log("Using mock data for dashboard visualization", error);
          // Use mock data for charts if API fails
          const mockReservations = generateMockReservations();
          setReservations(mockReservations);
        }
      } catch (err) {
        console.error("Error fetching accountant dashboard stats:", err);
        setError("Failed to load dashboard statistics");

        // Use mock data if API fails
        setStats({
          totalPendingReservations: 42,
          totalCompletedReservations: 20,
          totalCancelledOrExpiredReservations: 8,
          totalRevenue: 123000,
        });

        // Set mock data for daily counts
        setDailyReservationCounts(generateMockDailyCounts(30));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate mock daily reservation counts
  const generateMockDailyCounts = (days: number): DailyCount[] => {
    const result: DailyCount[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      result.push({
        date: date.toISOString().split("T")[0] + "T00:00:00Z",
        count: Math.floor(Math.random() * 20), // Random count between 0 and 19
      });
    }

    return result;
  };

  // Generate mock reservation data for other charts
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
          {/* Updated statistics cards to match EmployeeDashboard styling */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending"
                value={stats.totalPendingReservations}
                description="Reservations awaiting action"
                icon={<PendingActions />}
                iconColor="warning.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={stats.totalCompletedReservations}
                description="Successfully completed reservations"
                icon={<CheckCircle />}
                iconColor="success.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Cancelled"
                value={stats.totalCancelledOrExpiredReservations}
                description="Cancelled or expired"
                icon={<Cancel />}
                iconColor="error.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={`Rs. ${stats.totalRevenue.toFixed(2)}`}
                description="Total from completed bookings"
                icon={<AttachMoney />}
                iconColor="primary.main"
                backgroundColor="#fafafa"
                textColor="text.primary"
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
                {/* Correctly using ReservationTrendChart with dailyCounts */}
                <ReservationTrendChart
                  dailyCounts={dailyReservationCounts}
                  days={30}
                />
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
