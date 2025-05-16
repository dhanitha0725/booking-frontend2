// Room pricing response from API
export interface RoomPricingResponse {
  roomTypeId: number;
  roomTypeName: string;
  facilityName: string;
  totalRooms: number;
  pricings: {
    public?: number;
    private?: number;
    corporate?: number;
  };
}

// Room pricing for table
export interface RoomPricing {
  pricingId: number;
  roomTypeId: number;
  roomTypeName: string;
  facilityName: string;
  totalRooms: number;
  publicPrice: number;
  privatePrice: number;
  corporatePrice: number;
}