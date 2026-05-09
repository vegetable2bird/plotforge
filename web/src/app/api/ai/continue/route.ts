import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * AI 续写 API
 *
 * 接收当前章节内容，调用 AI 模型生成续写建议。
 * 目前为模拟实现，后续可接入 OpenAI / Claude / 本地模型。
 *
 * POST /api/ai/continue
 * Body: { workId: string, chapterId: string, content: string, context?: string }
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { workId, chapterId, content, context } = body;

  if (!workId || !chapterId || !content) {
    return NextResponse.json({ error: "workId, chapterId and content are required" }, { status: 400 });
  }

  try {
    // 获取章节和作品信息用于构建 prompt
    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // 获取角色信息作为上下文
    const characters = await prisma.character.findMany({
      where: { workId },
      take: 10,
      select: { name: true, role: true, personality: true },
    });

    // TODO: 接入真实 AI 模型（OpenAI / Claude / Ollama）
    // 当前返回模拟数据，结构兼容前端 AiSuggestion 类型
    const suggestion = {
      id: `ai-suggest-${Date.now()}`,
      chapterId,
      type: "continuation",
      label: "AI 续写建议",
      content: generateMockContinuation(content, characters.map((c: { name: string }) => c.name)),
      tension: "medium" as const,
    };

    // 记录 AI 使用
    await prisma.aiGenerationRecord.create({
      data: {
        workId,
        moduleType: "continuation",
        model: "mock", // TODO: 替换为真实模型名
        promptDigest: `续写章节 ${chapter.title}, 输入长度 ${content.length}`,
        status: "ready",
      },
    });

    return NextResponse.json(suggestion);
  } catch (err) {
    console.error("AI continuation error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}

function generateMockContinuation(currentContent: string, characterNames: string[]): string {
  const lastParagraph = currentContent.trim().split("\n").pop() ?? "";
  const char = characterNames.length > 0 ? characterNames[0] : "主角";

  return `[AI 续写 - 待接入真实模型]\n\n${lastParagraph ? `承接上文：「${lastParagraph.slice(0, 50)}...」\n\n` : ""}场景继续推进。${char} 的目光扫过前方，空气中弥漫着一种微妙的张力。这一刻的沉默比任何语言都更有分量——接下来的行动将决定事情的发展方向。\n\n> 💡 提示：接入 OpenAI / Claude API 后，这里将显示真实的 AI 续写内容。`;
}
