import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { Reservation } from "../../../../types/ReservationDetails";

interface FacilityUsageChartProps {
  reservations: Reservation[];
}

const FacilityUsageChart: React.FC<FacilityUsageChartProps> = ({
  reservations,
}) => {
  const theme = useTheme();

  // Aggregate data by facility type
  // Note: This is a simplified version. You may need to adjust based on your actual data structure
  const facilityUsage = reservations.reduce<Record<string, number>>(
    (acc, reservation) => {
      // This is a placeholder. Replace with actual logic based on your data structure
      const facilityTypes: string[] = [];

      // Check for rooms
      if (reservation.reservedRooms && reservation.reservedRooms.length > 0) {
        facilityTypes.push("Room");
      }

      // Check for packages (which might contain different facility types)
      if (
        reservation.reservedPackages &&
        reservation.reservedPackages.length > 0
      ) {
        reservation.reservedPackages.forEach((pkg) => {
          if (pkg.packageName.toLowerCase().includes("hall")) {
            facilityTypes.push("Hall");
          } else if (pkg.packageName.toLowerCase().includes("outdoor")) {
            facilityTypes.push("Outdoor");
          } else {
            facilityTypes.push("Other");
          }
        });
      }

      // If no specific types were identified, count as "Other"
      if (facilityTypes.length === 0) {
        facilityTypes.push("Other");
      }

      // Count each facility type
      facilityTypes.forEach((type) => {
        acc[type] = (acc[type] || 0) + 1;
      });

      return acc;
    },
    {}
  );

  const facilityTypes = Object.keys(facilityUsage);
  const usageCounts = facilityTypes.map((type) => facilityUsage[type]);

  if (facilityTypes.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Facility Usage
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Facility Usage Distribution
      </Typography>
      <Box sx={{ height: 300, width: "100%" }}>
        <BarChart
          xAxis={[{ scaleType: "band", data: facilityTypes }]}
          series={[
            {
              data: usageCounts,
              color: theme.palette.primary.main,
              label: "Number of Bookings",
            },
          ]}
          height={300}
        />
      </Box>
    </Paper>
  );
};

export default FacilityUsageChart;
