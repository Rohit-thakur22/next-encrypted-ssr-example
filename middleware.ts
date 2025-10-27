import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "https://nextencrypted.agileappdemo.com");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return response;
}
