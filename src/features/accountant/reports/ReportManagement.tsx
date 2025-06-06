import React, { useState } from "react";
import { Typography, Grid, Alert, Snackbar, Box, Divider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "jspdf-autotable";
import ReportTypeSelector from "./ReportTypeSelector";
import ReportConfigurationCard from "./ReportConfigurationCard";
import RecentReportsCard from "./RecentReportsCard";
import {
  FinancialReportItem,
  ReservationReportItem,
  ReportType,
} from "../../../types/report";

// Interface for report data in recent reports
interface ReportData {
  title: string;
  date: string;
  data?: FinancialReportItem[] | ReservationReportItem[];
  reportType: ReportType;
}

const ReportManagement: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>("financial");
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(30, "day")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ open: false, message: "", type: "info" });
  const [recentReports, setRecentReports] = useState<ReportData[]>([]);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleReportGenerated = (
    reportData: FinancialReportItem[] | ReservationReportItem[],
    startDateStr: string,
    endDateStr: string,
    type: ReportType
  ) => {
    // Create report title based on type
    const reportTitle =
      type === "reservation"
        ? `Reservation Report - ${startDateStr} to ${endDateStr}`
        : `Financial Report - ${startDateStr} to ${endDateStr}`;

    const newReport: ReportData = {
      title: reportTitle,
      date: new Date().toLocaleDateString(),
      data: reportData,
      reportType: type,
    };

    setRecentReports((prev) => [newReport, ...prev].slice(0, 5));

    const reportTypeName = type === "reservation" ? "reservation" : "financial";
    showNotification(
      `${reportTypeName.charAt(0).toUpperCase() + reportTypeName.slice(1)} report has been generated`,
      "success"
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Report Management</Typography>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Generate and export reports for financial analysis and reservation
          statistics.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Report Selection Card */}
          <Grid item xs={12} md={4}>
            <ReportTypeSelector
              selectedReportType={reportType}
              onReportTypeChange={setReportType}
            />
          </Grid>

          {/* Report Configuration Card */}
          <Grid item xs={12} md={8}>
            <ReportConfigurationCard
              reportType={reportType}
              startDate={startDate}
              endDate={endDate}
              isGenerating={isGenerating}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onGenerateReport={handleReportGenerated}
              onError={(message) => showNotification(message, "error")}
              setIsGenerating={setIsGenerating}
            />
          </Grid>

          {/* Recent Reports Card */}
          <Grid item xs={12}>
            <RecentReportsCard recentReports={recentReports} />
          </Grid>
        </Grid>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportManagement;
