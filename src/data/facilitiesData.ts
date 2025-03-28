import { Facility } from '../types/facility';

// Temporary mock data for development
const mockFacilities: Facility[] = [
  {
    id: 18,
    name: "Grand Ballroom",
    type: "Event Space",
    description: "Elegant ballroom for weddings and corporate events",
    images: ["https://example.com/ballroom1.jpg", "https://example.com/ballroom2.jpg"],
    location: "Colombo 03",
    amenities: ["Stage", "Dance floor", "Sound system", "Projector"],
    pricing: {
      public: 150000,
      private: 125000,
      corporate: 200000
    },
    packages: [
      {
        id: "pkg1",
        name: "Basic Package",
        description: "Venue rental for 12 hours",
        pricing: {
          public: 150000,
          private: 125000,
          corporate: 200000
        }
      },
      {
        id: "pkg2",
        name: "Premium Package",
        description: "Venue rental with catering for 100 people",
        pricing: {
          public: 350000,
          private: 325000,
          corporate: 400000
        }
      }
    ]
  },
  {
    id: 2,
    name: "Conference Hall",
    type: "Meeting Space",
    description: "Professional space for meetings and conferences",
    images: ["https://example.com/conference1.jpg"],
    location: "Colombo 04",
    amenities: ["Whiteboard", "Video conferencing", "Coffee service"],
    pricing: {
      public: 75000,
      private: 60000,
      corporate: 100000
    }
  }
];

export const getFacilityById = (id: number): Facility | undefined => {
  // In production, this would make an API call
  // return axios.get(`http://localhost:5162/api/Facility/${id}`).then(res => res.data);
  
  // For development, using mock data
  return mockFacilities.find(facility => facility.id === id);
};

export const getAllFacilities = (): Facility[] => {
  // In production, this would make an API call
  // return axios.get('http://localhost:5162/api/Facility').then(res => res.data);
  
  // For development, using mock data
  return mockFacilities;
};
