import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { Reservation } from "../../../../types/ReservationDetails";
import { format, subDays, parseISO, isValid } from "date-fns";

interface ReservationTrendChartProps {
  reservations: Reservation[];
  days?: number;
}

const ReservationTrendChart: React.FC<ReservationTrendChartProps> = ({
  reservations,
  days = 14,
}) => {
  const theme = useTheme();

  // Generate last N days
  const today = new Date();
  const dateLabels: string[] = [];
  const dateMap: Record<string, number> = {};

  // Initialize with zero values for all dates
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, "MMM dd");
    dateLabels.push(dateStr);
    dateMap[dateStr] = 0;
  }

  // Count reservations by creation date
  reservations.forEach((reservation) => {
    if (reservation.createdAt) {
      const createdDate = parseISO(reservation.createdAt);
      if (isValid(createdDate)) {
        const daysAgo = Math.floor(
          (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysAgo >= 0 && daysAgo < days) {
          const dateStr = format(createdDate, "MMM dd");
          dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
        }
      }
    }
  });

  // Convert to array for the chart
  const countData = dateLabels.map((date) => dateMap[date] || 0);

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
