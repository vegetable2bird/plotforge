"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette, ChevronLeft, ChevronRight, Menu, X, Home, Users, Network, Map, BookMarked, Shield, Clock, Check, PenSquare, AlertTriangle, Layers3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { smoothQuick, smoothEase, fadeScale } from "@/lib/motion-config";
import type { ThemeName } from "@/lib/types";

const themes: { id: ThemeName; label: string; dark: boolean; gradient: string; colors: { bgStart: string; bgEnd: string; panelBg: string; panelBgHover: string; panelBorder: string; panelBorderHover: string; text: string; muted: string; textSecondary: string; noiseOpacity: string; glassShadow: string; glassShadowHover: string } }[] = [
  {
    id: "cloud", label: "云白", dark: false, gradient: "linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #a78bfa 100%)",
    colors: { bgStart: "#f8fafc", bgEnd: "#eef2ff", panelBg: "rgba(255,255,255,0.65)", panelBgHover: "rgba(255,255,255,0.80)", panelBorder: "rgba(255,255,255,0.85)", panelBorderHover: "rgba(255,255,255,0.95)", text: "#1e293b", muted: "#94a3b8", textSecondary: "#475569", noiseOpacity: "0.03", glassShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)", glassShadowHover: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" },
  },
  {
    id: "mint", label: "薄荷", dark: false, gradient: "linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)",
    colors: { bgStart: "#f0fdfa", bgEnd: "#ecfdf5", panelBg: "rgba(255,255,255,0.65)", panelBgHover: "rgba(255,255,255,0.80)", panelBorder: "rgba(255,255,255,0.85)", panelBorderHover: "rgba(255,255,255,0.95)", text: "#1e293b", muted: "#94a3b8", textSecondary: "#475569", noiseOpacity: "0.03", glassShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)", glassShadowHover: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" },
  },
  {
    id: "lavender", label: "薰衣草", dark: false, gradient: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #6366f1 100%)",
    colors: { bgStart: "#faf5ff", bgEnd: "#f5f3ff", panelBg: "rgba(255,255,255,0.65)", panelBgHover: "rgba(255,255,255,0.80)", panelBorder: "rgba(255,255,255,0.85)", panelBorderHover: "rgba(255,255,255,0.95)", text: "#1e293b", muted: "#94a3b8", textSecondary: "#475569", noiseOpacity: "0.03", glassShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)", glassShadowHover: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" },
  },
  {
    id: "obsidian", label: "曜夜", dark: true, gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
    colors: { bgStart: "#0a0f1a", bgEnd: "#0c1220", panelBg: "rgba(255,255,255,0.05)", panelBgHover: "rgba(255,255,255,0.09)", panelBorder: "rgba(255,255,255,0.08)", panelBorderHover: "rgba(255,255,255,0.15)", text: "#f1f5f9", muted: "#64748b", textSecondary: "#cbd5e1", noiseOpacity: "0.04", glassShadow: "0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.15)", glassShadowHover: "0 8px 40px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)" },
  },
  {
    id: "ember", label: "赤焰", dark: true, gradient: "linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)",
    colors: { bgStart: "#1a0a0e", bgEnd: "#1f0d13", panelBg: "rgba(255,255,255,0.05)", panelBgHover: "rgba(255,255,255,0.09)", panelBorder: "rgba(255,255,255,0.08)", panelBorderHover: "rgba(255,255,255,0.15)", text: "#fef2f2", muted: "#78716c", textSecondary: "#fecdd3", noiseOpacity: "0.04", glassShadow: "0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.15)", glassShadowHover: "0 8px 40px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)" },
  },
  {
    id: "jade", label: "玉墨", dark: true, gradient: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)",
    colors: { bgStart: "#0a1a18", bgEnd: "#0f1f1d", panelBg: "rgba(255,255,255,0.05)", panelBgHover: "rgba(255,255,255,0.09)", panelBorder: "rgba(255,255,255,0.08)", panelBorderHover: "rgba(255,255,255,0.15)", text: "#f0fdfa", muted: "#6b7280", textSecondary: "#ccfbf1", noiseOpacity: "0.04", glassShadow: "0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.15)", glassShadowHover: "0 8px 40px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)" },
  },
];

