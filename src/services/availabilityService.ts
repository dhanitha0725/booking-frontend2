import { BookingItemDto, DateRangeType } from "../types/employeeReservation";
import api from "./api";

interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

const checkAvailability = async (
  items: BookingItemDto[],
  facilityId: number,
  dateRange: DateRangeType
): Promise<AvailabilityResponseDto> => {
  if (!dateRange.startDate || !dateRange.endDate || items.length === 0) {
    return { isAvailable: true, message: "" };
  }

  try {
    const response = await api.post(
      "/Reservation/checkAvailability",
      {
        facilityId,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        items: items.map((item) => ({
          itemId: item.itemId,
          type: item.type,
          quantity: item.quantity,
        })),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error checking availability:", error);
    return {
      isAvailable: false,
      message: "Error checking availability. Please try again.",
    };
  }
};

export const availabilityService = {
  checkAvailability,
};

export default availabilityService;