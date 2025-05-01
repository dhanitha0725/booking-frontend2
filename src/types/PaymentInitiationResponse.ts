export interface PaymentInitiationResponse {
  actionUrl: string;       // URL where the user will be redirected to complete payment
  merchantId: string;      // The merchant ID from PayHere settings
  returnUrl: string;       // URL to redirect after successful payment
  cancelUrl: string;       // URL to redirect after cancelled payment
  notifyUrl: string;       // URL for PayHere to send payment notifications
  hash: string;            // MD5 hash for security verification
  
  // Customer details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  
  // Order details
  items: string;           // Description of items being purchased
  orderId: string;         // Your unique order identifier
  currency: string;        // Currency code (e.g., "LKR")
  amount: number;          // Payment amount
  amountFormatted?: string; // Formatted amount string with 2 decimal places
}