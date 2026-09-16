"use client";

import { useApp } from "@/lib/app-provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, AlertCircle, Check } from "lucide-react";

export default function RegisterPage() {
  const { t } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Nama wajib diisi"); return; }
    if (!email || !email.includes("@")) { setError(t("auth.emailInvalid")); return; }
    if (!password || password.length < 6) { setError(t("auth.passwordMin")); return; }

    setLoading(true);
    setTimeout(() => {
      const usersStr = localStorage.getItem("hf_users");
      const users: Record<string, any> = usersStr ? JSON.parse(usersStr) : {};
      const key = email.toLowerCase();

      if (users[key]) {
        setError("Email sudah terdaftar");
        setLoading(false);
        return;
      }

      users[key] = { email, name: name.trim(), password, role: "member", createdAt: new Date().toISOString() };
      localStorage.setItem("hf_users", JSON.stringify(users));
      localStorage.setItem("hf_user", JSON.stringify({ email, name: name.trim(), role: "member" }));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 800);
    }, 400);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-gray-900/60 px-4 py-1.5 text-xs text-gray-300 mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            InvenSight
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t("auth.registerTitle")}</h1>
          <p className="mt-2 text-sm text-gray-400">Mulai kelola inventaris Anda sekarang</p>
        </div>

        {success ? (
          <div className="rounded-lg border border-emerald-700/50 bg-emerald-950/30 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/40">
              <Check size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-medium text-white">Akun berhasil dibuat!</h2>
            <p className="mt-1 text-sm text-gray-400">Mengautentikasi...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-700/50 bg-rose-950/30 p-3 text-sm text-rose-300">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">Nama lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">{t("auth.email")}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="budi@tokosaya.co"
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
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{t("auth.passwordMin")}</p>
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
                  {t("auth.registerButton")}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          {t("auth.haveAccount")}{" "}
          <a href="/login" className="text-emerald-400 hover:text-emerald-300">
            {t("auth.loginButton")}
          </a>
        </p>
      </div>
    </main>
  );
}
