import type { LoreEntry } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";
import type { Repository } from "./base";

export type CreateLoreInput = Omit<LoreEntry, "id" | "createdAt" | "updatedAt">;
export type UpdateLoreInput = Partial<CreateLoreInput>;

export interface LoreRepository extends Repository<LoreEntry, CreateLoreInput, UpdateLoreInput> {}

export function createLoreRepository(prisma: PrismaClient): LoreRepository {
  return {
    async findAll(workId?: string) {
      const where = workId ? { workId } : {};
      const records = await prisma.loreEntry.findMany({ where, orderBy: { category: "asc" } });
      return records.map(mapFromPrisma);
    },

    async findById(id: string) {
      const record = await prisma.loreEntry.findUnique({ where: { id } });
      return record ? mapFromPrisma(record) : null;
    },

    async create(data: CreateLoreInput) {
      const record = await prisma.loreEntry.create({
        data: {
          ...data,
          linkedTitles: JSON.stringify(data.linkedTitles ?? []),
        },
      });
      return mapFromPrisma(record);
    },

    async update(id: string, data: UpdateLoreInput) {
      const prismaData: Record<string, unknown> = {};
      if (data.category !== undefined) prismaData.category = data.category;
      if (data.workId !== undefined) prismaData.workId = data.workId;
      if (data.title !== undefined) prismaData.title = data.title;
      if (data.summary !== undefined) prismaData.summary = data.summary;
      if (data.linkedTitles !== undefined) prismaData.linkedTitles = JSON.stringify(data.linkedTitles);
      if (data.riskLevel !== undefined) prismaData.riskLevel = data.riskLevel;

      const record = await prisma.loreEntry.update({ where: { id }, data: prismaData });
      return mapFromPrisma(record);
    },

    async delete(id: string) {
      await prisma.loreEntry.delete({ where: { id } });
    },
  };
}

function mapFromPrisma(record: Record<string, unknown>): LoreEntry {
  return {
    id: record.id as string,
    workId: record.workId as string,
    category: record.category as string,
    title: record.title as string,
    summary: record.summary as string,
    linkedTitles: parseJsonArray(record.linkedTitles as string),
    riskLevel: record.riskLevel as "stable" | "warning",
  };
}

function parseJsonArray(value: string): string[] {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
