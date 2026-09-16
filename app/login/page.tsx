"use client";

import { useApp } from "@/lib/app-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { t } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError(t("auth.emailInvalid")); return; }
    if (!password || password.length < 6) { setError(t("auth.passwordMin")); return; }

    setLoading(true);
    setTimeout(() => {
      const usersStr = localStorage.getItem("hf_users");
      const users: Record<string, any> = usersStr ? JSON.parse(usersStr) : {};
      const existing = users[email.toLowerCase()];

      if (existing && existing.password === password) {
        const user = { email, name: existing.name || email.split("@")[0], role: existing.role || "admin" };
        localStorage.setItem("hf_user", JSON.stringify(user));
        setLoading(false);
        router.push("/dashboard");
      } else {
        const name = email.split("@")[0];
        const newUser = { email, name, password, role: "member", createdAt: new Date().toISOString() };
        users[email.toLowerCase()] = newUser;
        localStorage.setItem("hf_users", JSON.stringify(users));
        localStorage.setItem("hf_user", JSON.stringify(newUser));
        setLoading(false);
        router.push("/dashboard");
      }
    }, 400);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-gray-900/60 px-4 py-1.5 text-xs text-gray-300 mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            InvenSight
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t("auth.title")}</h1>
          <p className="mt-2 text-sm text-gray-400">{t("auth.welcome")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-700/50 bg-rose-950/30 p-3 text-sm text-rose-300">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm text-gray-400">{t("auth.email")}</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="admin@invensight.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-gray-900 border border-gray-700 py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-400">{t("auth.password")}</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-gray-900 border border-gray-700 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                {t("auth.loginButton")}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t("auth.noAccount")}{" "}
          <a href="/register" className="text-emerald-400 hover:text-emerald-300">
            {t("auth.registerButton")}
          </a>
        </p>

        <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/30 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-400 mb-1">Demo account</p>
          <p>Email: admin@invensight.co</p>
          <p>Password: password123</p>
        </div>
      </div>
    </main>
  );
}
