"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const cookieList = cookies();

  for (const cookie in cookieList) {
    cookies().delete(cookie);
  }

  return redirect("/");
}
