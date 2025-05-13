export type ReportType = "revenue" | "bookings" | "facilities" | "customers" | "payments";
export type ExportFormat = "pdf" | "excel" | "csv";

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

export interface ReportTypeOption {
  value: ReportType;
  label: string;
  icon: React.ReactNode;
}

export interface ExportFormatOption {
  value: ExportFormat;
  label: string;
  icon: React.ReactNode;
}