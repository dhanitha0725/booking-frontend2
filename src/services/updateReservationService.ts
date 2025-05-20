import { BookingItemDto, CustomerType, DateRangeType } from "../types/employeeReservation";
import { UpdatePayload, FacilityResponse, SelectedFacilityDetails } from "../types/updateReservation";
import api from "./api";


interface CalculateTotalResponse {
  value: {
    total: number;
  };
}

interface AvailabilityRequest {
  facilityId: number;
  startDate: string;
  endDate: string;
  items: {
    itemId: number;
    type: string;
    quantity: number;
  }[];
}

export interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

interface UpdateReservationResponse {
  isSuccess: boolean;
  error?: string;
}

const updateReservationService = {
  /**
   * Get facility details required for updating a reservation
   * @param facilityId The ID of the facility
   * @returns Facility data with packages and rooms
   */
  getFacilityDetails: async (facilityId: number): Promise<SelectedFacilityDetails> => {
  try {
    const response = await api.get<FacilityResponse>(`/Reservation/${facilityId}`);
    if (!response.data.isSuccess || !response.data.value) {
      throw new Error(response.data.error || "Failed to fetch facility details");
    }
    // Map packages to include requiresDates
    const mappedData = {
      ...response.data.value,
      packages: response.data.value.packages.map((pkg) => ({
        ...pkg,
        requiresDates: pkg.duration >= 24, 
      })),
    };
    return mappedData;
  } catch (error) {
    console.error("Error fetching facility details:", error);
    throw error;
  }
},

  /**
   * Check availability of selected items for a given date range
   * @param facilityId The ID of the facility
   * @param dateRange Start and end dates
   * @param items Selected booking items
   * @returns Availability response object
   */
  checkAvailability: async (
    facilityId: number,
    dateRange: DateRangeType,
    items: BookingItemDto[]
  ): Promise<AvailabilityResponseDto> => {
    if (!dateRange.startDate || !dateRange.endDate || items.length === 0) {
      return { isAvailable: true, message: "" };
    }

    try {
      const request: AvailabilityRequest = {
        facilityId,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        items: items.map((item) => ({
          itemId: item.itemId,
          type: item.type,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/Reservation/checkAvailability", request);
      return response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      return {
        isAvailable: false,
        message: "Error checking availability. Please try again.",
      };
    }
  },

  /**
   * Calculate the total cost of selected items
   * @param facilityId The ID of the facility
   * @param customerType Customer type (private, public, corporate)
   * @param dateRange Start and end dates
   * @param selectedItems Selected booking items
   * @returns Total cost
   */
  calculateTotal: async (
    facilityId: number,
    customerType: CustomerType,
    dateRange: DateRangeType,
    selectedItems: BookingItemDto[]
  ): Promise<number> => {
    try {
      const request = {
        calculateTotalDto: {
          facilityId,
          customerType,
          startDate: dateRange.startDate?.toISOString(),
          endDate: dateRange.endDate?.toISOString(),
          selectedItems: selectedItems.map((item) => ({
            itemId: item.itemId,
            type: item.type,
            quantity: item.quantity,
          })),
        },
      };

      const response = await api.post<CalculateTotalResponse>(
        "/Reservation/calculateTotal",
        request
      );
      
      return response.data.value.total;
    } catch (error) {
      console.error("Error calculating total:", error);
      throw new Error("Failed to calculate total");
    }
  },

  /**
   * Submit reservation updates to the API
   * @param payload Update reservation payload
   * @returns Response with success status and optional error message
   */
  updateReservation: async (
    payload: UpdatePayload
  ): Promise<UpdateReservationResponse> => {
    try {
      const response = await api.put<UpdateReservationResponse>(
        "/Reservation/update-reservation",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  },
};

export default updateReservationService;