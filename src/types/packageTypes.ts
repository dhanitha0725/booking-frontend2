
export interface Package {
  packageId: number;
  packageName: string;
  duration: string;
  publicPrice: number;
  privatePrice: number;
  corporatePrice: number;
  facilityId: number;
  facilityName: string;
}

export interface PackageResponse {
  packageId: number;
  packageName: string;
  duration: string;
  facilityName: string;
  facilityId?: number;
  pricings: {
    private: number;
    public: number;
    corporate: number;
  };
}