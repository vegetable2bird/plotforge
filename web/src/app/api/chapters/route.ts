import { NextResponse } from "next/server";
import { repositories } from "@/lib/repositories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("workId") ?? undefined;
    const chapters = await repositories.chapters.findAll(workId);
    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chapter = await repositories.chapters.create(body);
    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
