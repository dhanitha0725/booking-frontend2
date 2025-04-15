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
  phone?: string;
  organization?: string;
}