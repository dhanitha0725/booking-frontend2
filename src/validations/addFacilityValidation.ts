import * as z from "zod";

export const addFacilitySchema = z.object({
  facilityName: z.string().min(1, "Facility name is required")
  .max(100, "Facility name cannot exceed 100 characters"),
  location: z.string()
  .min(1, "Location is required")
  .max(100, "Location cannot exceed 100 characters"),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Maintenance"]),
  facilityTypeId: z.number()
  .min(1, "Facility type is not valid or does not exist"),
  attributes: z.array(z.string().min(1, "Attribute cannot be empty")),
  parentFacilityId: z.number().optional().nullable(),
});

export type AddFacilityFormData = z.infer<typeof addFacilitySchema>;