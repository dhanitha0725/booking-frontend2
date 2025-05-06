import { useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { BookingItemDto } from "../../../../types/selectedFacility";
import dayjs from "dayjs";

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
    if (requiresDates && (!dateRange.startDate || !dateRange.endDate)) {
      console.error("Start date and end date are required.");
      return;
    }

    if (
      dateRange.startDate &&
      dateRange.endDate &&
      !dateRange.endDate.isAfter(dateRange.startDate)
    ) {
      console.error(
        "Invalid date range: End date must be after the start date."
      );
      return;
    }

    try {
      const payload = {
        calculateTotalDto: {
          facilityId,
          customerType,
          startDate: dateRange.startDate?.toISOString(),
          endDate: dateRange.endDate?.toISOString(),
          selectedItems,
        },
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        "http://localhost:5162/api/Reservation/calculateTotal",
        payload
      );

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
