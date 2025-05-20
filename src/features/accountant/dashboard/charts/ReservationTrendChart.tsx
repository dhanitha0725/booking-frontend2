import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { format, parseISO } from "date-fns";

// Interface for the daily count data from the backend
interface DailyCount {
  date: string;
  count: number;
}

interface ReservationTrendChartProps {
  dailyCounts: DailyCount[];
  days?: number;
}

const ReservationTrendChart: React.FC<ReservationTrendChartProps> = ({
  dailyCounts,
  days = 14,
}) => {
  const theme = useTheme();

  // Filter to only show the last N days if more are provided
  const filteredCounts =
    days && dailyCounts.length > days ? dailyCounts.slice(-days) : dailyCounts;

  // Format dates for display and extract count data
  const dateLabels = filteredCounts.map((item) =>
    format(parseISO(item.date), "MMM dd")
  );
  const countData = filteredCounts.map((item) => item.count);

  return (
    <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Reservation Trends (Last {days} Days)
      </Typography>
      <Box sx={{ height: 300, width: "100%" }}>
        <LineChart
          xAxis={[
            {
              data: dateLabels,
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: countData,
              area: true,
              color: theme.palette.primary.main,
              showMark: false,
            },
          ]}
          height={300}
        />
      </Box>
    </Paper>
  );
};

export default ReservationTrendChart;
