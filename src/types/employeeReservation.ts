import { Dayjs } from "dayjs";

// Customer types
export type CustomerType = "corporate" | "public" | "private";

// Facility interface
export interface Facility {
  facilityID: number;
  facilityName: string;
}

// Facility data with specific types
export interface FacilityData {
  packages: PackagesDto[];
  rooms: RoomDto[];
}

// Packages and Rooms interfaces
export interface PackagesDto {
  packageId: number;
  packageName: string;
  duration?: string;
  pricing: PricingDto[];
  requiresDates?: boolean;
}

export interface RoomDto {
  roomTypeId: number;
  roomType: string;
  roomPricing?: RoomPricingDto[];
}

export interface PricingDto {
  sector: string;
  price: number;
}

export interface RoomPricingDto {
  sector: string;
  price: number;
}

export interface BookingItemDto {
  itemId: number;
  type: "package" | "room";
  quantity: number;
  name?: string;
}

export interface DateRangeType {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}