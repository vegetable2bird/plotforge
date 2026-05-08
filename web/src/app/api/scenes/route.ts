import { NextResponse } from "next/server";
import { repositories } from "@/lib/repositories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("workId") ?? undefined;
    const scenes = await repositories.scenes.findAll(workId);
    return NextResponse.json(scenes);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scene = await repositories.scenes.create(body);
    return NextResponse.json(scene, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
