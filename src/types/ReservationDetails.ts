// Define Reservation Status type for type safety
export type ReservationStatus =
  | "PendingApproval"
  | "PendingPayment"
  | "Approved"
  | "Completed"
  | "Cancelled"
  | "Confirmed"
  | "Expired";

// Define User Type for type safety
export type UserType = "public" | "private" | "corporate";

// Interface for Reservation data for the table
export interface Reservation {
  reservationId: number;
  startDate: string | Date;
  endDate: string | Date;
  createdDate: string | Date;
  total: number;
  status: ReservationStatus;
  userType: UserType;
}

export interface ReservationUser {
  userId: number;
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organizationName?: string;
}

export interface BookedItem {
  id: number;
  name: string;
  type: string; // "Package" or "Room"
  price: number;
  quantity?: number;
  details?: string;
}

export interface PaymentDocument {
  id: number;
  name: string;
  url: string;
  uploadDate: string;
}

export interface PaymentDetails {
  orderId: string;
  amountPaid: number;
  paymentMethod: string;
  paidDate: string;
  documents?: PaymentDocument[];
  status: string;
}

export interface FullReservationDetails {
  reservationId: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  updatedDate?: string;
  total: number;
  bookedItems: BookedItem[];
  user: ReservationUser;
  payment: PaymentDetails;
  status: string;
}

export interface FullReservationInfoProps {
  open: boolean;
  onClose: () => void;
  reservationId?: number;
}