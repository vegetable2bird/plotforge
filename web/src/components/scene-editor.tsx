"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { smoothEase } from "@/lib/motion-config";
import type { Scene } from "@/lib/types";

interface Props {
  scene: Scene;
  onSave: (scene: Scene) => void;
  onCancel: () => void;
}

export function SceneEditor({ scene, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Scene>(scene);

  function setField<K extends keyof Scene>(key: K, value: Scene[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleArrayChange(key: "dangerZones" | "residents", value: string, index: number) {
    const next = [...(form[key] ?? [])];
    next[index] = value;
    setField(key, next);
  }

  function addArrayItem(key: "dangerZones" | "residents") {
    setField(key, [...(form[key] ?? []), ""]);
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
            保存场景
          </button>
        </div>

        <div className="glass rounded-xl p-5 sm:rounded-2xl sm:p-8">
          <div className="mb-5 grid gap-3 sm:mb-6 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>场景名称</label>
              <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>天气</label>
              <input type="text" value={form.weather} onChange={(e) => setField("weather", e.target.value)} className={inputClasses} />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>环境描述</label>
            <textarea value={form.environment} onChange={(e) => setField("environment", e.target.value)} rows={3} className={inputClasses} />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>时间设定</label>
            <input type="text" value={form.timeSetting} onChange={(e) => setField("timeSetting", e.target.value)} className={inputClasses} />
          </div>

          <div className="mt-5 glass-soft rounded-xl p-3.5 sm:mt-6 sm:rounded-2xl sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>危险区域</p>
              <button type="button" onClick={() => addArrayItem("dangerZones")} className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors" style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}>+ 添加危险区</button>
            </div>
            <div className="mt-3 space-y-2.5">
              {(form.dangerZones ?? []).map((zone, index) => (
                <input
                  key={index}
                  type="text"
                  value={zone}
                  onChange={(e) => handleArrayChange("dangerZones", e.target.value, index)}
                  placeholder="输入一处危险区域"
                  className={inputClasses}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 glass-soft rounded-xl p-3.5 sm:mt-6 sm:rounded-2xl sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>在场角色</p>
              <button type="button" onClick={() => addArrayItem("residents")} className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors" style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}>+ 添加角色</button>
            </div>
            <div className="mt-3 space-y-2.5">
              {(form.residents ?? []).map((resident, index) => (
                <input
                  key={index}
                  type="text"
                  value={resident}
                  onChange={(e) => handleArrayChange("residents", e.target.value, index)}
                  placeholder="输入一位在场角色"
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
