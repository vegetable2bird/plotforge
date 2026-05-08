import type { Character } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";
import type { Repository } from "./base";

export type CreateCharacterInput = Omit<Character, "id" | "createdAt" | "updatedAt">;
export type UpdateCharacterInput = Partial<CreateCharacterInput>;

export interface CharacterRepository extends Repository<Character, CreateCharacterInput, UpdateCharacterInput> {}

export function createCharacterRepository(prisma: PrismaClient): CharacterRepository {
  return {
    async findAll(workId?: string) {
      const where = workId ? { workId } : {};
      const records = await prisma.character.findMany({ where, orderBy: { createdAt: "asc" } });
      return records.map(mapFromPrisma);
    },

    async findById(id: string) {
      const record = await prisma.character.findUnique({ where: { id } });
      return record ? mapFromPrisma(record) : null;
    },

    async create(data: CreateCharacterInput) {
      const record = await prisma.character.create({
        data: {
          ...data,
          habits: JSON.stringify(data.habits ?? []),
          tags: JSON.stringify(data.tags ?? []),
        },
      });
      return mapFromPrisma(record);
    },

    async update(id: string, data: UpdateCharacterInput) {
      const prismaData: Record<string, unknown> = {};
      if (data.name !== undefined) prismaData.name = data.name;
      if (data.workId !== undefined) prismaData.workId = data.workId;
      if (data.role !== undefined) prismaData.role = data.role;
      if (data.appearance !== undefined) prismaData.appearance = data.appearance;
      if (data.personality !== undefined) prismaData.personality = data.personality;
      if (data.backstory !== undefined) prismaData.backstory = data.backstory;
      if (data.habits !== undefined) prismaData.habits = JSON.stringify(data.habits);
      if (data.catchphrase !== undefined) prismaData.catchphrase = data.catchphrase;
      if (data.weakness !== undefined) prismaData.weakness = data.weakness;
      if (data.mission !== undefined) prismaData.mission = data.mission;
      if (data.taboo !== undefined) prismaData.taboo = data.taboo;
      if (data.arc !== undefined) prismaData.arc = data.arc;
      if (data.biography !== undefined) prismaData.biography = data.biography;
      if (data.avatar !== undefined) prismaData.avatar = data.avatar;
      if (data.tags !== undefined) prismaData.tags = JSON.stringify(data.tags);

      const record = await prisma.character.update({ where: { id }, data: prismaData });
      return mapFromPrisma(record);
    },

    async delete(id: string) {
      await prisma.character.delete({ where: { id } });
    },
  };
}

function mapFromPrisma(record: Record<string, unknown>): Character {
  return {
    id: record.id as string,
    workId: record.workId as string,
    name: record.name as string,
    role: record.role as string,
    appearance: record.appearance as string,
    personality: record.personality as string,
    backstory: record.backstory as string,
    habits: parseJsonArray(record.habits as string),
    catchphrase: record.catchphrase as string,
    weakness: record.weakness as string,
    mission: record.mission as string,
    taboo: record.taboo as string,
    arc: record.arc as string,
    biography: record.biography as string,
    avatar: record.avatar as string,
    tags: parseJsonArray(record.tags as string),
  };
}

function parseJsonArray(value: string): string[] {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
