async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json() as T;
}

export const api = {
  characters: {
    list: (workId?: string) =>
      apiFetch<Character[]>(`/api/characters${workId ? `?workId=${workId}` : ""}`),
    get: (id: string) => apiFetch<Character>(`/api/characters/${id}`),
    create: (data: Record<string, unknown>) =>
      apiFetch<Character>("/api/characters", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiFetch<Character>(`/api/characters/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/characters/${id}`, { method: "DELETE" }),
  },

  scenes: {
    list: (workId?: string) =>
      apiFetch<Scene[]>(`/api/scenes${workId ? `?workId=${workId}` : ""}`),
    get: (id: string) => apiFetch<Scene>(`/api/scenes/${id}`),
    create: (data: Record<string, unknown>) =>
      apiFetch<Scene>("/api/scenes", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiFetch<Scene>(`/api/scenes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/scenes/${id}`, { method: "DELETE" }),
  },

  factions: {
    list: (workId?: string) =>
      apiFetch<Faction[]>(`/api/factions${workId ? `?workId=${workId}` : ""}`),
    get: (id: string) => apiFetch<Faction>(`/api/factions/${id}`),
    create: (data: Record<string, unknown>) =>
      apiFetch<Faction>("/api/factions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiFetch<Faction>(`/api/factions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/factions/${id}`, { method: "DELETE" }),
    listEdges: () => apiFetch<FactionEdgeType[]>("/api/factions/edges"),
    createEdge: (data: Record<string, unknown>) =>
      apiFetch<FactionEdgeType>("/api/factions/edges", { method: "POST", body: JSON.stringify(data) }),
    updateEdge: (id: string, data: Record<string, unknown>) =>
      apiFetch<FactionEdgeType>(`/api/factions/edges/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteEdge: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/factions/edges/${id}`, { method: "DELETE" }),
  },

  chapters: {
    list: (workId?: string) =>
      apiFetch<Chapter[]>(`/api/chapters${workId ? `?workId=${workId}` : ""}`),
    get: (id: string) => apiFetch<Chapter>(`/api/chapters/${id}`),
    create: (data: Record<string, unknown>) =>
      apiFetch<Chapter>("/api/chapters", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiFetch<Chapter>(`/api/chapters/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/chapters/${id}`, { method: "DELETE" }),
    contents: (chapterId: string) => apiFetch<ChapterContent[]>(`/api/chapters/${chapterId}/contents`),
    createContent: (chapterId: string, data: Record<string, unknown>) =>
      apiFetch<ChapterContent>(`/api/chapters/${chapterId}/contents`, { method: "POST", body: JSON.stringify(data) }),
    updateContent: (id: string, data: Record<string, unknown>) =>
      apiFetch<ChapterContent>(`/api/chapter-contents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteContent: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/chapter-contents/${id}`, { method: "DELETE" }),
  },

  lore: {
    list: (workId?: string) =>
      apiFetch<LoreEntry[]>(`/api/lore${workId ? `?workId=${workId}` : ""}`),
    get: (id: string) => apiFetch<LoreEntry>(`/api/lore/${id}`),
    create: (data: Record<string, unknown>) =>
      apiFetch<LoreEntry>("/api/lore", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      apiFetch<LoreEntry>(`/api/lore/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/lore/${id}`, { method: "DELETE" }),
  },

  relations: {
    listNodes: () => apiFetch<RelationNodeType[]>("/api/relations/nodes"),
    createNode: (data: Record<string, unknown>) =>
      apiFetch<RelationNodeType>("/api/relations/nodes", { method: "POST", body: JSON.stringify(data) }),
    updateNode: (id: string, data: Record<string, unknown>) =>
      apiFetch<RelationNodeType>(`/api/relations/nodes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteNode: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/relations/nodes/${id}`, { method: "DELETE" }),
    listEdges: () => apiFetch<RelationEdgeType[]>("/api/relations/edges"),
    createEdge: (data: Record<string, unknown>) =>
      apiFetch<RelationEdgeType>("/api/relations/edges", { method: "POST", body: JSON.stringify(data) }),
    updateEdge: (id: string, data: Record<string, unknown>) =>
      apiFetch<RelationEdgeType>(`/api/relations/edges/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteEdge: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/relations/edges/${id}`, { method: "DELETE" }),
  },
};

import type { Character, Scene, Faction, Chapter, ChapterContent, LoreEntry } from "@/lib/types";

type FactionEdgeType = {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: string;
  note: string;
};

type RelationNodeType = {
  id: string;
  characterId: string;
  label: string;
  avatar: string;
  x: number;
  y: number;
};

type RelationEdgeType = {
  id: string;
  source: string;
  target: string;
  relationType: string;
  intimacyLevel: number;
  conflictLevel: number;
  note: string;
};
