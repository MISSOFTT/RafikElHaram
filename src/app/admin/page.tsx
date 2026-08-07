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
        setMessage("CanlÄ± API ekran dÃ¼zenleyici endpointine ulaÅŸÄ±lamadÄ±; panel varsayÄ±lan listeyle aÃ§Ä±ldÄ±.");
      } else {
        setMessage(err instanceof Error ? err.message : "Veri alÄ±namadÄ±.");
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
      setMessage("BaÄŸlÄ± ekranlar otomatik gÃ¼ncellendi.");
    } catch {
      setScreenEditor(normalizeScreensLocal(nextData));
      setMessage("CanlÄ± kayÄ±t endpointine ulaÅŸÄ±lamadÄ±; baÄŸlÄ± ekranlar web tarafÄ±nda otomatik gÃ¼ncellendi.");
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
            <p className="mt-1 text-sm font-medium text-[#64717f]">Firma: {user.firmaAdi || user.firmaId} · Grup: {user.grupAdi || user.grupId}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 text-sm font-bold text-[#202833] hover:bg-[#202833] hover:text-white"
          >
            <FiLogOut aria-hidden="true" />
            Ã‡Ä±kÄ±ÅŸ
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
                  <p className="text-base font-bold text-[#202833]">{loading ? "YÃ¼kleniyor" : "ModÃ¼l hazÄ±r"}</p>
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
  const relationMaps = buildRelationMaps(objectRows);
  const columns = getDisplayColumns(objectRows).slice(0, 12);

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
                  {formatColumnTitle(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {objectRows.slice(0, 50).map((row, index) => (
              <tr key={index} className="hover:bg-[#fafbf8]">
                {columns.map((column) => (
                  <td key={column} className="max-w-[240px] truncate px-3 py-3 font-medium text-[#202833]">
                    {formatCell(row[column], column, row, relationMaps)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#64717f]">
        {objectRows.length} kayÄ±t gÃ¶steriliyor. Tablo ilk 50 kaydÄ± ve ilk 8 kolonu listeler.
      </div>
    </div>
  );
}

const technicalColumns = new Set(["id", "createdAt", "updatedAt", "deletedAt", "password", "sifre", "token", "refreshToken"]);

const preferredColumnOrder = [
  "adSoyad",
  "ad",
  "adi",
  "isim",
  "baslik",
  "title",
  "firma",
  "firmaAdi",
  "firmaAd",
  "grup",
  "grupAdi",
  "kafile",
  "kafileAdi",
  "otel",
  "otelAdi",
  "personel",
  "personelAdi",
  "rehber",
  "anaRehber",
  "telefon",
  "email",
  "eposta",
  "durum",
  "kullaniciTipi",
  "tarih",
  "baslangicTarihi",
  "bitisTarihi",
  "aciklama"
];

const columnTitles: Record<string, string> = {
  ad: "Ad",
  adi: "Ad",
  soyad: "Soyad",
  adSoyad: "Ad Soyad",
  isim: "Ä°sim",
  baslik: "BaÅŸlÄ±k",
  title: "BaÅŸlÄ±k",
  firma: "Firma",
  firmaId: "Firma",
  firmaID: "Firma",
  firmaAdi: "Firma",
  firmaAd: "Firma",
  grup: "Grup",
  grupId: "Grup",
  grupID: "Grup",
  grupAdi: "Grup",
  kafile: "Kafile",
  kafileId: "Kafile",
  kafileID: "Kafile",
  kafileAdi: "Kafile",
  otel: "Otel",
  otelId: "Otel",
  otelID: "Otel",
  otelAdi: "Otel",
  personel: "Personel",
  personelId: "Personel",
  personelID: "Personel",
  personelAdi: "Personel",
  rehber: "Rehber",
  rehberId: "Rehber",
  anaRehber: "Ana Rehber",
  anaRehberId: "Ana Rehber",
  telefon: "Telefon",
  email: "E-posta",
  eposta: "E-posta",
  kullaniciTipi: "KullanÄ±cÄ± Tipi",
  durum: "Durum",
  aktif: "Aktif",
  onay: "Onay",
  onayli: "OnaylÄ±",
  tarih: "Tarih",
  baslangicTarihi: "BaÅŸlangÄ±Ã§",
  bitisTarihi: "BitiÅŸ",
  aciklama: "AÃ§Ä±klama",
  odaNo: "Oda No",
  katNo: "Kat",
  plaka: "Plaka"
};

const enumLabels: Record<string, Record<number, string>> = {
  kullaniciTipi: {
    1: "HacÄ± adayÄ±",
    2: "Rehber",
    3: "Ana rehber",
    99: "Admin"
  },
  durum: {
    0: "Pasif",
    1: "Aktif",
    2: "Beklemede",
    3: "Ä°ptal"
  }
};

function getDisplayColumns(rows: Record<string, unknown>[]) {
  const allColumns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const hiddenIdColumns = new Set<string>();

  for (const column of allColumns) {
    if (!isIdColumn(column)) continue;
    const readableColumn = findReadableColumn(allColumns, getIdBase(column));
    if (readableColumn) hiddenIdColumns.add(column);
  }

  return allColumns
    .filter((column) => !technicalColumns.has(column) && !hiddenIdColumns.has(column))
    .sort((a, b) => columnScore(a) - columnScore(b));
}

function columnScore(column: string) {
  const directIndex = preferredColumnOrder.indexOf(column);
  if (directIndex >= 0) return directIndex;
  if (isIdColumn(column)) return 90;
  if (column.toLowerCase().includes("tarih")) return 70;
  return 50;
}

function formatColumnTitle(column: string) {
  if (columnTitles[column]) return columnTitles[column];
  const withoutId = isIdColumn(column) ? getIdBase(column) : column;
  const words = withoutId.replace(/([a-zÃ§ÄŸÄ±Ã¶ÅŸÃ¼])([A-ZÃ‡ÄÄ°Ã–ÅÃœ])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return words ? words.charAt(0).toLocaleUpperCase("tr-TR") + words.slice(1) : column;
}

function formatCell(value: unknown, column = "", row?: Record<string, unknown>, relationMaps?: RelationMaps) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Evet" : "HayÄ±r";
  if (typeof value === "number") {
    const enumValue = enumLabels[column]?.[value];
    if (enumValue) return enumValue;
    if (isIdColumn(column)) return resolveRelationName(column, value, row, relationMaps) ?? String(value);
  }
  if (typeof value === "string" && looksLikeDate(value)) return formatDate(value);
  if (typeof value === "object") return getReadableObjectName(value) || JSON.stringify(value);
  return String(value);
}

type RelationMaps = Record<string, Map<number, string>>;

function buildRelationMaps(rows: Record<string, unknown>[]): RelationMaps {
  const maps: RelationMaps = {};

  for (const row of rows) {
    for (const [column, value] of Object.entries(row)) {
      if (!isIdColumn(column) || typeof value !== "number") continue;
      const base = getIdBase(column);
      const readable = findReadableValue(row, base);
      if (!readable) continue;
      maps[base] ??= new Map<number, string>();
      maps[base].set(value, readable);
    }
  }

  return maps;
}

function resolveRelationName(column: string, value: number, row?: Record<string, unknown>, relationMaps?: RelationMaps) {
  const base = getIdBase(column);
  return (row && findReadableValue(row, base)) || relationMaps?.[base]?.get(value);
}

function findReadableValue(row: Record<string, unknown>, base: string) {
  const readableColumn = findReadableColumn(Object.keys(row), base);
  const readableValue = readableColumn ? row[readableColumn] : undefined;
  if (typeof readableValue === "string" && readableValue.trim()) return readableValue.trim();
  if (readableValue && typeof readableValue === "object") return getReadableObjectName(readableValue);
  return undefined;
}

function findReadableColumn(columns: string[], base: string) {
  const candidates = [base, `${base}Adi`, `${base}Ad`, `${base}Ismi`, `${base}Isim`, `${base}Name`, `${base}Title`];
  return candidates.find((candidate) => columns.includes(candidate));
}

function getReadableObjectName(value: object) {
  const data = value as Record<string, unknown>;
  const firstName = getString(data.ad) || getString(data.firstName);
  const lastName = getString(data.soyad) || getString(data.lastName);
  const fullName = `${firstName} ${lastName}`.trim();
  return (
    fullName ||
    getString(data.adSoyad) ||
    getString(data.adi) ||
    getString(data.isim) ||
    getString(data.name) ||
    getString(data.title) ||
    getString(data.baslik) ||
    getString(data.firmaAdi) ||
    getString(data.grupAdi) ||
    getString(data.kafileAdi) ||
    getString(data.otelAdi)
  );
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function isIdColumn(column: string) {
  return /(?:^id$|Id$|ID$|_id$)/.test(column);
}

function getIdBase(column: string) {
  return column.replace(/(?:Id|ID|_id)$/, "");
}

function looksLikeDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}/.test(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined
  }).format(date);
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
              {item.bagliEkranlar.length ? <span className="text-xs font-medium text-[#64717f]">BaÄŸlÄ±: {item.bagliEkranlar.join(", ")}</span> : null}
            </span>
            {item.secili ? <FiCheckSquare className="h-5 w-5 text-[#238071]" aria-hidden="true" /> : <FiSquare className="h-5 w-5 text-[#9aa4ad]" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}

