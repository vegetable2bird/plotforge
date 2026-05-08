import type { Faction } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";
import type { Repository } from "./base";

export type FactionEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: string;
  note: string;
};

export type CreateFactionInput = Omit<Faction, "id" | "createdAt" | "updatedAt">;
export type UpdateFactionInput = Partial<CreateFactionInput>;

export interface FactionRepository extends Repository<Faction, CreateFactionInput, UpdateFactionInput> {
  findAllEdges(): Promise<FactionEdge[]>;
  createEdge(data: Omit<FactionEdge, "id">): Promise<FactionEdge>;
  updateEdge(id: string, data: Partial<Omit<FactionEdge, "id">>): Promise<FactionEdge>;
  deleteEdge(id: string): Promise<void>;
}

export function createFactionRepository(prisma: PrismaClient): FactionRepository {
  return {
    async findAll(workId?: string) {
      const where = workId ? { workId } : {};
      const records = await prisma.faction.findMany({ where, orderBy: { influence: "desc" } });
      return records.map(mapFromPrisma);
    },

    async findById(id: string) {
      const record = await prisma.faction.findUnique({ where: { id } });
      return record ? mapFromPrisma(record) : null;
    },

    async create(data: CreateFactionInput) {
      const record = await prisma.faction.create({ data });
      return mapFromPrisma(record);
    },

    async update(id: string, data: UpdateFactionInput) {
      const prismaData: Record<string, unknown> = {};
      if (data.name !== undefined) prismaData.name = data.name;
      if (data.workId !== undefined) prismaData.workId = data.workId;
      if (data.stance !== undefined) prismaData.stance = data.stance;
      if (data.doctrine !== undefined) prismaData.doctrine = data.doctrine;
      if (data.leader !== undefined) prismaData.leader = data.leader;
      if (data.influence !== undefined) prismaData.influence = data.influence;

      const record = await prisma.faction.update({ where: { id }, data: prismaData });
      return mapFromPrisma(record);
    },

    async delete(id: string) {
      await prisma.faction.delete({ where: { id } });
    },

    async findAllEdges() {
      const records = await prisma.factionEdge.findMany({ orderBy: { createdAt: "asc" } });
      return records.map(mapEdgeFromPrisma);
    },

    async createEdge(data: Omit<FactionEdge, "id">) {
      const record = await prisma.factionEdge.create({ data });
      return mapEdgeFromPrisma(record);
    },

    async updateEdge(id: string, data: Partial<Omit<FactionEdge, "id">>) {
      const record = await prisma.factionEdge.update({ where: { id }, data });
      return mapEdgeFromPrisma(record);
    },

    async deleteEdge(id: string) {
      await prisma.factionEdge.delete({ where: { id } });
    },
  };
}

function mapFromPrisma(record: Record<string, unknown>): Faction {
  return {
    id: record.id as string,
    workId: record.workId as string,
    name: record.name as string,
    stance: record.stance as string,
    doctrine: record.doctrine as string,
    leader: record.leader as string,
    influence: record.influence as number,
  };
}

function mapEdgeFromPrisma(record: Record<string, unknown>): FactionEdge {
  return {
    id: record.id as string,
    sourceId: record.sourceId as string,
    targetId: record.targetId as string,
    edgeType: record.edgeType as string,
    note: record.note as string,
  };
}
