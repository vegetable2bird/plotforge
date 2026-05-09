import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    // TODO: replace with bcrypt compare
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
