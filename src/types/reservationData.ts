export interface TempReservation {
  facilityId: number;
  customerType: "corporate" | "public" | "private";
  startDate: string;
  endDate: string;
  selectedItems: BookingItemDto[];
  userInfo?: UserInfo;
  paymentDetails?: PaymentDetails;
  documents?: File[];
  total: number;
}

export interface PaymentDetails {
  paymentMethod: string;
  amount: number;
  transactionId?: string;
  paymentDate?: string;
}

export interface BookingItemDto {
  itemId: number;
  type: "room" | "package";
  quantity: number;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  organizationName?: string;
}

export interface ReservationResultDto {
  // Core reservation identifiers
  reservationId: number;
  facilityId: number;
  facilityName: string;

  // Timing information
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;

  // Pricing details
  totalPrice: number;
  amountPaid?: number;
  amountDue?: number;

  // Status information
  status: "PendingApproval" | "PendingPayment" | "PartialPayment" | "Approved" | "Completed" | "Cancelled";
  documentStatus?: "Pending" | "Approved" | "Rejected"; // Only for corporate/public
  paymentStatus?: "Unpaid" | "Partial" | "Paid";

  // User-facing information
  customerType: "corporate" | "public" | "private";
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    organizationName?: string;
  };

  // Reservation contents
  items: Array<{
    itemId: number;
    type: "room" | "package";
    name: string; // Room type or package name
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  }>;

  // Payment workflow information
  paymentMethod?: string;
  paymentDueDate?: string; // For pending payments
  paymentLink?: string; // If payment gateway integrated
  reservationExpiry?: string; // When reservation will expire if not paid

  // Additional metadata
  reservationDuration?: string; // Human-readable duration
  facilityLocation?: string;
}