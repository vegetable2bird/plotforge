import { NextResponse } from "next/server";
import { repositories } from "@/lib/repositories";

export async function GET() {
  try {
    const nodes = await repositories.relations.findAllNodes();
    return NextResponse.json(nodes);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const node = await repositories.relations.createNode(body);
    return NextResponse.json(node, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
