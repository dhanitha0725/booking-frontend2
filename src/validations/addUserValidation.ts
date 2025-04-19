import { z } from "zod";

const roles = ["Admin", "Employee", "Accountant", "Hostel"] as const;

export const addUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
  role: z.enum(roles, {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;