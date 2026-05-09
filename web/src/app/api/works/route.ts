import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") ?? undefined;
  const where = userId ? { userId } : {};
  const works = await prisma.work.findMany({ where, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(works);
}

export async function POST(request: Request) {
  const body = await request.json();
  const work = await prisma.work.create({ data: body });
  return NextResponse.json(work, { status: 201 });
}
