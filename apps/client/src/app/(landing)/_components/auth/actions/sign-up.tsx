"use server";

import { api } from "@finance/eden";
import { z } from "zod";

const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export async function signUp(values: z.infer<typeof SignUpSchema>) {
  const result = SignUpSchema.safeParse(values);

  if (!result.success) return "Invalid Data" as const;

  const { data, error } = await api.auth.register.post(values);

  if (error) {
    switch (error.status) {
      case 500:
        return error.message as
          | "Email is already in use"
          | "Error creating user";
      default:
        return "An error occurred";
    }
  }

  return { id: data.id };
}
