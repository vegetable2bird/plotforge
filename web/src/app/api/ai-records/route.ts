import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workId = searchParams.get("workId") ?? undefined;
  const where = workId ? { workId } : {};
  const records = await prisma.aiGenerationRecord.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const body = await request.json();
  const record = await prisma.aiGenerationRecord.create({ data: body });
  return NextResponse.json(record, { status: 201 });
}
