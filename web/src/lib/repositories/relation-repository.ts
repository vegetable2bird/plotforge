import type { RelationNode, RelationEdge } from "@/lib/types";
import type { PrismaClient } from "@prisma/client";

export interface RelationRepository {
  findAllNodes(): Promise<RelationNode[]>;
  findNodeById(id: string): Promise<RelationNode | null>;
  createNode(data: Omit<RelationNode, "id">): Promise<RelationNode>;
  updateNode(id: string, data: Partial<Omit<RelationNode, "id">>): Promise<RelationNode>;
  deleteNode(id: string): Promise<void>;
  findAllEdges(): Promise<RelationEdge[]>;
  findEdgeById(id: string): Promise<RelationEdge | null>;
  createEdge(data: Omit<RelationEdge, "id">): Promise<RelationEdge>;
  updateEdge(id: string, data: Partial<Omit<RelationEdge, "id">>): Promise<RelationEdge>;
  deleteEdge(id: string): Promise<void>;
}

export function createRelationRepository(prisma: PrismaClient): RelationRepository {
  return {
    async findAllNodes() {
      const records = await prisma.relationNode.findMany({ orderBy: { createdAt: "asc" } });
      return records.map(mapNodeFromPrisma);
    },

    async findNodeById(id: string) {
      const record = await prisma.relationNode.findUnique({ where: { id } });
      return record ? mapNodeFromPrisma(record) : null;
    },

    async createNode(data: Omit<RelationNode, "id">) {
      const record = await prisma.relationNode.create({ data });
      return mapNodeFromPrisma(record);
    },

    async updateNode(id: string, data: Partial<Omit<RelationNode, "id">>) {
      const record = await prisma.relationNode.update({ where: { id }, data });
      return mapNodeFromPrisma(record);
    },

    async deleteNode(id: string) {
      await prisma.relationNode.delete({ where: { id } });
    },

    async findAllEdges() {
      const records = await prisma.relationEdge.findMany({ orderBy: { createdAt: "asc" } });
      return records.map(mapEdgeFromPrisma);
    },

    async findEdgeById(id: string) {
      const record = await prisma.relationEdge.findUnique({ where: { id } });
      return record ? mapEdgeFromPrisma(record) : null;
    },

    async createEdge(data: Omit<RelationEdge, "id">) {
      const record = await prisma.relationEdge.create({
        data: {
          sourceId: data.source,
          targetId: data.target,
          relationType: data.relationType,
          intimacyLevel: data.intimacyLevel,
          conflictLevel: data.conflictLevel,
          note: data.note,
        },
      });
      return mapEdgeFromPrisma(record);
    },

    async updateEdge(id: string, data: Partial<Omit<RelationEdge, "id">>) {
      const record = await prisma.relationEdge.update({ where: { id }, data });
      return mapEdgeFromPrisma(record);
    },

    async deleteEdge(id: string) {
      await prisma.relationEdge.delete({ where: { id } });
    },
  };
}

function mapNodeFromPrisma(record: Record<string, unknown>): RelationNode {
  return {
    id: record.id as string,
    characterId: record.characterId as string,
    label: record.label as string,
    avatar: record.avatar as string,
    x: record.x as number,
    y: record.y as number,
  };
}

function mapEdgeFromPrisma(record: Record<string, unknown>): RelationEdge {
  return {
    id: record.id as string,
    source: record.sourceId as string,
    target: record.targetId as string,
    relationType: record.relationType as string,
    intimacyLevel: record.intimacyLevel as number,
    conflictLevel: record.conflictLevel as number,
    note: record.note as string,
  };
}
