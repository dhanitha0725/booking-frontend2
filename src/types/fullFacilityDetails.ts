export interface ChildFacility {
  facilityID: number;
  facilityName: string;
  facilityType: string;
  status: string;
}

export interface FacilityImage {
  url: string;
  caption?: string;
}

export interface FullFacilityDetails {
  facilityID: number;
  facilityName: string;
  facilityType: string;
  location: string;
  description: string;
  status: string;
  createdDate: string;
  attributes: string[];
  childFacilities: ChildFacility[];
  images: FacilityImage[];
}

export interface FullFacilityInfoProps {
  open: boolean;
  onClose: () => void;
  facilityId: number | null;
}