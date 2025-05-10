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
}) => {
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
            onSelectionChange={onSelectionChange}
            requiresDates={requiresDates}
            selectedItems={selectedItems}
            isAvailable={true} // Adjust based on your availability logic
            dateRange={dateRange}
          />
          <Divider sx={{ my: 3 }} />
          <TotalSummary
            total={total}
            setTotal={setTotal}
            facilityId={
              facilityData
                ? Number(facilityData.packages?.[0]?.packageId)
                : undefined
            }
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
