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
  // reservation details
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
  documentStatus?: "Pending" | "Approved" | "Rejected";
  paymentStatus?: "Unpaid" | "Partial" | "Paid";

  // User-form information
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
    name: string; // room type or package name
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  }>;
}