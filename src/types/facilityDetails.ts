export interface Facility {
  id: number;
  name: string;
  type: string;
  description: string;
  images: string[];
  location: string;
  rating: number;
  reviews: number;
  capacity: string;
  size: string;
  hours: string;
  featured: boolean;
  amenities: string[];
  pricing: {
    public: { weekday: string; weekend: string; hourly: string; setup: string; cleaning: string };
    private: { weekday: string; weekend: string; hourly: string; setup: string; cleaning: string };
    corporate: { weekday: string; weekend: string; hourly: string; setup: string; cleaning: string };
  };
  availability: Record<string, string>;
  policies: string[];
}