import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  if (!email || !name || !password) {
    return NextResponse.json({ error: "Email, name and password are required" }, { status: 400 });
  }

  // 检查是否已存在
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  // 简单的密码存储（生产环境应使用 bcrypt）
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword, { status: 201 });
}
