import { z } from "zod";

export const userFormValidation = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .optional()
    .refine(
      (val) => !val || /^(\+?94|0)[0-9]{9}$/.test(val),
      "Phone number must be a valid Sri Lankan number (e.g., 0712345678 or +94712345678)"
    ), 
  organizationName: z.string().optional(), 
});