"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { ChapterList } from "@/components/chapter-list";
import { ChapterEditor } from "@/components/chapter-editor";
import { AiPlotPanel } from "@/components/ai-plot-panel";
import { api } from "@/lib/api-client";
import { aiSuggestions, plotBranches } from "@/lib/mock-data";
import type { Chapter, ChapterContent, Snapshot } from "@/lib/types";
import {
  CHAPTER_CONTENT_STORAGE_KEY,
  CHAPTER_STORAGE_KEY,
  SNAPSHOT_STORAGE_KEY,
  defaultChapterSnapshot,
  defaultContentSnapshot,
  defaultSnapshotList,
  persistSnapshots,
  persistWorkspaceState,
  readWorkspaceValue,
  subscribeWorkspace,
} from "@/lib/workspace-storage";

export default function ChaptersPage() {
  const chapterListSnapshot = useSyncExternalStore(
    subscribeWorkspace,
    () => readWorkspaceValue(CHAPTER_STORAGE_KEY, defaultChapterSnapshot),
    () => defaultChapterSnapshot,
  );
  const chapterContentsSnapshot = useSyncExternalStore(
    subscribeWorkspace,
    () => readWorkspaceValue(CHAPTER_CONTENT_STORAGE_KEY, defaultContentSnapshot),
    () => defaultContentSnapshot,
  );
  const snapshotListSnapshot = useSyncExternalStore(
    subscribeWorkspace,
    () => readWorkspaceValue(SNAPSHOT_STORAGE_KEY, defaultSnapshotList),
    () => defaultSnapshotList,
  );

  const [apiChapters, setApiChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.chapters.list("work-1")
      .then((data) => {
        const chapters = data as Chapter[];
        setApiChapters(chapters);
        if (chapters.length > 0) {
          window.localStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(chapters));
          window.dispatchEvent(new Event("plotforge-workspace-storage-changed"));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chapterList = useMemo(() => JSON.parse(chapterListSnapshot) as Chapter[], [chapterListSnapshot]);
  const persistedChapterContents = useMemo(() => JSON.parse(chapterContentsSnapshot) as Record<string, ChapterContent[]>, [chapterContentsSnapshot]);
  const snapshotList = useMemo(() => JSON.parse(snapshotListSnapshot) as Snapshot[], [snapshotListSnapshot]);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [activeContentId, setActiveContentId] = useState("content-89-1");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterHook, setNewChapterHook] = useState("");

  const editingChapter = chapterList.find((c) => c.id === editingChapterId);
  const activeBranches = editingChapterId ? plotBranches.filter((b) => b.chapterId === editingChapterId) : [];
  const activeContents = editingChapterId ? (persistedChapterContents[editingChapterId] ?? []) : [];
  const activeSuggestions = editingChapterId ? aiSuggestions.filter((s) => s.chapterId === editingChapterId) : [];

  const syncChapterToApi = useCallback(async (chapter: Chapter) => {
    try {
      await api.chapters.update(chapter.id, {
        title: chapter.title,
        hook: chapter.hook,
        contentPreview: chapter.contentPreview,
        status: chapter.status,
        updatedAt: chapter.updatedAt,
      });
    } catch (err) {
      console.error("Failed to sync chapter:", err);
    }
  }, []);

  const syncContentToApi = useCallback(async (chapterId: string, contents: ChapterContent[]) => {
    try {
      const existingData = await api.chapters.contents(chapterId);
      const existing = existingData as ChapterContent[];
      const updates = contents.filter((c) => existing.some((e) => e.id === c.id));
      const creates = contents.filter((c) => !existing.some((e) => e.id === c.id));

      await Promise.all([
        ...updates.map((c) => api.chapters.updateContent(c.id, { title: c.title, content: c.content })),
        ...creates.map((c) => api.chapters.createContent(chapterId, c)),
      ]);
    } catch (err) {
      console.error("Failed to sync contents:", err);
    }
  }, []);

  function openChapterEditor(chapterId: string) {
    const initialContent = persistedChapterContents[chapterId]?.[0];
    setEditingChapterId(chapterId);
    setActiveContentId(initialContent?.id ?? "");
    setShowAiPanel(false);
  }

  function handleApplySuggestion() {
    // Placeholder: integrate AI suggestion into editor
  }

  function handleCreateBranch() {
    // Placeholder: create new plot branch
  }

  function handleCreateChapter() {
    setShowCreateModal(true);
    setNewChapterTitle(`第 ${chapterList.length + 1} 章`);
    setNewChapterHook("");
  }

  async function confirmCreateChapter() {
    const nextOrder = chapterList.length > 0
      ? Math.max(...chapterList.map((c) => c.orderIndex)) + 1
      : 1;
    const newContentId = `content-${nextOrder}-1`;

    try {
      const newChapter = await api.chapters.create({
        workId: "work-1",
        title: newChapterTitle || `第 ${nextOrder} 章`,
        orderIndex: nextOrder,
        status: "draft",
        hook: newChapterHook,
        contentPreview: "",
        branchCount: 0,
        updatedAt: "刚刚",
      }) as Chapter;

      await api.chapters.createContent(newChapter.id, {
        id: newContentId,
        title: "正文片段 1",
        content: "",
      });

      const updatedChapters = await api.chapters.list("work-1");
      const chaptersData = updatedChapters as Chapter[];
      setApiChapters(chaptersData);
      window.localStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(chaptersData));
      const contents = await api.chapters.contents(newChapter.id);
      window.localStorage.setItem(CHAPTER_CONTENT_STORAGE_KEY, JSON.stringify({ [newChapter.id]: contents }));
      window.dispatchEvent(new Event("plotforge-workspace-storage-changed"));

      setEditingChapterId(newChapter.id);
      setActiveContentId(newContentId);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create chapter:", err);
    }
  }

  function handleContentChange(contentId: string, content: string) {
    if (!editingChapterId) {
      return;
    }

    const currentContents = persistedChapterContents[editingChapterId] ?? [];
    const nextChapterContents: Record<string, ChapterContent[]> = {
      ...persistedChapterContents,
      [editingChapterId]: currentContents.map((item) => (
        item.id === contentId
          ? { ...item, content }
          : item
      )),
    };

    const preview = content.trim().split("\n").find(Boolean)?.slice(0, 80) ?? "";
    const nextChapterList = chapterList.map((item) => (
      item.id === editingChapterId
        ? { ...item, contentPreview: preview, updatedAt: "刚刚" }
        : item
    ));

    persistWorkspaceState(nextChapterList, nextChapterContents);
    syncContentToApi(editingChapterId, nextChapterContents[editingChapterId] ?? []);
  }

  function handleCreateSnapshotFromChapter() {
    if (!editingChapterId || !editingChapter) {
      return;
    }

    const contentItems = persistedChapterContents[editingChapterId] ?? [];
    const firstNonEmpty = contentItems
      .map((item) => item.content.trim())
      .find(Boolean);
    const summaryBase = firstNonEmpty ?? editingChapter.contentPreview ?? editingChapter.hook;
    const nextSnapshot: Snapshot = {
      id: `snapshot-${Date.now()}`,
      workId: editingChapter.workId,
      scopeType: "章节",
      title: `${editingChapter.title} 改写前快照`,
      summary: summaryBase ? `保留当前正文状态：${summaryBase.slice(0, 48)}` : `保留 ${editingChapter.title} 的当前正文状态。`,
      createdAt: "刚刚",
    };

    persistSnapshots([nextSnapshot, ...snapshotList]);
    window.sessionStorage.setItem("plotforge-highlight-snapshot", nextSnapshot.id);
    window.location.href = "/snapshots";
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>加载中...</p>
      </div>
    );
  }

  if (editingChapter) {
    return (
      <div className="relative flex h-full flex-col lg:flex-row">
        <button
          type="button"
          onClick={() => setShowAiPanel(!showAiPanel)}
          className="btn-accent fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium shadow-lg lg:hidden"
          style={{ boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-gradient) 40%, transparent), 0 2px 4px rgba(0,0,0,0.1)" }}
        >
          AI 辅助
        </button>

        {showAiPanel && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setShowAiPanel(false)}
          />
        )}

        <div
          className={`fixed bottom-0 left-0 right-0 z-40 max-h-[60vh] overflow-y-auto border-t backdrop-blur-xl transition-transform duration-300 lg:hidden ${showAiPanel ? "translate-y-0" : "translate-y-full"}`}
          style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)" }}
        >
          <div className="p-3">
            <div className="mb-2 flex justify-center">
              <div className="h-1 w-10 rounded-full" style={{ background: "var(--muted)" }} />
            </div>
            <div className="glass mb-3 rounded-2xl p-3.5">
              <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>移动端 AI 使用建议</p>
              <p className="mt-1 text-[11px] leading-6" style={{ color: "var(--text-secondary)" }}>
                先把正文推进到明确卡点，再拉起这个抽屉。看完建议后尽量马上回正文，不要在这里停留太久打断写作节奏。
              </p>
            </div>
            <AiPlotPanel
              branches={activeBranches}
              suggestions={activeSuggestions}
              onApplySuggestion={handleApplySuggestion}
              onCreateBranch={handleCreateBranch}
            />
          </div>
        </div>

        <div className="flex-1">
          <ChapterEditor
            chapter={editingChapter}
            branches={activeBranches}
            contents={activeContents}
            onBack={() => setEditingChapterId(null)}
            onNavigateContent={setActiveContentId}
            activeContentId={activeContentId}
            onUpdateContent={handleContentChange}
            onCreateSnapshot={handleCreateSnapshotFromChapter}
          />
        </div>

        <div className="hidden w-[360px] shrink-0 overflow-y-auto border-l p-3 xl:block xl:w-[420px] xl:p-4" style={{ borderColor: "color-mix(in srgb, var(--panel-border) 72%, transparent)" }}>
          <AiPlotPanel
            branches={activeBranches}
            suggestions={activeSuggestions}
            onApplySuggestion={handleApplySuggestion}
            onCreateBranch={handleCreateBranch}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ChapterList chapters={chapterList} onEditChapter={openChapterEditor} onCreateChapter={handleCreateChapter} />

      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl"
              style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)", backdropFilter: "blur(24px)" }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gradient">新建章节</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted)" }}>章节标题</label>
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2.5 text-sm backdrop-blur-sm transition-all focus:border-[color-mix(in_srgb,var(--accent-gradient)_40%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-gradient)_15%,transparent)]"
                    placeholder="例如：第 90 章 风暴前夕"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted)" }}>核心钩子 (可选)</label>
                  <textarea
                    value={newChapterHook}
                    onChange={(e) => setNewChapterHook(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2.5 text-sm backdrop-blur-sm transition-all focus:border-[color-mix(in_srgb,var(--accent-gradient)_40%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-gradient)_15%,transparent)]"
                    placeholder="本章的核心悬念或冲突点..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmCreateChapter}
                  className="btn-accent rounded-xl px-5 py-2 text-sm font-medium"
                >
                  创建并进入编辑
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
