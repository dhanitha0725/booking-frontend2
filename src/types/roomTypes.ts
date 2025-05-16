export interface RoomType {
  roomTypeId: number;
  roomTypeName: string;
}

export interface AddRoomRequest {
  roomTypeId: number;
  quantity: number;
  capacity: number;
  numberOfBeds: number;
}

export interface RoomTypeResponse {
  roomTypes: RoomType[];
}