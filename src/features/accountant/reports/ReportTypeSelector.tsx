import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import { ReportType, ReportTypeOption } from "../../../types/report";

// Define report types
const reportTypes: ReportTypeOption[] = [
  {
    value: "revenue",
    label: "Revenue Report",
    icon: <BarChartIcon color="primary" />,
  },
  {
    value: "bookings",
    label: "Booking Statistics",
    icon: <TableChartIcon color="info" />,
  },
  {
    value: "facilities",
    label: "Facility Usage",
    icon: <TableChartIcon color="success" />,
  },
  {
    value: "customers",
    label: "Customer Analytics",
    icon: <BarChartIcon color="warning" />,
  },
  {
    value: "payments",
    label: "Payment Transactions",
    icon: <TableChartIcon color="error" />,
  },
];

interface ReportTypeSelectorProps {
  selectedReportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  selectedReportType,
  onReportTypeChange,
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Select Report Type
        </Typography>
        <Box sx={{ mt: 2 }}>
          {reportTypes.map((type) => (
            <Button
              key={type.value}
              variant={
                selectedReportType === type.value ? "contained" : "outlined"
              }
              startIcon={type.icon}
              onClick={() => onReportTypeChange(type.value)}
              fullWidth
              sx={{ mb: 1, justifyContent: "flex-start" }}
            >
              {type.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportTypeSelector;
