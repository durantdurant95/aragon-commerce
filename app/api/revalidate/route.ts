import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Revalidation is not needed for static data
  // This endpoint is kept for compatibility but does nothing
  return NextResponse.json({ status: 200 });
}
