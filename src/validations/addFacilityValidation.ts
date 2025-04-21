import * as z from "zod";

export const addFacilitySchema = z.object({
  facilityName: z.string().min(1, "Facility name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Maintenance"]),
  facilityTypeId: z.number().min(1, "Facility type is required"),
  attributes: z.array(z.string().min(1, "Attribute cannot be empty")),
  parentFacilityId: z.number().optional().nullable(),
});

export type AddFacilityFormData = z.infer<typeof addFacilitySchema>;