export interface Facility {
  id: number;
  name: string;
  type: string;
  description: string;
  images: string[];
  location: string;
  amenities: string[];
  pricing: {
    public: number;
    private: number;
    corporate: number;
    perDay?: number; // Added perDay property
  };
  packages?: Package[];
}

export interface Package { // Export this interface
  id: string;
  name: string;
  description: string;
  pricing: {
    public: number;
    private: number;
    corporate: number;
    perDay?: number; // Added perDay property
  };
}