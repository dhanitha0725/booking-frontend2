import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import api from "../../../services/api";
import PDFGenerator from "../../../utils/PDFGenerator";
import {
  Facility,
  FinancialReportItem,
  ReportType,
  ExportFormat,
  ExportFormatOption,
} from "../../../types/report";

// Constants
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Define export formats
const exportFormats: ExportFormatOption[] = [
  { value: "pdf", label: "PDF", icon: <PictureAsPdfIcon /> },
  {
    value: "excel",
    label: "Excel",
    icon: <InsertDriveFileIcon color="success" />,
  },
  { value: "csv", label: "CSV", icon: <InsertDriveFileIcon /> },
];

interface ReportConfigurationCardProps {
  reportType: ReportType;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  exportFormat: ExportFormat;
  isGenerating: boolean;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onExportFormatChange: (format: ExportFormat) => void;
  onGenerateReport: (
    data: FinancialReportItem[],
    format: string,
    startDate: string,
    endDate: string
  ) => void;
  onError: (message: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const ReportConfigurationCard: React.FC<ReportConfigurationCardProps> = ({
  reportType,
  startDate,
  endDate,
  exportFormat,
  isGenerating,
  onStartDateChange,
  onEndDateChange,
  onExportFormatChange,
  onGenerateReport,
  onError,
  setIsGenerating,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<number[]>([]);
  const [selectAllFacilities, setSelectAllFacilities] = useState<boolean>(true);

  // Fetch facilities on component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get("/Facility/facility-names");
        setFacilities(response.data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        onError("Failed to load facilities. Please try again later.");
      }
    };

    fetchFacilities();
  }, [onError]);

  // Handle facility selection change
  const handleFacilityChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];

    if (value.includes(-1)) {
      // -1 is our code for "All Facilities"
      setSelectAllFacilities(true);
      setSelectedFacilityIds([]);
    } else {
      setSelectAllFacilities(false);
      setSelectedFacilityIds(value);
    }
  };

  // Get report type label
  const getReportTypeLabel = (value: ReportType): string => {
    const reportLabels: Record<ReportType, string> = {
      revenue: "Revenue Report",
      bookings: "Booking Statistics",
      facilities: "Facility Usage",
      customers: "Customer Analytics",
      payments: "Payment Transactions",
    };
    return reportLabels[value] || "";
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      onError("Please select both start and end dates");
      return;
    }

    if (endDate.isBefore(startDate)) {
      onError("End date cannot be before start date");
      return;
    }

    setIsGenerating(true);

    try {
      // Format dates for API
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");

      let response;

      // If "All Facilities" is selected or no specific facilities are selected
      if (selectAllFacilities || selectedFacilityIds.length === 0) {
        response = await api.get(
          `/report/financial-report?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
      } else if (selectedFacilityIds.length === 1) {
        // If only one facility is selected
        response = await api.get(
          `/report/financial-report?startDate=${formattedStartDate}&endDate=${formattedEndDate}&facilityId=${selectedFacilityIds[0]}`
        );
      } else {
        // If multiple facilities are selected, we'll need to make multiple requests and combine the data
        const requests = selectedFacilityIds.map((id) =>
          api.get(
            `/report/financial-report?startDate=${formattedStartDate}&endDate=${formattedEndDate}&facilityId=${id}`
          )
        );

        const responses = await Promise.all(requests);
        const combinedData = responses.flatMap((res) => res.data);
        response = { data: combinedData };
      }

      const financialReportData = response.data;

      // Generate and download the report based on selected format
      if (exportFormat === "pdf") {
        PDFGenerator.generateFinancialReport(
          financialReportData,
          formattedStartDate,
          formattedEndDate
        );
      } else if (exportFormat === "excel" || exportFormat === "csv") {
        // In a real implementation, you would generate Excel/CSV files here
        console.log("Would generate Excel/CSV with data:", financialReportData);
      }

      // Notify parent component about the successful report generation
      onGenerateReport(
        financialReportData,
        exportFormat,
        formattedStartDate,
        formattedEndDate
      );
    } catch (error) {
      console.error("Error generating financial report:", error);
      onError("An error occurred while generating the report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Configure Report: {getReportTypeLabel(reportType)}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Date Range */}
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={onEndDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </Grid>

          {/* Facility Selection */}
          {reportType === "revenue" && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="facility-select-label">
                  Select Facilities
                </InputLabel>
                <Select
                  labelId="facility-select-label"
                  multiple
                  value={selectAllFacilities ? [-1] : selectedFacilityIds}
                  onChange={handleFacilityChange}
                  input={<OutlinedInput label="Select Facilities" />}
                  renderValue={(selected) => {
                    if (selectAllFacilities) return "All Facilities";

                    return selectedFacilityIds
                      .map(
                        (id) =>
                          facilities.find((f) => f.facilityID === id)
                            ?.facilityName || ""
                      )
                      .join(", ");
                  }}
                  MenuProps={MenuProps}
                >
                  <MenuItem value={-1}>
                    <Checkbox checked={selectAllFacilities} />
                    <ListItemText primary="All Facilities" />
                  </MenuItem>

                  {facilities.map((facility) => (
                    <MenuItem
                      key={facility.facilityID}
                      value={facility.facilityID}
                    >
                      <Checkbox
                        checked={
                          selectedFacilityIds.indexOf(facility.facilityID) > -1
                        }
                      />
                      <ListItemText primary={facility.facilityName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Export Format */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Export Format
            </Typography>
            <Stack direction="row" spacing={1}>
              {exportFormats.map((format) => (
                <Button
                  key={format.value}
                  variant={
                    exportFormat === format.value ? "contained" : "outlined"
                  }
                  startIcon={format.icon}
                  onClick={() => onExportFormatChange(format.value)}
                  sx={{ minWidth: "100px" }}
                >
                  {format.label}
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      {isGenerating && <LinearProgress color="primary" />}

      <Divider />

      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleGenerateReport}
          disabled={isGenerating || !startDate || !endDate}
        >
          {isGenerating ? "Generating..." : "Generate & Export Report"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ReportConfigurationCard;