const navGroups = [
  {
    label: "开始写作",
    hint: "从当前作品状态进入正文创作",
    items: [
      { key: "dashboard", label: "创作工作台", description: "看进度、风险与下一步", icon: Home },
      { key: "chapters", label: "章节创作", description: "建章、写正文、求助 AI", icon: PenSquare },
    ],
  },
  {
    label: "准备设定",
    hint: "先把人物、设定和场景站稳",
    items: [
      { key: "characters", label: "角色档案", description: "维护人设与成长弧光", icon: Users },
      { key: "lore", label: "世界观库", description: "查设定、管引用、避冲突", icon: BookMarked },
      { key: "scenes", label: "场景沙盘", description: "梳理空间调度与人物位置", icon: Map },
      { key: "factions", label: "势力体系", description: "管理宏观格局与阵营变化", icon: Shield },
    ],
  },
  {
    label: "检查逻辑",
    hint: "防止关系和剧情写崩",
    items: [
      { key: "relations", label: "人物关系", description: "按章节追踪关系变化", icon: Network },
    ],
  },
  {
    label: "版本管理",
    hint: "回看历史，安全试错",
    items: [
      { key: "snapshots", label: "快照中心", description: "回溯版本与恢复状态", icon: Clock },
    ],
  },
];

const modulePaths: Record<string, string> = {
  dashboard: "/", characters: "/characters", relations: "/relations", chapters: "/chapters",
  scenes: "/scenes", lore: "/lore", factions: "/factions", snapshots: "/snapshots",
};

