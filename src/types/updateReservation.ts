import { CustomerType, DateRangeType } from "./employeeReservation";

export interface Package {
  packageId: number;
  packageName: string;
  duration: number; 
  pricing: Array<{ sector: string; price: number }>;
}

export interface Room {
  roomTypeId: number;
  roomType: string;
  roomPricing: Array<{ 
    sector: string; 
    price: number }>;
}

export interface SelectedFacilityDetails {
  facilityId: number;
  facilityName: string;
  location: string;
  description: string;
  attributes: string[];
  imageUrls: string[];
  packages: Package[];
  rooms: Room[];
}

export interface FacilityResponse {
  isSuccess: boolean;
  value?: SelectedFacilityDetails;
  error?: string;
}

export interface FacilityData {
  packages?: Package[];
  rooms?: Room[];
}

export interface BookingItemDto {
  itemId: number;
  type: "package" | "room";
  quantity: number;
  name?: string;
  price?: number;
}

export interface AvailabilityResponseDto {
  isAvailable: boolean;
  message: string;
}

export interface UpdateReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservation: Reservation | null;
}

export interface ReservationState {
  facilityId: number | null;
  facilityData: FacilityData | null;
  dateRange: DateRangeType;
  customerType: CustomerType;
  selectedItems: BookingItemDto[];
  originalItems: BookingItemDto[];
  requiresDates: boolean;
  total: number;
}

export interface UpdatePayload {
  reservationId: number;
  startDate?: string;
  endDate?: string;
  total: number;
  packageUpdates: Array<{ itemId: number; quantity: number; type: string }>;
  roomUpdates: Array<{ itemId: number; quantity: number; type: string }>;
}

// Interface for Reservation used in UpdateReservationDialog.tsx
export interface Reservation {
  reservationId: number;
  facilityId: number;
  startDate: string | Date;
  endDate: string | Date;
  createdDate: string | Date;
  total: number;
  status: ReservationStatus;
  userType: UserType;
  reservedPackages?: ReservedPackage[];
  reservedRooms?: ReservedRoom[];
}

// Supporting interfaces
export type ReservationStatus =
  | "PendingApproval"
  | "PendingPayment"
  | "PendingPaymentVerification"
  | "PendingCashPayment"
  | "Approved"
  | "Completed"
  | "Cancelled"
  | "Confirmed"
  | "Expired";

export type UserType = "public" | "private" | "corporate";

export interface ReservedPackage {
  packageId: number; 
  packageName: string;
}

export interface ReservedRoom {
  roomTypeId: number; 
  roomType: string;
}