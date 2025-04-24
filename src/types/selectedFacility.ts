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

export interface PackagesDto {
  packageId: number;
  packageName: string;
  duration?: string // convert time span to string. (.net uses time span)
  pricing: pricingDto[];
  requiresDates?: boolean;
}

export interface pricingDto {
  sector: string; 
  price: number;
}

export interface RoomDto {
  roomId: number;
  roomType: string;
  pricing: RoomPricingDto[];
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
  details: Array<{
    itemName: string;
    isAvailable: boolean;
    message: string;
  }>;
}


