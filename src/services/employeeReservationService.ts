import api from './api';
import { FacilityData, CustomerType } from '../types/employeeReservation';
import { UserInfo } from '../types/reservationData';

export interface CreateReservationResponse {
  isSuccess: boolean;
  value?: {
    reservationId: number;
  };
  error?: string;
}

/**
 * step 01 api call for get facility names with id
 * @returns Promise with facilities data
 */
export const getFacilityNames = async () => {
  const response = await api.get("/Facility/facility-names");
  return response.data;
};

/**
 * Fetches detailed information about a specific facility
 * @param facilityId The ID of the facility to fetch
 * @returns Promise with facility details including rooms and packages
 */
export const getFacilityDetails = async (facilityId: number): Promise<FacilityData> => {
  const response = await api.get(`/Reservation/${facilityId}`);
  
  // Extract only the necessary data from the response
  if (response.data && response.data.value) {
    return {
      packages: response.data.value.packages || [],
      rooms: response.data.value.rooms || []
    };
  }
  
  // If the structure is not as expected, return empty data
  return {
    packages: [],
    rooms: []
  };
};

/**
 * Creates a new reservation from the employee interface
 * @param data The reservation data
 * @returns Promise with the created reservation response
 */
export const createEmployeeReservation = async (data: {
  facilityId: number;
  startDate?: string;
  endDate?: string;
  total: number;
  customerType: CustomerType;
  items: {
    itemId: number;
    quantity: number;
    type: string;
  }[];
  userDetails: UserInfo;
}): Promise<CreateReservationResponse> => {
  const response = await api.post("/Reservation/createReservation", data);
  return response.data;
};

/**
 * Checks availability for a specific facility and date range
 * @param facilityId The facility ID to check
 * @param startDate The start date of the reservation
 * @param endDate The end date of the reservation
 * @param items The selected items to check availability for
 * @returns Promise with availability status and message
 */
export const checkAvailability = async (
  facilityId: number,
  startDate: string,
  endDate: string,
  items: { itemId: number; type: string; quantity: number }[]
) => {
  try {
    // Make sure we're sending the data in the exact format expected by the backend
    const payload = {
      facilityId,
      startDate,
      endDate,
      items
    };
    
    console.log("Checking availability with payload:", payload);
    
    const response = await api.post("/Reservation/checkAvailability", payload);
    
    console.log("Availability response:", response.data);
    
    // Return standardized format even if backend response varies
    return {
      isAvailable: response.data.isAvailable ?? false,
      message: response.data.message || (response.data.isAvailable ? 
        "The facility is available for the selected dates." : 
        "The facility is not available for the selected dates.")
    };
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
};

export default {
  getFacilityNames,
  getFacilityDetails,
  createEmployeeReservation,
  checkAvailability
};