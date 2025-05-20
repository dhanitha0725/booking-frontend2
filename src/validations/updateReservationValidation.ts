import { BookingItemDto } from "../types/selectedFacility";
import dayjs from "dayjs";

export interface UpdateReservationPayload {
  reservationId: number;
  startDate: string;
  endDate: string;
  total: number;
  packageUpdates: BookingItemDto[];
  roomUpdates: BookingItemDto[];
  userType: string;
  changes?: {
    datesChanged: boolean;
    packagesChanged: boolean;
    roomsChanged: boolean;
  };
}

/**
 * Validates a reservation update payload before sending to the server
 * @param payload The update reservation payload
 * @returns True if the payload is valid
 * @throws Error with validation message if payload is invalid
 */
export const validateUpdateReservationPayload = (payload: UpdateReservationPayload): boolean => {
  // Check if reservation ID is valid
  if (!payload.reservationId || payload.reservationId <= 0) {
    throw new Error("Invalid reservation ID");
  }

  // Check dates
  if (!payload.startDate || !payload.endDate) {
    throw new Error("Start and end dates are required");
  }

  // Check if dates are valid ISO strings
  try {
    new Date(payload.startDate).toISOString();
    new Date(payload.endDate).toISOString();
  } catch (e) {
    throw new Error("Invalid date format");
  }

  // Check if packages and rooms are valid
  if (!Array.isArray(payload.packageUpdates) || !Array.isArray(payload.roomUpdates)) {
    throw new Error("Package updates and room updates must be arrays");
  }

  // Check if at least one item is selected
  if (payload.packageUpdates.length === 0 && payload.roomUpdates.length === 0) {
    throw new Error("At least one package or room must be selected");
  }

  // Validate items
  [...payload.packageUpdates, ...payload.roomUpdates].forEach((item) => {
    if (!item.itemId || item.itemId <= 0) {
      throw new Error("Invalid item ID");
    }
    if (item.quantity <= 0) {
      throw new Error("Item quantity must be greater than 0");
    }
  });

  return true;
};

/**
 * Validates reservation form input values
 * @param dateRange The date range for the reservation
 * @param selectedItems The selected packages and rooms
 * @returns An error message if validation fails, null if validation passes
 */
export const validateReservationForm = (
  dateRange: { startDate: dayjs.Dayjs | null; endDate: dayjs.Dayjs | null },
  selectedItems: BookingItemDto[]
): string | null => {
  if (!dateRange.startDate || !dateRange.endDate) {
    return "Please select both start and end dates";
  }
  
  if (dateRange.startDate.isSameOrAfter(dateRange.endDate)) {
    return "End date must be after start date";
  }
  
  if (dateRange.startDate.isBefore(dayjs().startOf("day"))) {
    return "Start date must be in the future";
  }
  
  if (selectedItems.length === 0) {
    return "Please select at least one package or room";
  }
  
  const hasInvalidRoom = selectedItems.some(
    (item) => item.type === "room" && item.quantity <= 0
  );
  
  if (hasInvalidRoom) {
    return "Room quantities must be greater than 0";
  }
  
  return null;
};

/**
 * Compares two arrays of booking items for equality
 * @param arr1 First array of booking items
 * @param arr2 Second array of booking items
 * @returns True if arrays are equal, false otherwise
 */
export const areBookingItemsEqual = (arr1: BookingItemDto[], arr2: BookingItemDto[]): boolean => {
  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = [...arr1].sort((a, b) => a.itemId - b.itemId);
  const sortedArr2 = [...arr2].sort((a, b) => a.itemId - b.itemId);

  return sortedArr1.every((item, index) => {
    const item2 = sortedArr2[index];
    return (
      item.itemId === item2.itemId &&
      item.type === item2.type &&
      item.quantity === item2.quantity
    );
  });
};