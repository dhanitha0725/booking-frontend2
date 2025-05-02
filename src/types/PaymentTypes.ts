export interface FormData {
  startDate: string;
  endDate: string;
  items: Array<{ itemId: number; quantity: number; type: string }>;
  userDetails: UserDetails;
  customerType: string;
  reservationId?: number; 
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
  orderId: string;         
  amount: number;          
  currency: string;       
  firstName: string;       
  lastName: string;        
  email: string;           
  phone: string;           
  address: string;         
  city: string;            
  country: string;         
  items: string;           
  reservationId: number;   
}