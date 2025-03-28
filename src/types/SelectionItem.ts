export interface SelectionItem {
    facilityName: string;
    defaultDuration: number;
    pricing: {
      private: {
        perDay: number | null;
        perHour: number | null;
      };
      public: {
        perDay: number | null;
        perHour: number | null;
      };
      corporate: {
        perDay: number | null;
        perHour: number | null;
      };
    };
  }
