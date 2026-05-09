import type { Work, WorkSummary } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";
import type { Repository } from "./base";

export type CreateWorkInput = Omit<Work, "id" | "createdAt" | "updatedAt">;
export type UpdateWorkInput = Partial<CreateWorkInput>;

export interface WorkRepository extends Repository<Work, CreateWorkInput, UpdateWorkInput> {}

export function createWorkRepository(prisma: PrismaClient): WorkRepository {
  return {
    async findAll(userId?: string) {
      const where = userId ? { userId } : {};
      const records = await prisma.work.findMany({ where, orderBy: { updatedAt: "desc" } });
      return records.map(mapFromPrisma);
    },

    async findById(id: string) {
      const record = await prisma.work.findUnique({ where: { id } });
      return record ? mapFromPrisma(record) : null;
    },

    async create(data: CreateWorkInput) {
      const record = await prisma.work.create({ data });
      return mapFromPrisma(record);
    },

    async update(id: string, data: UpdateWorkInput) {
      const record = await prisma.work.update({ where: { id }, data });
      return mapFromPrisma(record);
    },

    async delete(id: string) {
      await prisma.work.delete({ where: { id } });
    },
  };
}

export async function getWorkSummary(prisma: PrismaClient, workId: string): Promise<WorkSummary | null> {
  const work = await prisma.work.findUnique({
    where: { id: workId },
    include: {
      _count: {
        select: {
          chapters: true,
          characters: true,
          loreEntries: true,
          factions: true,
        },
      },
    },
  });

  if (!work) return null;

  return {
    ...mapFromPrisma(work),
    chapterCount: work._count.chapters,
    characterCount: work._count.characters,
    loreCount: work._count.loreEntries,
    factionCount: work._count.factions,
  };
}

function mapFromPrisma(record: Record<string, unknown>): Work {
  return {
    id: record.id as string,
    userId: record.userId as string,
    title: record.title as string,
    genre: record.genre as string,
    stage: record.stage as Work["stage"],
    summary: record.summary as string,
    theme: record.theme as Work["theme"],
    createdAt: record.createdAt as string,
    updatedAt: record.updatedAt as string,
  };
}
