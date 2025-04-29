export interface ReservationPayload {
  StartDate: string;
  EndDate: string;
  Total: number;
  CustomerType: "private" | "public" | "corporate";
  Items: Array<{
    itemId: number; 
    quantity: number;  
    type: "room" | "package";
  }>;
  UserDetails: {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber?: string;
    Address?: string;
    City?: string;
    Country?: string;
    OrganizationName?: string;
  };
}