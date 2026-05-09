"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const user = await api.auth.login(form.email, form.password);
        // TODO: 存储登录状态（localStorage / cookie / token）
        localStorage.setItem("plotforge-user", JSON.stringify(user));
        router.push("/");
      } else {
        if (form.password !== form.confirmPassword) {
          setError("两次输入的密码不一致");
          setLoading(false);
          return;
        }
        const user = await api.auth.register(form.email, form.name!, form.password);
        localStorage.setItem("plotforge-user", JSON.stringify(user));
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PlotForge
          </h1>
          <p className="text-white/40 mt-2 text-sm">AI 驱动的小说创作工作台</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {isLogin ? "欢迎回来" : "创建账号"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-white/70 mb-1.5">昵称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="你的昵称"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-1.5">邮箱</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm text-white/70 mb-1.5">确认密码</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium transition-all cursor-pointer"
            >
              {loading ? "处理中..." : isLogin ? "登录" : "注册"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            {isLogin ? "还没有账号？" : "已有账号？"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="ml-1 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              {isLogin ? "立即注册" : "去登录"}
            </button>
          </p>
        </div>

        {/* 返回书架 */}
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-white/40 hover:text-white/60 transition-colors">
            ← 返回作品书架
          </Link>
        </p>
      </div>
    </div>
  );
}
