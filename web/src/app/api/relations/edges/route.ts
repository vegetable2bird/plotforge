import { NextResponse } from "next/server";
import { repositories } from "@/lib/repositories";

export async function GET() {
  try {
    const edges = await repositories.relations.findAllEdges();
    return NextResponse.json(edges);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const edge = await repositories.relations.createEdge(body);
    return NextResponse.json(edge, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
