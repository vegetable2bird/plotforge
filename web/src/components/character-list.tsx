"use client";

import { motion } from "framer-motion";

import { fadeUp, staggerDelay } from "@/lib/motion-config";
import type { Character } from "@/lib/types";

interface Props {
  characters: Character[];
  onSelect: (char: Character) => void;
  onCreate: () => void;
}

export function CharacterList({ characters, onSelect, onCreate }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gradient sm:text-2xl">角色档案</h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>这里用来稳住人设一致性。优先补齐动机、弱点、禁忌和成长弧光，再进入正文写作。</p>
          </div>
          <button type="button" onClick={onCreate} className="btn-accent rounded-xl px-4 py-2.5 text-sm font-medium sm:px-5">
            + 新建角色
          </button>
        </div>

        <div className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>角色模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>先补核心角色的欲望、创伤、使命和口头禅。写章节前，如果人物行为拿不准，先回这里看人设，而不是直接硬写正文。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：角色 → 世界观 → 章节
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {characters.map((char, i) => (
            <motion.button
              key={char.id}
              type="button"
              onClick={() => onSelect(char)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(staggerDelay(i))}
              className="glass hover-lift border-gradient-hover w-full rounded-xl p-4 text-left sm:rounded-2xl sm:p-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg" style={{ background: "var(--accent-gradient)", boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-gradient) 30%, transparent)" }}>{char.avatar}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{char.name}</p>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>{char.role}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed sm:mt-2 sm:text-xs" style={{ color: "var(--text-secondary)" }}>{char.biography}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {char.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 10%, transparent)", color: "var(--text-secondary)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
