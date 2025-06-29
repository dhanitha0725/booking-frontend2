import * as z from "zod";
import dayjs, { Dayjs } from "dayjs";

//package validations
export const packageSchema = z.object({
  facilityId: z.number().min(1, "Please select a facility"),
  packageName: z
    .string()
    .min(3, "Package name must be at least 3 characters")
    .max(100, "Package name cannot exceed 100 characters"),
  duration: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
  publicPrice: z.number().min(0, "Price cannot be negative"),
  corporatePrice: z.number().min(0, "Price cannot be negative"),
  privatePrice: z.number().min(0, "Price cannot be negative"),
});

export type PackageFormData = z.infer<typeof packageSchema>;

//room pricing validations
export const roomPricingSchema = z.object({
  facilityId: z.number().min(1, "Please select a facility"),
  roomTypeId: z.number().min(1, "Please select a room type"),
  publicPrice: z.number().min(0, "Price cannot be negative"),
  corporatePrice: z.number().min(0, "Price cannot be negative"),
  privatePrice: z.number().min(0, "Price cannot be negative"),
});

export type RoomPricingFormData = z.infer<typeof roomPricingSchema>;

//Helper function to format time value to string (HH:00:00)
export const formatTimeToString = (timeValue: Dayjs | null | undefined): string => {
  if (!timeValue) return "01:00:00"; // Default to 1 hour
  
  // Special handling for 24 hours / 1 day
  // Check if it's a special "24 hour" case (represented as day+1, hour 0)
  if (timeValue.date() > 1 && timeValue.hour() === 0) {
    return "1.00:00:00"; // Exactly one day format
  }
  
  const hours = timeValue.hour();
  
  // Format hourly durations with padding
  return `${hours.toString().padStart(2, "0")}:00:00`;
};