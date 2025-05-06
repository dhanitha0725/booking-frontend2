import { Dayjs } from "dayjs";
import { useMemo } from "react";
import { BookingItemDto, SelectedFacility } from "../types/selectedFacility";

export interface DateRangeType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

/**
 * Custom hook for booking validation logic
 * 
 * Centralizes all booking validation and requirements checking
 */
export const useBooking = (
  selectedItems: BookingItemDto[],
  facility: SelectedFacility | null,
  dateRange: DateRangeType,
  isAvailable: boolean
) => {
  // Memoize the check for whether dates are required to prevent recalculation on every render
  const requiresDates = useMemo(() => {
    return selectedItems.some(
      (item) =>
        item.type === "room" ||
        facility?.packages.find((p) => p.packageId === item.itemId)?.requiresDates
    );
  }, [selectedItems, facility?.packages]);

  // Check if the selected dates are valid
  const validateDates = () => {
    if (!requiresDates) return true;
    return (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.endDate.isAfter(dateRange.startDate)
    );
  };

  // Check if a package is selected
  const hasSelectedPackage = () => {
    return selectedItems.some((item) => item.type === "package");
  };

  // Determine if the Reserve button should be disabled
  const isReserveDisabled = () => {
    return !isAvailable || !hasSelectedPackage() || !validateDates();
  };
  
  // Create reservation data for storage/submission
  const createReservationData = () => {
    if (!facility) return null;
    
    return {
      facilityId: facility.id,
      selectedItems,
      total: 0, // This will be set by the parent component
      customerType: "public", // Default value, can be overridden
      startDate: dateRange.startDate?.toISOString(),
      endDate: dateRange.endDate?.toISOString(),
    };
  };

  return {
    requiresDates,
    validateDates,
    hasSelectedPackage,
    isReserveDisabled,
    createReservationData
  };
};