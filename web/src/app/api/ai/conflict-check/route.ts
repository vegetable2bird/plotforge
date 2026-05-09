import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * 冲突检测引擎 API
 *
 * 检查新内容与已有设定（角色、世界观、阵营）之间的潜在冲突。
 *
 * POST /api/ai/conflict-check
 * Body: { workId: string, content: string, sourceType: string }
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { workId, content, sourceType = "chapter" } = body;

  if (!workId || !content) {
    return NextResponse.json({ error: "workId and content are required" }, { status: 400 });
  }

  try {
    // 并行获取所有需要检测冲突的实体
    const [characters, loreEntries, factions] = await Promise.all([
      prisma.character.findMany({ where: { workId }, select: { id: true, name: true, personality: true, backstory: true, habits: true, taboo: true } }),
      prisma.loreEntry.findMany({ where: { workId }, select: { id: true, title: true, summary: true, category: true } }),
      prisma.faction.findMany({ where: { workId }, select: { id: true, name: true, stance: true, doctrine: true } }),
    ]);

    // 运行冲突检测规则
    const conflicts = runConflictDetection(content, { characters, loreEntries, factions });

    // 将检测到的冲突持久化到数据库
    if (conflicts.length > 0) {
      await Promise.all(
        conflicts.map((conflict) =>
          prisma.conflictRecord.create({
            data: {
              workId,
              sourceType,
              title: conflict.title,
              message: conflict.message,
              severity: conflict.severity,
            },
          })
        )
      );
    }

    return NextResponse.json({
      conflicts,
      summary: {
        total: conflicts.length,
        high: conflicts.filter((c) => c.severity === "high").length,
        medium: conflicts.filter((c) => c.severity === "medium").length,
      },
    });
  } catch (err) {
    console.error("Conflict check error:", err);
    return NextResponse.json({ error: "Conflict check failed" }, { status: 500 });
  }
}

/**
 * 冲突检测规则引擎
 *
 * 基于规则的检测（非 AI），检查：
 * 1. 角色行为是否违反 taboo（禁忌）
 * 2. 角色性格描述是否与已有人设矛盾
 * 3. 世界观引用是否与已有词条矛盾
 * 4. 阵营关系描述是否与已知立场矛盾
 */
function runConflictDetection(
  content: string,
  context: {
    characters: Array<{ name: string; personality: string; backstory: string; habits: string; taboo: string }>;
    loreEntries: Array<{ title: string; summary: string; category: string }>;
    factions: Array<{ name: string; stance: string; doctrine: string }>;
  }
): Array<{ title: string; message: string; severity: "high" | "medium" }> {
  const conflicts: Array<{ title: string; message: string; severity: "high" | "medium" }> = [];
  const text = content.toLowerCase();

  // 规则 1：检查角色禁忌
  for (const char of context.characters) {
    if (char.taboo && char.taboo.length > 2) {
      const taboos = (JSON.parse(char.taboo || "[]") ?? []) as string[];
      // 简单的关键词匹配（生产环境应使用语义分析/AI）
      for (const taboo of taboos) {
        if (taboo && text.includes(taboo.toLowerCase())) {
          conflicts.push({
            title: `角色「${char.name}」可能触犯禁忌`,
            message: `内容中出现了 "${taboo}"，这与 ${char.name} 的设定禁忌存在潜在冲突。请确认这是否是刻意安排的情节突破。`,
            severity: "high",
          });
        }
      }
    }
  }

  // 规则 2：检查世界观一致性
  for (const lore of context.loreEntries) {
    // 检测是否有对同一概念的不同描述（简化版）
    if (lore.category === "世界法则" && lore.summary.length > 10) {
      const keywords = lore.title.split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
      for (const kw of keywords) {
        if (kw.length > 1 && text.includes(kw.toLowerCase())) {
          conflicts.push({
            title: `世界观引用提醒：「${lore.title}」`,
            message: `内容中涉及「${kw}」，请确保与已有的世界观设定一致。当前设定：${lore.summary.slice(0, 80)}...`,
            severity: "medium",
          });
        }
      }
    }
  }

  // 规则 3：检查阵营立场
  for (const faction of context.factions) {
    if (faction.stance && faction.stance.length > 2) {
      const stanceKeywords = faction.stance.split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
      for (const kw of stanceKeywords.slice(0, 3)) {
        if (kw.length > 1 && text.includes(faction.name) && text.includes(kw)) {
          conflicts.push({
            title: `阵营立场参考：「${faction.name}」`,
            message: `文中提到了 ${faction.name}，其立场为"${faction.stance}"。请确认描述与其阵营立场一致。`,
            severity: "medium",
          });
        }
      }
    }
  }

  // 去重（按 title）
  const seen = new Set<string>();
  return conflicts.filter((c) => {
    if (seen.has(c.title)) return false;
    seen.add(c.title);
    return true;
  });
}
