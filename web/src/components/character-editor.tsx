"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { smoothEase } from "@/lib/motion-config";
import type { Character } from "@/lib/types";

interface Props {
  character: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

export function CharacterEditor({ character, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Character>(character);

  function setField<K extends keyof Character>(key: K, value: Character[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleArrayChange(value: string, index: number) {
    const next = [...(form.habits ?? [])];
    next[index] = value;
    setField("habits", next);
  }

  function addHabit() {
    setField("habits", [...(form.habits ?? []), ""]);
  }

  function handleSave() {
    onSave(form);
  }

  const inputClasses = "mt-2 w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2.5 text-sm backdrop-blur-sm transition-all duration-200 focus:border-[color-mix(in_srgb,var(--accent-gradient)_60%,transparent)] focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-gradient)_20%,transparent)] sm:px-4 sm:py-3";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="editor"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={smoothEase}
        className="space-y-5 sm:space-y-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onCancel} className="glass hover-lift flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium">
            ← 取消编辑
          </button>
          <button type="button" onClick={handleSave} className="btn-accent flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium">
            保存档案
          </button>
        </div>

        <div className="glass rounded-xl p-5 sm:rounded-2xl sm:p-8">
          <div className="mb-5 grid gap-3 sm:mb-6 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>角色名称</label>
              <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>角色定位</label>
              <input type="text" value={form.role} onChange={(e) => setField("role", e.target.value)} className={inputClasses} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>人物小传</label>
            <textarea value={form.biography} onChange={(e) => setField("biography", e.target.value)} rows={3} className={inputClasses} />
          </div>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>外貌特征</label>
              <input type="text" value={form.appearance} onChange={(e) => setField("appearance", e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>性格特质</label>
              <textarea value={form.personality} onChange={(e) => setField("personality", e.target.value)} rows={2} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>身世背景</label>
              <textarea value={form.backstory} onChange={(e) => setField("backstory", e.target.value)} rows={2} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>口头禅</label>
              <input type="text" value={form.catchphrase} onChange={(e) => setField("catchphrase", e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>性格弱点</label>
              <textarea value={form.weakness} onChange={(e) => setField("weakness", e.target.value)} rows={2} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>人生使命</label>
              <textarea value={form.mission} onChange={(e) => setField("mission", e.target.value)} rows={2} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>执念禁忌</label>
              <textarea value={form.taboo} onChange={(e) => setField("taboo", e.target.value)} rows={2} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>成长弧光</label>
              <textarea value={form.arc} onChange={(e) => setField("arc", e.target.value)} rows={2} className={inputClasses} />
            </div>
          </div>

          <div className="mt-5 glass-soft rounded-xl p-3.5 sm:mt-6 sm:rounded-2xl sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>个人习惯</p>
              <button type="button" onClick={addHabit} className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors" style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}>+ 添加习惯</button>
            </div>
            <div className="mt-3 space-y-2.5">
              {(form.habits ?? []).map((habit, index) => (
                <input
                  key={index}
                  type="text"
                  value={habit}
                  onChange={(e) => handleArrayChange(e.target.value, index)}
                  placeholder="输入一项个人习惯"
                  className={inputClasses}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
