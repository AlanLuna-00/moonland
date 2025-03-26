import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const validKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validKey) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
