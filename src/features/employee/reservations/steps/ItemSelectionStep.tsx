import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import SelectionTable from "../../../client/booking/components/SelectionTable";
import TotalSummary from "../../../client/booking/components/TotalSummary";
import employeeReservationService from "../../../../services/employeeReservationService";
import {
  FacilityData,
  BookingItemDto,
  CustomerType,
  DateRangeType,
} from "../../../../types/employeeReservation";

interface ItemSelectionStepProps {
  facilityData: FacilityData | null;
  selectedItems: BookingItemDto[];
  onSelectionChange: (
    type: "package" | "room",
    id: number,
    quantity: number
  ) => void;
  requiresDates: boolean;
  dateRange: DateRangeType;
  customerType: CustomerType;
  total: number;
  setTotal: (total: number) => void;
  loading: boolean;
  error: string | null;
  facilityId: number | null;
}

const ItemSelectionStep: React.FC<ItemSelectionStepProps> = ({
  facilityData,
  selectedItems,
  onSelectionChange,
  requiresDates,
  dateRange,
  customerType,
  total,
  setTotal,
  loading,
  error,
  facilityId,
}) => {
  const [availability, setAvailability] = useState({
    isAvailable: true,
    message: "",
    checking: false,
  });

  const handleSelectionChange = async (
    type: "package" | "room",
    id: number,
    quantity: number
  ) => {
    onSelectionChange(type, id, quantity);

    const updatedItems = selectedItems.filter((item) => item.quantity > 0);
    if (
      updatedItems.length > 0 &&
      facilityId &&
      (!requiresDates || (dateRange.startDate && dateRange.endDate))
    ) {
      setAvailability({ ...availability, checking: true });
      try {
        const result = await employeeReservationService.checkAvailability(
          facilityId,
          dateRange.startDate?.toISOString() || "",
          dateRange.endDate?.toISOString() || "",
          updatedItems.map((item) => ({
            itemId: item.itemId,
            type: item.type,
            quantity: item.quantity,
          }))
        );
        setAvailability({
          isAvailable: result.isAvailable,
          message: result.message,
          checking: false,
        });
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailability({
          isAvailable: false,
          message: "Error checking availability. Please try again.",
          checking: false,
        });
      }
    } else {
      setAvailability({ isAvailable: true, message: "", checking: false });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : facilityData ? (
        <>
          <SelectionTable
            packages={facilityData.packages || []}
            rooms={facilityData.rooms || []}
            onSelectionChange={handleSelectionChange}
            requiresDates={requiresDates}
            selectedItems={selectedItems}
            isAvailable={availability.isAvailable}
            availabilityMessage={
              availability.checking
                ? "Checking availability..."
                : availability.message
            }
            dateRange={dateRange}
          />
          {availability.checking && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography>Checking availability...</Typography>
            </Box>
          )}
          <Divider sx={{ my: 3 }} />
          <TotalSummary
            total={total}
            setTotal={setTotal}
            facilityId={facilityId || undefined}
            customerType={customerType}
            dateRange={dateRange}
            selectedItems={selectedItems}
            requiresDates={requiresDates}
          />
        </>
      ) : (
        <Typography>No facility data available</Typography>
      )}
    </Box>
  );
};

export default ItemSelectionStep;
