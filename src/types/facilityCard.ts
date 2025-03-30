export interface Facility {
  facilityID: number;
  facilityName: string;
  location: string;
  imageUrl?: string;
  price: number;
  description?: string;
}

// API response interface
export interface ApiResponse {
  isSuccess: boolean;
  value?: Facility[];
  error?: string;
}

