import React from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import SelectionTable from "../../../client/booking/components/SelectionTable";
import TotalSummary from "../../../client/booking/components/TotalSummary";
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
  isAvailable?: boolean;
  availabilityMessage?: string;
  checkingAvailability?: boolean;
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
  isAvailable = true,
  availabilityMessage = "",
  checkingAvailability = false,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!isAvailable && selectedItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {availabilityMessage ||
            "Selected items are not available for the chosen dates"}
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
            onSelectionChange={onSelectionChange}
            requiresDates={requiresDates}
            selectedItems={selectedItems}
            isAvailable={isAvailable}
            availabilityMessage={availabilityMessage}
            dateRange={dateRange}
          />

          {checkingAvailability && (
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
