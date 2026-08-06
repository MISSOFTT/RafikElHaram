"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiLock, FiLogIn, FiPhone } from "react-icons/fi";
import { adminApiBaseUrl, type AdminUser } from "@/lib/adminApi";

export default function AdminGirisPage() {
  const router = useRouter();
  const [telefon, setTelefon] = useState("");
  const [sifre, setSifre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${adminApiBaseUrl}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ telefon, sifre })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const user = (await response.json()) as AdminUser;
      if (!user.firmaId || user.firmaId <= 0) {
        throw new Error("Bu hesap firma paneline bagli degil.");
      }

      localStorage.setItem("rafikAdminUser", JSON.stringify(user));
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message.replaceAll('"', "") : "Giris yapilamadi.");
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
                  required
                />
              </span>
            </label>

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
              {loading ? "Kontrol ediliyor" : "Giris Yap"}
            </button>
          </form>
        </div>

        <div className="hidden rounded-lg bg-[#202833] p-8 text-white lg:block">
          <div className="grid h-full content-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f0b75f]">Rafik Al Haram</p>
              <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight">Mobil uygulamadaki admin icerikleri web panelinde.</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-white/82">
              {["Personel", "Kafile", "Otel", "Etkinlik", "SOS", "Analiz", "Duyuru", "Ekran Duzenleyici"].map((item) => (
                <span key={item} className="rounded-md border border-white/12 bg-white/6 px-3 py-3">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
