import { useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { BookingItemDto } from "../../../../types/selectedFacility";
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
}

const TotalSummary = ({
  total,
  setTotal,
  facilityId,
  customerType,
  dateRange,
  selectedItems,
  requiresDates,
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
      // Prepare the payload for the API request
      const payload = {
        calculateTotalDto: {
          facilityId,
          customerType,
          startDate: dateRange.startDate?.toISOString(),
          endDate: dateRange.endDate?.toISOString(),
          selectedItems,
        },
      };

      console.log("Calculating total with payload:", payload);

      // Make the API request to calculate the total
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
  ]);

  // Use useEffect to recalculate the total whenever the dependencies change
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
