import { Facility } from "../types/facilityDetails";

export const mockFacilities: Facility[] = [
  {
    id: 1,
    name: "Grand Ballroom",
    type: "hall",
    description:
      "Our Grand Ballroom is a versatile and elegant space perfect for weddings, corporate events, and large gatherings. With high ceilings, crystal chandeliers, and a spacious dance floor, this venue offers a sophisticated backdrop for your special occasion.",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=80",
      "https://images.unsplash.com/photo-1515095184717-4f2e1509c564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1562664377-709f2c337eb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1262&q=80",
    ],
    location: "Downtown, 123 Main Street, New York, NY 10001",
    rating: 4.8,
    reviews: 124,
    capacity: "300-500",
    size: "10,000 sq ft",
    hours: "8:00 AM - 12:00 AM",
    featured: true,
    amenities: [
      "Professional sound system",
      "Stage with lighting",
      "Catering kitchen",
      "Coat check",
      "Bridal suite",
      "Tables and chairs included",
      "Wheelchair accessible",
      "Parking available",
      "WiFi",
      "Air conditioning",
      "Projector and screen",
      "Dance floor",
    ],
    pricing: {
      public: {
        weekday: "$1200/day",
        weekend: "$1800/day",
        hourly: "$150/hour",
        setup: "$200",
        cleaning: "$150",
      },
      private: {
        weekday: "$1000/day",
        weekend: "$1500/day",
        hourly: "$125/hour",
        setup: "$150",
        cleaning: "$100",
      },
      corporate: {
        weekday: "$1500/day",
        weekend: "$2200/day",
        hourly: "$200/hour",
        setup: "$250",
        cleaning: "$200",
      },
    },
    availability: {
      monday: "8:00 AM - 10:00 PM",
      tuesday: "8:00 AM - 10:00 PM",
      wednesday: "8:00 AM - 10:00 PM",
      thursday: "8:00 AM - 10:00 PM",
      friday: "8:00 AM - 12:00 AM",
      saturday: "10:00 AM - 12:00 AM",
      sunday: "10:00 AM - 10:00 PM",
    },
    policies: [
      "Cancellation must be made 30 days in advance for a full refund",
      "Security deposit of $500 required",
      "No smoking inside the facility",
      "Outside catering allowed with approval",
      "Alcohol service requires licensed bartender",
      "Music must end by 11:00 PM on weekdays",
    ],
  }
];