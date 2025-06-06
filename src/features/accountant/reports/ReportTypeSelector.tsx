import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import { ReportType, ReportTypeOption } from "../../../types/report";

const reportTypes: ReportTypeOption[] = [
  {
    value: "financial",
    label: "Financial Report",
    icon: <BarChartIcon color="primary" />,
  },
  {
    value: "reservation",
    label: "Reservation Report",
    icon: <TableChartIcon color="info" />,
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
