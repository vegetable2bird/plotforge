import type { Chapter, ChapterContent, PlotBranch, AiSuggestion } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";
import type { Repository } from "./base";

export type CreateChapterInput = Omit<Chapter, "id" | "createdAt" | "updatedAt">;
export type UpdateChapterInput = Partial<CreateChapterInput>;

export type CreateChapterContentInput = Omit<ChapterContent, "id"> & { chapterId: string };
export type UpdateChapterContentInput = Partial<CreateChapterContentInput>;

export interface ChapterRepository extends Repository<Chapter, CreateChapterInput, UpdateChapterInput> {
  findContentsByChapter(chapterId: string): Promise<ChapterContent[]>;
  createContent(data: CreateChapterContentInput): Promise<ChapterContent>;
  updateContent(id: string, data: UpdateChapterContentInput): Promise<ChapterContent>;
  deleteContent(id: string): Promise<void>;
  findBranchesByChapter(chapterId: string): Promise<PlotBranch[]>;
  createBranch(data: Omit<PlotBranch, "id">): Promise<PlotBranch>;
  updateBranch(id: string, data: Partial<Omit<PlotBranch, "id">>): Promise<PlotBranch>;
  deleteBranch(id: string): Promise<void>;
  findSuggestionsByChapter(chapterId: string): Promise<AiSuggestion[]>;
}

export function createChapterRepository(prisma: PrismaClient): ChapterRepository {
  return {
    async findAll(workId?: string) {
      const where = workId ? { workId } : {};
      const records = await prisma.chapter.findMany({ where, orderBy: { orderIndex: "asc" } });
      return records.map(mapChapterFromPrisma);
    },

    async findById(id: string) {
      const record = await prisma.chapter.findUnique({ where: { id } });
      return record ? mapChapterFromPrisma(record) : null;
    },

    async create(data: CreateChapterInput) {
      const record = await prisma.chapter.create({ data });
      return mapChapterFromPrisma(record);
    },

    async update(id: string, data: UpdateChapterInput) {
      const record = await prisma.chapter.update({ where: { id }, data });
      return mapChapterFromPrisma(record);
    },

    async delete(id: string) {
      await prisma.chapter.delete({ where: { id } });
    },

    async findContentsByChapter(chapterId: string) {
      const records = await prisma.chapterContent.findMany({
        where: { chapterId },
        orderBy: { orderIndex: "asc" },
      });
      return records.map(mapContentFromPrisma);
    },

    async createContent(data: CreateChapterContentInput) {
      const record = await prisma.chapterContent.create({
        data: {
          title: data.title,
          content: data.content,
          branchId: data.branchId,
          chapter: { connect: { id: data.chapterId } },
        },
      });
      return mapContentFromPrisma(record);
    },

    async updateContent(id: string, data: UpdateChapterContentInput) {
      const record = await prisma.chapterContent.update({ where: { id }, data });
      return mapContentFromPrisma(record);
    },

    async deleteContent(id: string) {
      await prisma.chapterContent.delete({ where: { id } });
    },

    async findBranchesByChapter(chapterId: string) {
      const records = await prisma.plotBranch.findMany({ where: { chapterId } });
      return records.map(mapBranchFromPrisma);
    },

    async createBranch(data: Omit<PlotBranch, "id">) {
      const record = await prisma.plotBranch.create({ data });
      return mapBranchFromPrisma(record);
    },

    async updateBranch(id: string, data: Partial<Omit<PlotBranch, "id">>) {
      const record = await prisma.plotBranch.update({ where: { id }, data });
      return mapBranchFromPrisma(record);
    },

    async deleteBranch(id: string) {
      await prisma.plotBranch.delete({ where: { id } });
    },

    async findSuggestionsByChapter(chapterId: string) {
      const records = await prisma.aiSuggestion.findMany({ where: { chapterId } });
      return records.map(mapSuggestionFromPrisma);
    },
  };
}

function mapChapterFromPrisma(record: Record<string, unknown>): Chapter {
  return {
    id: record.id as string,
    workId: record.workId as string,
    title: record.title as string,
    orderIndex: record.orderIndex as number,
    status: record.status as "draft" | "polish" | "locked",
    hook: record.hook as string,
    contentPreview: record.contentPreview as string,
    branchCount: record.branchCount as number,
    updatedAt: (record.updatedAt as Date).toISOString(),
  };
}

function mapContentFromPrisma(record: Record<string, unknown>): ChapterContent {
  return {
    id: record.id as string,
    title: record.title as string,
    content: record.content as string,
    branchId: record.branchId as string | undefined,
  };
}

function mapBranchFromPrisma(record: Record<string, unknown>): PlotBranch {
  return {
    id: record.id as string,
    chapterId: record.chapterId as string,
    title: record.title as string,
    summary: record.summary as string,
    tension: record.tension as "low" | "medium" | "high",
    aiGenerated: record.aiGenerated as boolean,
  };
}

function mapSuggestionFromPrisma(record: Record<string, unknown>): AiSuggestion {
  return {
    id: record.id as string,
    chapterId: record.chapterId as string,
    type: record.type as "continuation" | "conflict" | "rewrite",
    label: record.label as string,
    content: record.content as string,
    tension: record.tension as "low" | "medium" | "high",
  };
}
