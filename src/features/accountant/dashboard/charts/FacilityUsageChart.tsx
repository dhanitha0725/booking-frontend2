import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

// Interface for the facility count data from the backend
interface FacilityCount {
  facilityId: number;
  facilityName: string;
  reservationCount: number;
}

interface FacilityUsageChartProps {
  facilityCounts: FacilityCount[];
}

const FacilityUsageChart: React.FC<FacilityUsageChartProps> = ({
  facilityCounts,
}) => {
  const theme = useTheme();

  // Process and sort facility data
  const { facilityNames, reservationCounts } = facilityCounts
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .reduce(
      (acc, item) => {
        acc.facilityNames.push(item.facilityName);
        acc.reservationCounts.push(Math.max(0, item.reservationCount)); // Ensure non-negative counts
        return acc;
      },
      { facilityNames: [] as string[], reservationCounts: [] as number[] }
    );

  // Handle empty data case
  if (facilityCounts.length === 0) {
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
        Facility Usage
      </Typography>
      <Box sx={{ height: 300, width: "100%" }}>
        <BarChart
          // Use horizontal layout instead
          layout="horizontal"
          // For horizontal layout, xAxis takes the linear scale
          xAxis={[
            {
              scaleType: "linear",
              label: "Reservations",
            },
          ]}
          // And yAxis takes the band scale with data
          yAxis={[
            {
              scaleType: "band",
              data: facilityNames,
            },
          ]}
          series={[
            {
              data: reservationCounts,
              color: theme.palette.primary.main,
            },
          ]}
          height={300}
          margin={{ left: 150, right: 20, top: 10, bottom: 30 }}
        />
      </Box>
    </Paper>
  );
};

export default FacilityUsageChart;
