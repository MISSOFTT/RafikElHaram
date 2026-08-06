"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiCheckSquare, FiLogOut, FiRefreshCw, FiSettings, FiSquare } from "react-icons/fi";
import { adminModules, apiGet, defaultScreenEditor, type AdminModule, type AdminUser } from "@/lib/adminApi";

type ScreenItem = {
  key: string;
  baslik: string;
  kullaniciTarafi: "haci" | "rehber";
  secili: boolean;
  bagliEkranlar: string[];
};

type ScreenEditorResponse = {
  haci: ScreenItem[];
  rehber: ScreenItem[];
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeModule, setActiveModule] = useState<AdminModule>(adminModules[0]);
  const [preview, setPreview] = useState<unknown>(null);
  const [screenEditor, setScreenEditor] = useState<ScreenEditorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("rafikAdminUser");
    if (!rawUser) {
      router.replace("/admin/giris");
      return;
    }

    setUser(JSON.parse(rawUser) as AdminUser);
  }, [router]);

  const displayName = useMemo(() => {
    if (!user) return "";
    return `${user.ad ?? ""} ${user.soyad ?? ""}`.trim() || user.telefon;
  }, [user]);

  async function loadModule(module: AdminModule) {
    setActiveModule(module);
    setPreview(null);
    setMessage("");

    if (!user || !module.endpoint) return;

    setLoading(true);
    try {
      const data = await apiGet(module.key);
      if (module.key === "ekranDuzenleyici") {
        setScreenEditor(data as ScreenEditorResponse);
      } else {
        setPreview(data);
      }
    } catch (err) {
      if (module.key === "ekranDuzenleyici") {
        setScreenEditor(getDefaultScreenEditor());
        setMessage("Canlı API ekran düzenleyici endpointine ulaşılamadı; panel varsayılan listeyle açıldı.");
      } else {
        setMessage(err instanceof Error ? err.message : "Veri alınamadı.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function normalizeScreens(nextData: ScreenEditorResponse) {
    setScreenEditor(nextData);
    setLoading(true);
    setMessage("");

    try {
      const apiResponse = await fetch("/api/admin-screen-normalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          firmaId: user?.firmaId ?? 0,
          haci: nextData.haci.map(({ key, secili }) => ({ key, secili })),
          rehber: nextData.rehber.map(({ key, secili }) => ({ key, secili }))
        })
      });

      if (!apiResponse.ok) {
        throw new Error(await apiResponse.text());
      }

      setScreenEditor((await apiResponse.json()) as ScreenEditorResponse);
      setMessage("Bağlı ekranlar otomatik güncellendi.");
    } catch {
      setScreenEditor(normalizeScreensLocal(nextData));
      setMessage("Canlı kayıt endpointine ulaşılamadı; bağlı ekranlar web tarafında otomatik güncellendi.");
    } finally {
      setLoading(false);
    }
  }

  function toggleScreen(side: "haci" | "rehber", key: string) {
    if (!screenEditor) return;

    const nextData = {
      haci: screenEditor.haci.map((item) => (side === "haci" && item.key === key ? { ...item, secili: !item.secili } : item)),
      rehber: screenEditor.rehber.map((item) => (side === "rehber" && item.key === key ? { ...item, secili: !item.secili } : item))
    };

    void normalizeScreens(nextData);
  }

  function logout() {
    localStorage.removeItem("rafikAdminUser");
    router.replace("/admin/giris");
  }

  if (!user) {
    return <section className="min-h-screen bg-[#f6f7f3] pt-32" />;
  }

  return (
    <section className="min-h-screen bg-[#f6f7f3] px-5 pb-16 pt-28">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b67828]">Admin Paneli</p>
            <h1 className="mt-1 text-2xl font-bold text-[#202833]">{displayName}</h1>
            <p className="mt-1 text-sm font-medium text-[#64717f]">Firma ID: {user.firmaId} · Grup ID: {user.grupId}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 text-sm font-bold text-[#202833] hover:bg-[#202833] hover:text-white"
          >
            <FiLogOut aria-hidden="true" />
            Çıkış
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-lg border border-black/10 bg-white p-3 shadow-sm">
            {adminModules.map((module) => {
              const active = activeModule.key === module.key;
              return (
                <button
                  key={module.key}
                  type="button"
                  onClick={() => void loadModule(module)}
                  className={`mb-2 flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition ${
                    active ? "bg-[#202833] text-white" : "text-[#202833] hover:bg-black/[0.04]"
                  }`}
                >
                  <FiSettings className={`mt-0.5 h-4 w-4 ${active ? "text-[#f0b75f]" : "text-[#238071]"}`} aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-bold">{module.title}</span>
                    <span className={`mt-1 block text-xs leading-5 ${active ? "text-white/72" : "text-[#64717f]"}`}>{module.description}</span>
                  </span>
                </button>
              );
            })}
          </aside>

          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-[#202833]">{activeModule.title}</h2>
                <p className="mt-1 text-sm font-medium text-[#64717f]">{activeModule.description}</p>
              </div>
              {activeModule.endpoint ? (
                <button
                  type="button"
                  onClick={() => void loadModule(activeModule)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#238071] px-4 text-sm font-bold text-white hover:bg-[#202833]"
                >
                  <FiRefreshCw aria-hidden="true" />
                  Yenile
                </button>
              ) : null}
            </div>

            {message ? <p className="mb-4 rounded-md bg-[#fff6e8] px-3 py-2 text-sm font-semibold text-[#8b5a18]">{message}</p> : null}

            {activeModule.key === "ekranDuzenleyici" && screenEditor ? (
              <div className="grid gap-5 xl:grid-cols-2">
                <ScreenColumn title="Haci Tarafi" items={screenEditor.haci} onToggle={(key) => toggleScreen("haci", key)} />
                <ScreenColumn title="Rehber Tarafi" items={screenEditor.rehber} onToggle={(key) => toggleScreen("rehber", key)} />
              </div>
            ) : preview ? (
              <DataPreview data={preview} />
            ) : (
              <div className="grid min-h-[340px] place-items-center rounded-md border border-dashed border-black/15 bg-[#fafbf8] p-8 text-center">
                <div>
                  <p className="text-base font-bold text-[#202833]">{loading ? "Yükleniyor" : "Modül hazır"}</p>
                  <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[#64717f]">{activeModule.emptyState}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getDefaultScreenEditor(): ScreenEditorResponse {
  return {
    haci: defaultScreenEditor.haci.map((item) => ({ ...item, bagliEkranlar: [...item.bagliEkranlar] })) as ScreenItem[],
    rehber: defaultScreenEditor.rehber.map((item) => ({ ...item, bagliEkranlar: [...item.bagliEkranlar] })) as ScreenItem[]
  };
}

function cloneScreenEditor(data: ScreenEditorResponse) {
  return {
    haci: data.haci.map((item) => ({ ...item, bagliEkranlar: [...item.bagliEkranlar] })),
    rehber: data.rehber.map((item) => ({ ...item, bagliEkranlar: [...item.bagliEkranlar] }))
  };
}

function normalizeScreensLocal(data: ScreenEditorResponse) {
  const nextData = cloneScreenEditor(data);
  const sides = {
    haci: nextData.haci,
    rehber: nextData.rehber
  };

  let changed = true;
  while (changed) {
    changed = false;
    for (const source of [...nextData.haci, ...nextData.rehber].filter((item) => !item.secili)) {
      for (const targetRef of source.bagliEkranlar) {
        const [side, key] = targetRef.split(":") as ["haci" | "rehber", string];
        const target = sides[side]?.find((item) => item.key === key);
        if (target?.secili) {
          target.secili = false;
          changed = true;
        }
      }
    }
  }

  return nextData;
}

function DataPreview({ data }: { data: unknown }) {
  const rows = Array.isArray(data) ? data : [data];
  const objectRows = rows.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row));
  const columns = Array.from(new Set(objectRows.flatMap((row) => Object.keys(row)))).slice(0, 8);

  if (!objectRows.length || !columns.length) {
    return (
      <pre className="max-h-[560px] overflow-auto rounded-md bg-[#101820] p-4 text-xs leading-6 text-white">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-black/10">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-black/10 text-left text-sm">
          <thead className="bg-[#f6f7f3] text-xs font-bold uppercase text-[#64717f]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {objectRows.slice(0, 50).map((row, index) => (
              <tr key={index} className="hover:bg-[#fafbf8]">
                {columns.map((column) => (
                  <td key={column} className="max-w-[240px] truncate px-3 py-3 font-medium text-[#202833]">
                    {formatCell(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#64717f]">
        {objectRows.length} kayıt gösteriliyor. Tablo ilk 50 kaydı ve ilk 8 kolonu listeler.
      </div>
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function ScreenColumn({ title, items, onToggle }: { title: string; items: ScreenItem[]; onToggle: (key: string) => void }) {
  return (
    <div className="rounded-lg border border-black/10 p-4">
      <h3 className="mb-3 text-base font-bold text-[#202833]">{title}</h3>
      <div className="grid gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-black/10 bg-white px-3 py-2 text-left hover:bg-[#f6f7f3]"
          >
            <span>
              <span className="block text-sm font-bold text-[#202833]">{item.baslik}</span>
              {item.bagliEkranlar.length ? <span className="text-xs font-medium text-[#64717f]">Bağlı: {item.bagliEkranlar.join(", ")}</span> : null}
            </span>
            {item.secili ? <FiCheckSquare className="h-5 w-5 text-[#238071]" aria-hidden="true" /> : <FiSquare className="h-5 w-5 text-[#9aa4ad]" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
