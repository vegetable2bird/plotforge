import type { Chapter, ChapterContent, Snapshot } from "@/lib/types";
import { chapterContents, chapters, snapshots } from "@/lib/mock-data";

export const CHAPTER_STORAGE_KEY = "plotforge-chapters";
export const CHAPTER_CONTENT_STORAGE_KEY = "plotforge-chapter-contents";
export const SNAPSHOT_STORAGE_KEY = "plotforge-snapshots";
export const WORKSPACE_STORAGE_EVENT = "plotforge-workspace-storage-changed";

export const defaultChapterSnapshot = JSON.stringify(chapters);
export const defaultContentSnapshot = JSON.stringify(chapterContents);
export const defaultSnapshotList = JSON.stringify(snapshots);

export function subscribeWorkspace(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(WORKSPACE_STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(WORKSPACE_STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function readWorkspaceValue(key: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.localStorage.getItem(key) ?? fallback;
}

export function persistWorkspaceState(nextChapters: Chapter[], nextContents: Record<string, ChapterContent[]>) {
  window.localStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(nextChapters));
  window.localStorage.setItem(CHAPTER_CONTENT_STORAGE_KEY, JSON.stringify(nextContents));
  window.dispatchEvent(new Event(WORKSPACE_STORAGE_EVENT));
}

export function persistSnapshots(nextSnapshots: Snapshot[]) {
  window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(nextSnapshots));
  window.dispatchEvent(new Event(WORKSPACE_STORAGE_EVENT));
}
