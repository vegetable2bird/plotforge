import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workId = searchParams.get("workId") ?? undefined;
  const where = workId ? { workId } : {};
  const snapshots = await prisma.snapshot.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(snapshots);
}

export async function POST(request: Request) {
  const body = await request.json();
  const snapshot = await prisma.snapshot.create({ data: body });
  return NextResponse.json(snapshot, { status: 201 });
}
