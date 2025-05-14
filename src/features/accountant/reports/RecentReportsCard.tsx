import React from "react";
import { Typography, Box, Paper, Stack, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import PDFGenerator from "../../../utils/PDFGenerator";
import {
  ReportType,
  FinancialReportItem,
  ReservationReportItem,
} from "../../../types/report";

interface RecentReport {
  title: string;
  date: string;
  data?: FinancialReportItem[] | ReservationReportItem[];
  reportType: ReportType;
}

interface RecentReportsCardProps {
  recentReports: RecentReport[];
}

const RecentReportsCard: React.FC<RecentReportsCardProps> = ({
  recentReports,
}) => {
  const handleDownload = (report: RecentReport) => {
    if (report.data) {
      const startEndDates =
        report.title.split("-")[1]?.trim().split(" to ") || [];
      const startDate = startEndDates[0] || "";
      const endDate = startEndDates[1] || "";

      if (report.reportType === "bookings") {
        PDFGenerator.generateReservationReport(
          report.data as ReservationReportItem[],
          startDate,
          endDate
        );
      } else {
        PDFGenerator.generateFinancialReport(
          report.data as FinancialReportItem[],
          startDate,
          endDate
        );
      }
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Reports
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Stack spacing={1}>
          {recentReports.length > 0 ? (
            recentReports.map((report, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center">
                    <ArticleIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1">
                        {report.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Generated on {report.date} • PDF
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    startIcon={<DownloadIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => handleDownload(report)}
                  >
                    Download PDF
                  </Button>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary">
              No recent reports. Generate a report to see it here.
            </Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default RecentReportsCard;
