import { useEffect, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
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
  // Ref to store the previous request payload string (fix: unnecessary api calls)
  const prevRequestRef = useRef<string>("");

  // Calculate total price based on selected items and dates
  const calculateTotal = useCallback(async () => {
    //calculation conditions
    // Don't calculate if we're missing required dates
    if (requiresDates && (!dateRange.startDate || !dateRange.endDate)) {
      return;
    }

    // Don't calculate if the date range is invalid
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      !dateRange.endDate.isAfter(dateRange.startDate)
    ) {
      return;
    }

    // Don't calculate if there are no selected items or no facility ID
    if (selectedItems.length === 0 || !facilityId) {
      setTotal(0);
      return;
    }

    // Create the payload for calculation
    const payload = {
      calculateTotalDto: {
        facilityId,
        customerType,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
        selectedItems,
      },
    };

    // Convert payload to string to check if it has changed
    const payloadString = JSON.stringify(payload);

    // Skip API call if the request is equal to the previous one
    if (payloadString === prevRequestRef.current) {
      return;
    }

    // Update the ref with current payload
    prevRequestRef.current = payloadString;

    try {
      const response = await api.post("/Reservation/calculateTotal", payload);

      if (response.data?.value?.total !== undefined) {
        setTotal(response.data.value.total);
      }
    } catch (error) {
      console.error("Error calculating total:", error);
    }
  }, [
    facilityId,
    customerType,
    dateRange.startDate,
    dateRange.endDate,
    selectedItems,
    requiresDates,
    setTotal,
  ]);

  // Calculate total when calculateTotal changes
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
