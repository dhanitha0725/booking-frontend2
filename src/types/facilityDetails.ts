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
  };
}