import { ApiResponse, SelectedFacility } from "../types/selectedFacility";
import { useTimeConversion } from "./useTimeConversion";

/**
 * Custom hook for mapping API responses to frontend data structures
 * 
 * Handles conversion of facility data from API format to app format
 */
export const useFacilityMapper = () => {
  const { convertTimeSpanToString, convertHoursToNumbers } = useTimeConversion();

  /**
   * Maps backend API response to frontend Facility type
   * @param response - API response containing facility data
   * @returns Mapped SelectedFacility object
   */
  const mapResponseToFacility = (response: ApiResponse): SelectedFacility => ({
    id: response.value.facilityId,
    name: response.value.facilityName,
    location: response.value.location,
    description: response.value.description || "No description available",
    images: response.value.imageUrls || [],
    amenities: response.value.attributes || [],
    packages:
      response.value.packages?.map((pkg) => ({
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        duration: pkg.duration ? convertTimeSpanToString(pkg.duration) : undefined,
        requiresDates: pkg.duration
          ? convertHoursToNumbers(pkg.duration) >= 24
          : false,
        pricing: pkg.pricing.map((price) => ({
          sector: price.sector,
          price: price.price,
        })),
      })) || [],
    rooms:
      response.value.rooms?.map((room) => ({
        roomId: room.roomId,
        roomType: room.roomType,
        pricing: room.pricing.map((price) => ({
          sector: price.sector,
          price: price.price,
        })),
      })) || [],
  });

  return {
    mapResponseToFacility,
  };
};