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
  const prevRequestRef = useRef<string>("");

  // Create stable string versions of dates for dependencies
  const startDateString = dateRange.startDate?.toISOString();
  const endDateString = dateRange.endDate?.toISOString();

  // Memoize calculateTotal to prevent unnecessary re-creation
  const calculateTotal = useCallback(async () => {
    // Skip if required dates are missing
    if (requiresDates && (!dateRange.startDate || !dateRange.endDate)) {
      return;
    }

    // Skip if date range is invalid
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      !dateRange.endDate.isAfter(dateRange.startDate)
    ) {
      return;
    }

    // Reset total if no items or facilityId
    if (selectedItems.length === 0 || !facilityId) {
      setTotal(0);
      return;
    }

    const payload = {
      calculateTotalDto: {
        facilityId,
        customerType,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
        selectedItems,
      },
    };

    // Stringify payload to compare with previous request
    const payloadString = JSON.stringify(payload);
    if (payloadString === prevRequestRef.current) {
      return; // Skip if payload hasn't changed
    }

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
    startDateString, // Using stable string version instead of object reference
    endDateString, // Using stable string version instead of object reference
    selectedItems,
    requiresDates,
    setTotal,
  ]);

  // Trigger calculation only when calculateTotal changes
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
