"use client";

import { AnimatePresence, motion } from "framer-motion";

import { smoothEase } from "@/lib/motion-config";
import type { Character } from "@/lib/types";

interface Props {
  character: Character;
  onEdit: () => void;
  onBack: () => void;
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="glass-soft rounded-xl p-3.5 sm:rounded-2xl sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>{label}</p>
      <p className={`leading-relaxed ${multiline ? "mt-2 text-xs sm:text-sm" : "mt-1 text-sm sm:text-base font-medium"}`} style={{ color: multiline ? "var(--text-secondary)" : "var(--text)" }}>{value}</p>
    </div>
  );
}

export function CharacterDetail({ character, onEdit, onBack }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={character.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={smoothEase}
        className="space-y-5 sm:space-y-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onBack} className="glass hover-lift flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium">
            ← 返回列表
          </button>
          <button type="button" onClick={onEdit} className="btn-accent flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium">
            编辑档案
          </button>
        </div>

        {/* Header Card */}
        <div className="glass rounded-xl p-5 sm:rounded-2xl sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold text-white sm:h-20 sm:w-20 sm:text-2xl" style={{ background: "var(--accent-gradient)", boxShadow: "0 8px 24px color-mix(in srgb, var(--accent-gradient) 35%, transparent)" }}>{character.avatar}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gradient sm:text-3xl">{character.name}</h1>
              <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{character.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {character.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Fields Grid */}
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-2">
            <Field label="人物小传" value={character.biography} multiline />
            <Field label="成长弧光" value={character.arc} multiline />
            <Field label="外貌特征" value={character.appearance} />
            <Field label="性格特质" value={character.personality} multiline />
            <Field label="身世背景" value={character.backstory} multiline />
            <Field label="口头禅" value={character.catchphrase} />
            <Field label="性格弱点" value={character.weakness} multiline />
            <Field label="人生使命" value={character.mission} multiline />
            <Field label="执念禁忌" value={character.taboo} multiline />
            <div className="glass-soft rounded-xl p-3.5 sm:rounded-2xl sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>个人习惯</p>
              <ul className="mt-3 space-y-2.5">
                {character.habits.map((habit) => (
                  <li key={habit} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent-gradient)", boxShadow: "0 0 6px color-mix(in srgb, var(--accent-gradient) 50%, transparent)" }} />
                    {habit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
