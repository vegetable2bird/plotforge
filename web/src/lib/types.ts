export type ThemeName = "cloud" | "mint" | "lavender" | "obsidian" | "ember" | "jade";

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
};

export type Work = {
  id: string;
  userId: string;
  title: string;
  genre: string;
  stage: "planning" | "drafting" | "polishing" | "completed";
  summary: string;
  theme: ThemeName;
  createdAt: string;
  updatedAt: string;
};

export type WorkSummary = Work & {
  chapterCount: number;
  characterCount: number;
  loreCount: number;
  factionCount: number;
};

export type Character = {
  id: string;
  workId: string;
  name: string;
  role: string;
  appearance: string;
  personality: string;
  backstory: string;
  habits: string[];
  catchphrase: string;
  weakness: string;
  mission: string;
  taboo: string;
  arc: string;
  biography: string;
  avatar: string;
  tags: string[];
};

export type Chapter = {
  id: string;
  workId: string;
  title: string;
  orderIndex: number;
  status: "draft" | "polish" | "locked";
  hook: string;
  contentPreview: string;
  branchCount: number;
  updatedAt: string;
};

export type PlotBranch = {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  tension: "low" | "medium" | "high";
  aiGenerated: boolean;
};

export type AiSuggestion = {
  id: string;
  chapterId: string;
  type: "continuation" | "conflict" | "rewrite";
  label: string;
  content: string;
  tension: "low" | "medium" | "high";
};

export type ChapterContent = {
  id: string;
  title: string;
  content: string;
  branchId?: string;
};

export type Scene = {
  id: string;
  workId: string;
  name: string;
  environment: string;
  weather: string;
  timeSetting: string;
  dangerZones: string[];
  residents: string[];
};

export type LoreEntry = {
  id: string;
  workId: string;
  category: string;
  title: string;
  summary: string;
  linkedTitles: string[];
  riskLevel: "stable" | "warning";
};

export type Faction = {
  id: string;
  workId: string;
  name: string;
  stance: string;
  doctrine: string;
  leader: string;
  influence: number;
};

export type Snapshot = {
  id: string;
  workId: string;
  scopeType: string;
  title: string;
  summary: string;
  createdAt: string;
};

export type AiGenerationRecord = {
  id: string;
  workId: string;
  moduleType: string;
  model: string;
  promptDigest: string;
  status: "ready" | "blocked" | "running";
  createdAt: string;
};

export type ConflictRecord = {
  id: string;
  workId: string;
  sourceType: string;
  title: string;
  message: string;
  severity: "medium" | "high";
};

export type NavItem = {
  key: string;
  label: string;
  description: string;
};

export type RelationNode = {
  id: string;
  characterId: string;
  label: string;
  avatar: string;
  x: number;
  y: number;
};

export type RelationEdge = {
  id: string;
  source: string;
  target: string;
  relationType: string;
  intimacyLevel: number;
  conflictLevel: number;
  note: string;
};
