import { NextResponse } from "next/server";
import { repositories } from "@/lib/repositories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workId = searchParams.get("workId") ?? undefined;
    const characters = await repositories.characters.findAll(workId);
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const character = await repositories.characters.create(body);
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
