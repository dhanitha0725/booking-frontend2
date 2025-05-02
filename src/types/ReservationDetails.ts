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