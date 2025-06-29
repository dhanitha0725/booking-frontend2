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

// Add this interface to the existing interfaces
interface FacilityCount {
  facilityId: number;
  facilityName: string;
  reservationCount: number;
}

// TabPanelProps interface for the TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component to handle tab content display
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

// AccountantDashboard component to display financial overview and analytics
const AccountDashboard: React.FC = () => {
  // State variables to manage dashboard data
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<ReservationStats>({
    totalPendingReservations: 0,
    totalCompletedReservations: 0,
    totalCancelledOrExpiredReservations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setReservations] = useState<any[]>([]);
  const [dailyReservationCounts, setDailyReservationCounts] = useState<
    DailyCount[]
  >([]);
  // Add this state for facility counts
  const [facilityCounts, setFacilityCounts] = useState<FacilityCount[]>([]);

  // Function to handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [
          statsResponse,
          trendsResponse,
          reservationsResponse,
          facilityCountsResponse,
        ] = await Promise.allSettled([
          api.get<ReservationStats>("/Reservation/reservation-stats"),
          api.get("/Reservation/daily-reservation-counts"),
          api.get("/report/reservations"),
          api.get("/Reservation/facility-reservation-counts"),
        ]);

        // Handle statistics data
        if (statsResponse.status === "fulfilled") {
          setStats(statsResponse.value.data);
        } else {
          console.error(
            "Failed to fetch reservation stats:",
            statsResponse.reason
          );
          setError("Failed to load statistics data");
        }

        // Handle daily reservation counts
        if (trendsResponse.status === "fulfilled") {
          setDailyReservationCounts(trendsResponse.value.data.dailyCounts);
        } else {
          console.error(
            "Failed to fetch daily reservation counts:",
            trendsResponse.reason
          );
          setDailyReservationCounts([]);
        }

        // Handle reservations data for other charts
        if (reservationsResponse.status === "fulfilled") {
          setReservations(reservationsResponse.value.data);
        } else {
          console.error(
            "Failed to fetch reservations:",
            reservationsResponse.reason
          );
          setReservations([]);
        }

        // Handle facility counts data
        if (facilityCountsResponse.status === "fulfilled") {
          setFacilityCounts(facilityCountsResponse.value.data.facilityCounts);
        } else {
          console.error(
            "Failed to fetch facility counts:",
            facilityCountsResponse.reason
          );
          setFacilityCounts([]);
        }
      } catch (err) {
        console.error("Error fetching accountant dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const noDataAvailable = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <Typography variant="body1" color="text.secondary">
        No data available. Please check your connection and try again.
      </Typography>
    </Box>
  );

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
          {/* Statistics cards */}
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
                <Tab label="Facility Usage" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <TabPanel value={tabValue} index={0}>
                {dailyReservationCounts.length > 0 ? (
                  <ReservationTrendChart
                    dailyCounts={dailyReservationCounts}
                    days={30}
                  />
                ) : (
                  noDataAvailable
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {facilityCounts.length > 0 ? (
                  <FacilityUsageChart facilityCounts={facilityCounts} />
                ) : (
                  noDataAvailable
                )}
              </TabPanel>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AccountDashboard;
