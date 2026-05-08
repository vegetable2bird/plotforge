"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { smoothEase } from "@/lib/motion-config";
import type { Faction } from "@/lib/types";

interface Props {
  faction: Faction;
  onSave: (faction: Faction) => void;
  onCancel: () => void;
}

export function FactionEditor({ faction, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Faction>(faction);

  function setField<K extends keyof Faction>(key: K, value: Faction[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
            保存势力
          </button>
        </div>

        <div className="glass rounded-xl p-5 sm:rounded-2xl sm:p-8">
          <div className="mb-5 grid gap-3 sm:mb-6 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>势力名称</label>
              <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>首领</label>
              <input type="text" value={form.leader} onChange={(e) => setField("leader", e.target.value)} className={inputClasses} />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>信条教义</label>
            <textarea value={form.doctrine} onChange={(e) => setField("doctrine", e.target.value)} rows={2} className={inputClasses} />
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>立场</label>
              <input type="text" value={form.stance} onChange={(e) => setField("stance", e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>影响力 (0-100)</label>
              <input type="number" min={0} max={100} value={form.influence} onChange={(e) => setField("influence", parseInt(e.target.value, 10) || 0)} className={inputClasses} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
