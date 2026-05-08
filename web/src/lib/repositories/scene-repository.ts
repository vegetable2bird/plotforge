import type { Scene } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";
import type { Repository } from "./base";

export type CreateSceneInput = Omit<Scene, "id" | "createdAt" | "updatedAt">;
export type UpdateSceneInput = Partial<CreateSceneInput>;

export interface SceneRepository extends Repository<Scene, CreateSceneInput, UpdateSceneInput> {}

export function createSceneRepository(prisma: PrismaClient): SceneRepository {
  return {
    async findAll(workId?: string) {
      const where = workId ? { workId } : {};
      const records = await prisma.scene.findMany({ where, orderBy: { createdAt: "asc" } });
      return records.map(mapFromPrisma);
    },

    async findById(id: string) {
      const record = await prisma.scene.findUnique({ where: { id } });
      return record ? mapFromPrisma(record) : null;
    },

    async create(data: CreateSceneInput) {
      const record = await prisma.scene.create({
        data: {
          ...data,
          dangerZones: JSON.stringify(data.dangerZones ?? []),
          residents: JSON.stringify(data.residents ?? []),
        },
      });
      return mapFromPrisma(record);
    },

    async update(id: string, data: UpdateSceneInput) {
      const prismaData: Record<string, unknown> = {};
      if (data.name !== undefined) prismaData.name = data.name;
      if (data.workId !== undefined) prismaData.workId = data.workId;
      if (data.environment !== undefined) prismaData.environment = data.environment;
      if (data.weather !== undefined) prismaData.weather = data.weather;
      if (data.timeSetting !== undefined) prismaData.timeSetting = data.timeSetting;
      if (data.dangerZones !== undefined) prismaData.dangerZones = JSON.stringify(data.dangerZones);
      if (data.residents !== undefined) prismaData.residents = JSON.stringify(data.residents);

      const record = await prisma.scene.update({ where: { id }, data: prismaData });
      return mapFromPrisma(record);
    },

    async delete(id: string) {
      await prisma.scene.delete({ where: { id } });
    },
  };
}

function mapFromPrisma(record: Record<string, unknown>): Scene {
  return {
    id: record.id as string,
    workId: record.workId as string,
    name: record.name as string,
    environment: record.environment as string,
    weather: record.weather as string,
    timeSetting: record.timeSetting as string,
    dangerZones: parseJsonArray(record.dangerZones as string),
    residents: parseJsonArray(record.residents as string),
  };
}

function parseJsonArray(value: string): string[] {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
