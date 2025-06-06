export interface SelectedFacility {
  id: number;
  name: string;
  location: string;
  description: string;
  images: string[];
  amenities: string[];
  packages: PackagesDto[];
  rooms: RoomDto[];
}

export interface RoomResponseDto {
  roomTypeId: number;
  roomType: string;
  roomPricing?: RoomPricingDto[];
}

export interface PackagesDto {
  packageId: number;
  packageName: string;
  duration?: string  | number;
  pricing: pricingDto[];
  requiresDates?: boolean;
}

export interface pricingDto {
  sector: string; 
  price: number;
}

export interface RoomDto {
  roomTypeId: number;
  roomType: string;
  roomPricing?: RoomPricingDto[]; 
}

export interface RoomPricingDto {
  sector: string; 
  price: number;
}

export interface ApiResponse {
  value: {
    facilityId: number;
    facilityName: string;
    location: string;
    description?: string;
    imageUrls?: string[];
    attributes?: string[];
    packages?: PackagesDto[];
    rooms?: RoomDto[];
  };
  isSuccess: boolean;
}

export interface BookingItemDto {
  itemId: number;
  type: "package" | "room";
  quantity: number;
}

export interface AvailabilityResponseDto {
  isAvailable: boolean; 
  message: string;      
}



