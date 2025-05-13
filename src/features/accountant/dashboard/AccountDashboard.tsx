import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoneyIcon from "@mui/icons-material/Money";
import CancelIcon from "@mui/icons-material/Cancel";
import StatCard from "../../../components/StatCard";
import api from "../../../services/api";

interface DashboardStats {
  totalReservations: number;
  totalRevenue: number;
  cancelledExpiredReservations: number;
}

const AccountDashboard: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch data for the last 30 days
        const response = await api.get("/accounting/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            days: 30,
          },
        });

        setStats(response.data);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Accountant Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Financial overview for the last 30 days
      </Typography>

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
        <Grid container spacing={3}>
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

          {/* Additional dashboard components can be added below */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                mt: 2,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To be implemented: Recent payment verifications and financial
                transactions
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AccountDashboard;