const gradientPresets = [
  { label: "浅蓝→淡紫", value: "linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #a78bfa 100%)" },
  { label: "薄荷绿→天青", value: "linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)" },
  { label: "粉紫→靛蓝", value: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #6366f1 100%)" },
  { label: "琥珀→金橙", value: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)" },
  { label: "玫红→珊瑚", value: "linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)" },
  { label: "碧玺→青绿", value: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)" },
];

/** Navigation content shared across desktop sidebar and mobile drawer */
function NavContent({ collapsed, onItemClick, theme, onThemeChange, customGradient, onGradientChange }: { collapsed?: boolean; onItemClick?: () => void; theme: ThemeName; onThemeChange: (t: ThemeName) => void; customGradient: string | null; onGradientChange: (g: string | null) => void }) {
  const pathname = usePathname();
  const [showThemePicker, setShowThemePicker] = useState(false);

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={smoothQuick} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-lg" style={{ background: "var(--accent-gradient)", transition: "background 400ms ease", boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-gradient) 35%, transparent)" }}>
                <span className="text-sm font-bold">N</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>小说创作</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && (
          <button type="button" onClick={() => setShowThemePicker(!showThemePicker)} className="rounded-lg p-1.5 transition-all duration-200 hover:bg-black/[0.06]" style={{ color: "var(--muted)" }}>
            <Palette size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 rounded-2xl border p-3" style={{ borderColor: "var(--panel-border)", background: "color-mix(in srgb, var(--panel-bg) 72%, transparent)" }}>
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--accent-gradient) 14%, transparent)", color: "var(--text-secondary)" }}>
              <AlertTriangle size={16} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={smoothQuick} className="min-w-0">
                  <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>当前创作建议</p>
                  <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>先进入章节创作继续正文，再回到人物关系核对第 89 章的情感张力变化。</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={smoothQuick} className="mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <Layers3 size={12} style={{ color: "var(--muted)" }} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>{group.label}</p>
                    </div>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>{group.hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const active = pathname === modulePaths[item.key];
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={modulePaths[item.key]}
                      onClick={onItemClick}
                      className="relative flex items-start gap-3 overflow-hidden rounded-2xl px-3 py-3 transition-all duration-200"
                      style={{ color: active ? "var(--text)" : "var(--muted)" }}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: "var(--panel-bg-hover)", border: "1px solid var(--panel-border-hover)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                          transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.7 }}
                        />
                      )}
                      {active && <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full" style={{ background: "var(--accent-gradient)", boxShadow: "0 0 8px color-mix(in srgb, var(--accent-gradient) 50%, transparent)" }} />}
                      <span className="relative z-10 mt-0.5 shrink-0" style={{ color: active ? "var(--accent-gradient)" : undefined }}>
                        <Icon size={18} />
                      </span>
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={smoothQuick} className="relative z-10 min-w-0 overflow-hidden">
                            <p className={`truncate text-sm ${active ? "font-semibold" : "font-medium"}`}>{item.label}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed" style={{ color: active ? "var(--text-secondary)" : "var(--muted)" }}>{item.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Theme Picker Popover */}
      <AnimatePresence>
        {showThemePicker && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={fadeScale()}
            className="absolute bottom-14 left-3 right-3 z-50 overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-xl"
            style={{ background: "var(--panel-bg)", borderColor: "var(--panel-border)", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>预设主题</p>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((item) => (
                <button key={item.id} type="button" onClick={() => { onThemeChange(item.id); onGradientChange(null); }} className="relative overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:shadow-md" style={{ borderColor: item.id === theme ? "var(--panel-border-hover)" : "transparent", background: item.id === theme ? "var(--panel-bg-hover)" : "transparent" }}>
                  <div className="mb-1.5 h-3 w-full rounded-md" style={{ background: item.gradient, transition: "background 300ms ease" }} />
                  <div className="flex items-center gap-1.5">
                    {item.id === theme && <Check size={12} style={{ color: "var(--accent-gradient)" }} />}
                    <span className="truncate text-xs font-medium" style={{ color: item.id === theme ? "var(--text)" : "var(--text-secondary)" }}>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3" style={{ borderTop: `1px solid var(--panel-border)` }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>渐变预设</p>
              <div className="grid grid-cols-2 gap-1.5">
                {gradientPresets.map((preset) => {
                  const isActive = customGradient === preset.value;
                  return (
                    <button key={preset.label} type="button" onClick={() => onGradientChange(preset.value)} className="relative overflow-hidden rounded-lg border px-2 py-1.5 text-left transition-all duration-200 hover:shadow-sm" style={{ borderColor: isActive ? "var(--panel-border-hover)" : "transparent" }}>
                      <div className="h-4 w-full rounded" style={{ background: preset.value, transition: "background 300ms ease" }} />
                      <span className="mt-1 block truncate text-[10px]" style={{ color: "var(--muted)" }}>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid var(--panel-border)` }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>自定义渐变</p>
              <div className="flex items-center gap-2">
                <input type="color" value={customGradient ? extractColorFromGradient(customGradient) : "#6366f1"} onChange={(e) => onGradientChange(`linear-gradient(135deg, ${e.target.value} 0%, ${shiftHue(e.target.value, 40)} 100%)`)} className="h-8 w-8 cursor-pointer rounded-lg border-0" />
                <span className="truncate text-xs" style={{ color: "var(--muted)" }}>{customGradient ? "已自定义" : "选择颜色生成渐变"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ThemeShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "cloud";
    return (window.localStorage.getItem("novel-theme") as ThemeName | null) ?? "cloud";
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customGradient, setCustomGradient] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("novel-gradient") as string | null;
  });

  const currentTheme = themes.find((t) => t.id === theme)!;

  const applyColors = useCallback(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;
    const gradient = customGradient ?? currentTheme.gradient;

    root.style.setProperty("--bg-start", colors.bgStart);
    root.style.setProperty("--bg-end", colors.bgEnd);
    root.style.setProperty("--panel-bg", colors.panelBg);
    root.style.setProperty("--panel-bg-hover", colors.panelBgHover);
    root.style.setProperty("--panel-border", colors.panelBorder);
    root.style.setProperty("--panel-border-hover", colors.panelBorderHover);
    root.style.setProperty("--text", colors.text);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--text-secondary", colors.textSecondary);
    root.style.setProperty("--noise-opacity", colors.noiseOpacity);
    root.style.setProperty("--accent-gradient", gradient);
    root.style.setProperty("--theme-dark", currentTheme.dark ? "1" : "0");
    root.style.setProperty("--glass-shadow", colors.glassShadow);
    root.style.setProperty("--glass-shadow-hover", colors.glassShadowHover);

    window.localStorage.setItem("novel-theme", theme);
    if (customGradient) window.localStorage.setItem("novel-gradient", customGradient);
  }, [currentTheme, theme, customGradient]);

  useEffect(() => { applyColors(); }, [applyColors]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden" style={{ background: `linear-gradient(160deg, var(--bg-start) 0%, var(--bg-end) 100%)`, color: "var(--text)", transition: "background 500ms cubic-bezier(0.4, 0, 0.2, 1), color 400ms ease" }}>
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />
      {/* Decorative Gradient Blobs */}
      <div className="deco-blob deco-blob--1" />
      <div className="deco-blob deco-blob--2" />
      <div className="deco-blob deco-blob--3" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ ...smoothEase, duration: 0.35 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] flex-col lg:hidden"
            style={{ background: "var(--panel-bg)", backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)", borderRight: "1px solid var(--panel-border)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            <div className="relative flex h-full flex-col">
              {/* Close Button */}
              <div className="absolute right-3 top-4 z-10">
                <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1.5 transition-all duration-200 hover:bg-black/[0.06]" style={{ color: "var(--muted)" }}>
                  <X size={18} />
                </button>
              </div>
              <NavContent onItemClick={() => setMobileMenuOpen(false)} theme={theme} onThemeChange={setTheme} customGradient={customGradient} onGradientChange={setCustomGradient} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center gap-3 border-b px-4 py-3 lg:hidden" style={{ background: "var(--panel-bg)", backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)", borderColor: "var(--panel-border)" }}>
        <button type="button" onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2 transition-all duration-200 hover:bg-black/[0.06]" style={{ color: "var(--muted)" }}>
          <Menu size={20} />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: "var(--accent-gradient)", boxShadow: "0 2px 8px color-mix(in srgb, var(--accent-gradient) 35%, transparent)" }}>
          N
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>小说创作</span>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.9 }}
        className="relative z-10 hidden flex-col lg:flex"
        style={{ background: "var(--panel-bg)", backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)", borderRight: "1px solid var(--panel-border)", boxShadow: "var(--glass-shadow)", transition: "background 400ms ease, border-color 400ms ease, box-shadow 400ms ease" }}
      >
        <NavContent collapsed={collapsed} theme={theme} onThemeChange={setTheme} customGradient={customGradient} onGradientChange={setCustomGradient} />
        {/* Collapse Toggle */}
        <div className="px-3 pb-3">
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-black/[0.06]" style={{ color: "var(--muted)" }}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={smoothQuick} className="overflow-hidden text-sm font-medium whitespace-nowrap">
                  收起导航
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="relative z-0 flex min-w-0 flex-1 flex-col overflow-hidden pt-14 lg:pt-0" style={{ transition: "color 400ms ease" }}>
        {children}
      </main>
    </div>
  );
}

function extractColorFromGradient(gradient: string): string {
  const match = gradient.match(/#[a-fA-F0-9]{6}/);
  return match ? match[0] : "#6366f1";
}

function shiftHue(hex: string, degrees: number): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / (max - min)) * 60;
  else if (max === g) h = (2 + (b - r) / (max - min)) * 60;
  else h = (4 + (r - g) / (max - min)) * 60;
  h = (h + degrees) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r2 = 0, g2 = 0, b2 = 0;
  if (h < 60) { r2 = c; g2 = x; b2 = 0; }
  else if (h < 120) { r2 = x; g2 = c; b2 = 0; }
  else if (h < 180) { r2 = 0; g2 = c; b2 = x; }
  else if (h < 240) { r2 = 0; g2 = x; b2 = c; }
  else if (h < 300) { r2 = x; g2 = 0; b2 = c; }
  else { r2 = c; g2 = 0; b2 = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}
