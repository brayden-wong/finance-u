"use server";

import { api } from "@finance/eden";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8),
});

type SignIn = z.infer<typeof SignInSchema>;

export async function signIn(payload: SignIn) {
  const result = SignInSchema.safeParse(payload);

  if (!result.success) return "Invalid Credentials";

  const { data, error } = await api.auth.login.post(payload);

  if (error) {
    switch (error.status) {
      case 401:
        return "Invalid Credentials";
      case 404:
        "User not found";
      default:
        return "Something went wrong please try again";
    }
  }

  cookies().set("token", data.token, {
    expires: new Date(data.expiration),
    path: "/",
  });

  redirect("/dashboard");
}
