export interface ApiFacility {
  facilityID: number;
  facilityName: string;
  status?: string;
  parentFacilityID?: number;
  location?: string;
  description?: string;
}

export interface SimpleFacility {
  id: number;
  name: string;
}