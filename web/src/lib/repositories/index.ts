import { prisma } from "@/lib/db";
import { createCharacterRepository } from "./character-repository";
import { createChapterRepository } from "./chapter-repository";
import { createFactionRepository } from "./faction-repository";
import { createLoreRepository } from "./lore-repository";
import { createRelationRepository } from "./relation-repository";
import { createSceneRepository } from "./scene-repository";
import { createWorkRepository } from "./work-repository";

export const repositories = {
  works: createWorkRepository(prisma),
  characters: createCharacterRepository(prisma),
  chapters: createChapterRepository(prisma),
  factions: createFactionRepository(prisma),
  lore: createLoreRepository(prisma),
  relations: createRelationRepository(prisma),
  scenes: createSceneRepository(prisma),
};

export type Repositories = typeof repositories;
