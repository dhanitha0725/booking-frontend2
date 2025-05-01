// PaymentTypes.ts
export interface FormData {
  startDate: string;
  endDate: string;
  items: Array<{ itemId: number; quantity: number; type: string }>;
  userDetails: UserDetails;
  customerType: string;
  reservationId?: number; // Added reservationId field
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  organizationName: string;
}

export interface ValidationResult {
  isValid: boolean;
  invalidItems?: Array<{ itemId: number; quantity: number; type: string }>;
}

export interface PaymentRequest {
  orderId: string;         // Required: Unique order identifier
  amount: number;          // Required: Payment amount (must be > 0)
  currency: string;        // Optional: Currency code (default is "LKR", must be 3 chars)
  firstName: string;       // Required: Customer's first name
  lastName: string;        // Required: Customer's last name
  email: string;           // Required: Valid email address
  phone: string;           // Required: Phone number (must be 10 digits)
  address: string;         // Required: Customer's address
  city: string;            // Required: Customer's city
  country: string;         // Optional: Default is "Sri Lanka"
  items: string;           // Required: Description of items being purchased
  reservationId: number;   // Required: ID of the reservation (must be > 0)
}