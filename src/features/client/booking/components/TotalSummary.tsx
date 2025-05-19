import { useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import {
  BookingItemDto,
  PackagesDto,
} from "../../../../types/selectedFacility";
import dayjs from "dayjs";
import api from "../../../../services/api";

interface TotalSummaryProps {
  total: number;
  setTotal: (total: number) => void;
  facilityId: number | undefined;
  customerType: "corporate" | "public" | "private";
  dateRange: { startDate: dayjs.Dayjs | null; endDate: dayjs.Dayjs | null };
  selectedItems: BookingItemDto[];
  requiresDates: boolean;
  packages?: PackagesDto[]; // Added packages prop
}

const TotalSummary = ({
  total,
  setTotal,
  facilityId,
  customerType,
  dateRange,
  selectedItems,
  requiresDates,
  packages = [], // Default to empty array
}: TotalSummaryProps) => {
  const calculateTotal = useCallback(async () => {
    // Don't attempt to calculate if we're missing required dates
    if (requiresDates && (!dateRange.startDate || !dateRange.endDate)) {
      return;
    }

    // Don't calculate if we don't have a facility or items
    if (!facilityId || selectedItems.length === 0) {
      return;
    }

    try {
      // Check if there's a one-day package selected and dates are the same
      const hasDailyPackage = selectedItems.some((item) => {
        if (item.type !== "package") return false;
        const pkg = packages.find((p) => p.packageId === item.itemId);
        // Check if package duration has "day" in it
        return pkg?.duration?.includes("day") || false;
      });

      // For daily packages with same-day selection, adjust endDate to next day for backend calculation
      let adjustedEndDate = dateRange.endDate;
      if (
        hasDailyPackage &&
        dateRange.startDate &&
        dateRange.endDate &&
        dateRange.startDate.isSame(dateRange.endDate, "day")
      ) {
        // Use next day for calculation only
        adjustedEndDate = dayjs(dateRange.endDate).add(1, "day");
      }

      const payload = {
        calculateTotalDto: {
          facilityId,
          customerType,
          startDate: dateRange.startDate?.toISOString(),
          endDate: adjustedEndDate?.toISOString(),
          selectedItems,
        },
      };

      console.log("Calculating total with payload:", payload);

      const response = await api.post("/Reservation/calculateTotal", payload);

      setTotal(response.data.value.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      }
      console.error("Error calculating total:", error);
    }
  }, [
    facilityId,
    customerType,
    dateRange,
    selectedItems,
    requiresDates,
    setTotal,
    packages,
  ]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">Total Price:</Typography>
      <Typography variant="h6">Rs. {total.toFixed(2)}</Typography>
    </Box>
  );
};

export default TotalSummary;
