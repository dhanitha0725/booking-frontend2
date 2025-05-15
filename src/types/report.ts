export type ReportType = "financial" | "reservation"; 
export type ExportFormat = "pdf";

export interface Facility {
  facilityID: number;
  facilityName: string;
}

export interface FinancialReportItem {
  facilityId: number;
  facilityName: string;
  totalReservations: number;
  totalRevenue: number;
}

export interface ReservationReportItem {
  facilityId: number;
  facilityName: string;
  totalReservations: number;
  totalCompletedReservations: number;
}

export interface ReportTypeOption {
  value: ReportType;
  label: string;
  icon: React.ReactNode;
}