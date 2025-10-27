import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "https://rc8wc0o080kc4kc4ck8sok48.62.72.57.193.sslip.io");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return response;
}
