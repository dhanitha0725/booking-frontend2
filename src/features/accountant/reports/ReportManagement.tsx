import React, { useState } from "react";
import { Typography, Container, Grid, Alert, Snackbar } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "jspdf-autotable";
import ReportTypeSelector from "./ReportTypeSelector";
import ReportConfigurationCard from "./ReportConfigurationCard";
import RecentReportsCard from "./RecentReportsCard";
import {
  FinancialReportItem,
  ReportType,
  ExportFormat,
} from "../../../types/report";

// Add this type for jsPDF-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const ReportManagement: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>("revenue");
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(30, "day")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ open: false, message: "", type: "info" });
  const [recentReports, setRecentReports] = useState<
    {
      title: string;
      date: string;
      format: string;
      data?: FinancialReportItem[];
    }[]
  >([]);

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
    reportData: FinancialReportItem[],
    reportFormat: string,
    startDateStr: string,
    endDateStr: string
  ) => {
    const newReport = {
      title: `Financial Report - ${startDateStr} to ${endDateStr}`,
      date: new Date().toLocaleDateString(),
      format: reportFormat.toUpperCase(),
      data: reportData,
    };

    setRecentReports((prev) => [newReport, ...prev].slice(0, 5));
    showNotification(
      `Financial report has been generated and exported as ${reportFormat.toUpperCase()}`,
      "success"
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Report Management
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Generate and export various reports for financial analysis and
          business insights.
        </Typography>

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
              exportFormat={exportFormat}
              isGenerating={isGenerating}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onExportFormatChange={setExportFormat}
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
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.type}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default ReportManagement;
