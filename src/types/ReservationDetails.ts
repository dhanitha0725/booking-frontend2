/**
 * Type definitions related to reservations
 */

// Define Reservation Status type for type safety
export type ReservationStatus =
  | "PendingApproval"
  | "PendingPayment"
  | "PendingPaymentVerification"
  | "Approved"
  | "Completed"
  | "Cancelled"
  | "Confirmed"
  | "Expired";

// Define User Type for type safety
export type UserType = "public" | "private" | "corporate";

// Basic Reservation interface for table display
export interface Reservation {
  reservationId: number;
  startDate: string | Date;
  endDate: string | Date;
  createdDate: string | Date;
  total: number;
  status: ReservationStatus;
  userType: UserType;
}

// User information related to a reservation
export interface ReservationUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  organizationName?: string;
}

// Package reservation information
export interface ReservedPackage {
  packageName: string;
  facilityName: string;
}

// Room reservation information
export interface ReservedRoom {
  roomType: string;
  facilityName: string;
}

// Payment information for a reservation
export interface PaymentDetails {
  orderID: string;
  method: string;
  amountPaid: number;
  createdDate: string;
  status: string;
}

// Add this if not already present
export interface DocumentDetails {
  documentId: number;
  documentType: "ApprovalDocument" | "BankReceipt";
  url: string;
  status?: string; 
}

// Complete reservation details for the full view
export interface FullReservationDetails {
  reservationId: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  updatedDate: string | null;
  total: number;
  status: ReservationStatus;
  userType: UserType;
  user: ReservationUser;
  payments: PaymentDetails[];
  reservedPackages: ReservedPackage[];
  reservedRooms: ReservedRoom[];
  documents?: DocumentDetails[];
}

// Props for the FullReservationInfo component
export interface FullReservationInfoProps {
  open: boolean;
  onClose: () => void;
  reservationId?: number;
}

// For internal use in BookedItemsSection
export interface BookedItem {
  id: number;
  name: string;
  type: "Package" | "Room";
  price: number;
  quantity: number;
  facilityName: string;
}