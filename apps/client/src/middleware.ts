import { api } from "@finance/eden";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("middleware ran");
  const session = request.cookies.get("token")?.value;

  if (!session) return NextResponse.redirect(new URL("/", request.url));

  const { data, error } = await api.auth.refresh.post({
    $headers: { Authorization: `Bearer ${session}` },
  });

  if (error) return NextResponse.redirect(new URL("/", request.url));

  const response = NextResponse.next();

  response.cookies.set({
    name: "token",
    value: data.token,
    httpOnly: true,
    expires: new Date(data.expiration),
  });

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
