import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import api from "../../../services/api";
import PDFGenerator from "../../../utils/PDFGenerator";
import {
  Facility,
  FinancialReportItem,
  ReservationReportItem,
  ReportType,
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

interface ReportConfigurationCardProps {
  reportType: ReportType;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  isGenerating: boolean;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onGenerateReport: (
    data: FinancialReportItem[] | ReservationReportItem[],
    startDate: string,
    endDate: string,
    reportType: ReportType
  ) => void;
  onError: (message: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const ReportConfigurationCard: React.FC<ReportConfigurationCardProps> = ({
  reportType,
  startDate,
  endDate,
  isGenerating,
  onStartDateChange,
  onEndDateChange,
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
      financial: "Financial Report",
      reservation: "Reservation Report",
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

      // Construct base URL based on report type
      const endpoint =
        reportType === "reservation"
          ? "reservation-report"
          : "financial-report";

      // Build URL with parameters
      const url = `/report/${endpoint}?startDate=${formattedStartDate}&endDate=${formattedEndDate}${
        !selectAllFacilities && selectedFacilityIds.length > 0
          ? selectedFacilityIds.map((id) => `&facilityIds=${id}`).join("")
          : ""
      }`;

      console.log(`Requesting ${reportType} report with URL:`, url);
      const response = await api.get(url);

      const reportData = response.data;

      // Generate PDF report
      if (reportType === "reservation") {
        PDFGenerator.generateReservationReport(
          reportData,
          formattedStartDate,
          formattedEndDate
        );
      } else {
        PDFGenerator.generateFinancialReport(
          reportData,
          formattedStartDate,
          formattedEndDate
        );
      }

      // Notify parent component about the successful report generation
      onGenerateReport(
        reportData,
        formattedStartDate,
        formattedEndDate,
        reportType
      );
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
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
                renderValue={() => {
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
        </Grid>
      </CardContent>

      {isGenerating && <LinearProgress color="primary" />}

      <Divider />

      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleGenerateReport}
          disabled={isGenerating || !startDate || !endDate}
        >
          {isGenerating ? "Generating..." : "Generate PDF Report"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ReportConfigurationCard;
