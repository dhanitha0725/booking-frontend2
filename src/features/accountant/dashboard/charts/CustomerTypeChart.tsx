import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { Reservation } from "../../../../types/ReservationDetails";

interface CustomerTypeChartProps {
  reservations: Reservation[];
}

interface ChartData {
  id: number;
  value: number;
  label: string;
  color?: string;
}

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({
  reservations,
}) => {
  const theme = useTheme();

  // Calculate counts by customer type
  const customerTypeCounts = reservations.reduce<Record<string, number>>(
    (acc, reservation) => {
      const type = reservation.userType || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {}
  );

  // Transform data for chart
  const chartData: ChartData[] = Object.entries(customerTypeCounts).map(
    ([type, count], index) => ({
      id: index,
      value: count,
      label: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
      color:
        type === "private"
          ? theme.palette.primary.main
          : type === "public"
            ? theme.palette.success.main
            : type === "corporate"
              ? theme.palette.warning.main
              : theme.palette.info.main,
    })
  );

  if (chartData.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Customer Types
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
        Reservations by Customer Type
      </Typography>
      <Box sx={{ height: 300, width: "100%" }}>
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          height={300}
          margin={{ top: 0, bottom: 0, left: 0, right: 160 }}
        />
      </Box>
    </Paper>
  );
};

export default CustomerTypeChart;
