"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiActivity, FiBarChart2, FiCheckCircle, FiGrid, FiLock, FiLogIn, FiMail, FiPhone, FiUsers } from "react-icons/fi";
import { type AdminUser } from "@/lib/adminApi";

type LoginMode = "telefon" | "eposta";

export default function AdminGirisPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<LoginMode>("telefon");
  const [telefon, setTelefon] = useState("");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(
          loginMode === "telefon"
            ? { Telefon: telefon, Sifre: sifre, telefon, sifre }
            : { Telefon: eposta, Sifre: sifre, telefon: eposta, eposta, email: eposta, sifre }
        )
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const user = (await response.json()) as AdminUser;
      if (!user.firmaId || user.firmaId <= 0) {
        throw new Error("Bu hesap firma paneline bağlı değil.");
      }

      localStorage.setItem("rafikAdminUser", JSON.stringify(user));
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message.replaceAll('"', "") : "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#f6f7f3] px-5 pb-16 pt-32">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <span className="relative h-14 w-14 overflow-hidden rounded-full border border-[#d79536]/30 bg-white shadow-sm">
              <Image src="/brand/rafik-al-haram-logo.jpeg" alt="" fill sizes="56px" className="object-cover object-top" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b67828]">Yonetim</p>
              <h1 className="text-3xl font-bold text-[#202833]">Admin Girisi</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-5 grid grid-cols-2 rounded-md bg-[#f6f7f3] p-1">
              <button
                type="button"
                onClick={() => setLoginMode("telefon")}
                className={`flex h-10 items-center justify-center gap-2 rounded px-3 text-sm font-bold transition ${
                  loginMode === "telefon" ? "bg-white text-[#202833] shadow-sm" : "text-[#64717f] hover:text-[#202833]"
                }`}
              >
                <FiPhone aria-hidden="true" />
                Telefon
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("eposta")}
                className={`flex h-10 items-center justify-center gap-2 rounded px-3 text-sm font-bold transition ${
                  loginMode === "eposta" ? "bg-white text-[#202833] shadow-sm" : "text-[#64717f] hover:text-[#202833]"
                }`}
              >
                <FiMail aria-hidden="true" />
                E-posta
              </button>
            </div>

            {loginMode === "telefon" ? (
              <label className="block text-sm font-semibold text-[#202833]">
                Telefon
                <span className="mt-2 flex h-12 items-center gap-3 rounded-md border border-black/10 bg-white px-3">
                  <FiPhone className="h-5 w-5 text-[#238071]" aria-hidden="true" />
                  <input
                    value={telefon}
                    onChange={(event) => setTelefon(event.target.value)}
                    className="h-full w-full bg-transparent text-base outline-none"
                    autoComplete="username"
                    inputMode="tel"
                    required={loginMode === "telefon"}
                  />
                </span>
              </label>
            ) : (
              <label className="block text-sm font-semibold text-[#202833]">
                E-posta
                <span className="mt-2 flex h-12 items-center gap-3 rounded-md border border-black/10 bg-white px-3">
                  <FiMail className="h-5 w-5 text-[#238071]" aria-hidden="true" />
                  <input
                    value={eposta}
                    onChange={(event) => setEposta(event.target.value)}
                    className="h-full w-full bg-transparent text-base outline-none"
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    required={loginMode === "eposta"}
                  />
                </span>
              </label>
            )}

            <label className="mt-4 block text-sm font-semibold text-[#202833]">
              Sifre
              <span className="mt-2 flex h-12 items-center gap-3 rounded-md border border-black/10 bg-white px-3">
                <FiLock className="h-5 w-5 text-[#238071]" aria-hidden="true" />
                <input
                  value={sifre}
                  onChange={(event) => setSifre(event.target.value)}
                  className="h-full w-full bg-transparent text-base outline-none"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </span>
            </label>

            {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#202833] px-5 text-sm font-bold text-white transition hover:bg-[#238071] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogIn aria-hidden="true" />
              {loading ? "Kontrol ediliyor" : "Giriş Yap"}
            </button>
          </form>
        </div>

        <div className="hidden overflow-hidden rounded-lg bg-[#202833] text-white shadow-sm lg:block">
          <div className="grid h-full content-between p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f0b75f]">Rafik Al Haram</p>
              <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight">Tek panelden organizasyon kontrolu.</h2>
              <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/72">
                Mobil uygulamadaki admin icerikleri web tarafinda daha okunur tablolar, hizli moduller ve ekran duzenleyiciyle birlikte kullanima hazir.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Personel", value: "Rehberler", icon: FiUsers },
                  { label: "Operasyon", value: "Kafileler", icon: FiGrid },
                  { label: "Takip", value: "Analiz", icon: FiBarChart2 }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-md border border-white/12 bg-white/[0.06] p-4">
                      <Icon className="h-5 w-5 text-[#f0b75f]" aria-hidden="true" />
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-white/48">{item.label}</p>
                      <p className="mt-1 text-sm font-bold text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-md border border-white/12 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-white">Admin modulleri</p>
                <span className="rounded-full bg-[#f0b75f]/18 px-3 py-1 text-xs font-bold text-[#f0b75f]">Hazir</span>
              </div>
              <div className="grid gap-2">
                {[
                  { title: "Personel ve kafile yonetimi", icon: FiUsers },
                  { title: "Otel, servis ve etkinlik takibi", icon: FiActivity },
                  { title: "Duyuru, SOS ve konferans akisi", icon: FiCheckCircle },
                  { title: "Haci / rehber ekran duzenleyici", icon: FiGrid }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-center gap-3 rounded-md bg-white/[0.06] px-3 py-3">
                      <span className="grid h-8 w-8 place-items-center rounded bg-[#238071]/25 text-[#71d8c8]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-white/86">{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function readErrorMessage(response: Response) {
  const text = await response.text();
  if (!text) return "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";

  try {
    const data = JSON.parse(text) as { message?: string; error?: string };
    return data.message || data.error || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
  } catch {
    if (response.status === 400) return "Giriş bilgileri kabul edilmedi. Telefon/e-posta ve şifrenizi kontrol edin.";
    if (text.includes("Kullanıcı bulunamadı")) return "Kullanıcı bulunamadı. Telefon/e-posta ve şifrenizi kontrol edin.";
    if (text.includes("Failed to fetch")) return "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.";
    return text;
  }
}
