"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiCheckSquare, FiEdit2, FiLogOut, FiMapPin, FiPlus, FiRefreshCw, FiSettings, FiSquare, FiTrash2, FiX } from "react-icons/fi";
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
  const [creating, setCreating] = useState(false);
  const [createModule, setCreateModule] = useState<AdminModule | null>(null);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
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
        setScreenEditor(applySavedScreenEditor(normalizeScreenEditorResponse(data), user.firmaId));
      } else {
        setPreview(data);
      }
    } catch (err) {
      if (module.key === "ekranDuzenleyici") {
        setScreenEditor(applySavedScreenEditor(getDefaultScreenEditor(), user.firmaId));
      } else {
        setMessage(err instanceof Error ? err.message : "Veri alınamadı.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function normalizeScreens(nextData: ScreenEditorResponse) {
    const normalizedNextData = normalizeScreensLocal(nextData);
    setScreenEditor(normalizedNextData);
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
          haci: normalizedNextData.haci.map(({ key, secili }) => ({ key, secili })),
          rehber: normalizedNextData.rehber.map(({ key, secili }) => ({ key, secili }))
        })
      });

      if (!apiResponse.ok) {
        throw new Error(await apiResponse.text());
      }

      saveScreenEditorSelection(normalizedNextData, user?.firmaId ?? 0);
      setScreenEditor(applySavedScreenEditor(normalizeScreenEditorResponse(await apiResponse.json()), user?.firmaId ?? 0));
      setMessage("Bağlı ekranlar birlikte güncellendi.");
    } catch {
      setScreenEditor(normalizedNextData);
      saveScreenEditorSelection(normalizedNextData, user?.firmaId ?? 0);
      setMessage("Bağlı ekranlar birlikte güncellendi.");
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

  async function createRecord(formData: FormData) {
    if (!createModule) return;

    formData.set("moduleKey", createModule.key);
    if (editRow) {
      const id = getRowId(editRow);
      if (id) formData.set("Id", String(id));
    }
    setCreating(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin-create", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const savedModule = createModule;
      setCreateModule(null);
      setEditRow(null);
      await loadModule(savedModule);
      setMessage(`${savedModule.title} kaydı oluşturuldu.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kayıt oluşturulamadı.");
    } finally {
      setCreating(false);
    }
  }

  async function deleteRecord(row: Record<string, unknown>) {
    const id = getRowId(row);
    if (!id) {
      setMessage("Silinecek kayıt için geçerli ID bulunamadı.");
      return;
    }

    if (!window.confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ moduleKey: activeModule.key, id })
      });

      if (!response.ok) throw new Error(await response.text());

      await loadModule(activeModule);
      setMessage(`${activeModule.title} kaydı silindi.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kayıt silinemedi.");
    } finally {
      setLoading(false);
    }
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
                <div className="flex flex-wrap gap-2">
                  {activeModule.canCreate ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditRow(null);
                        setCreateModule(activeModule);
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#238071]/30 bg-white px-4 text-sm font-bold text-[#238071] hover:bg-[#eef8f5]"
                    >
                      <FiPlus aria-hidden="true" />
                      Yeni Ekle
                    </button>
                  ) : null}
                <button
                  type="button"
                  onClick={() => void loadModule(activeModule)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#238071] px-4 text-sm font-bold text-white hover:bg-[#202833]"
                >
                  <FiRefreshCw aria-hidden="true" />
                  Yenile
                </button>
                </div>
              ) : null}
            </div>

            {message ? <p className="mb-4 rounded-md bg-[#fff6e8] px-3 py-2 text-sm font-semibold text-[#8b5a18]">{message}</p> : null}

            {activeModule.key === "ekranDuzenleyici" && screenEditor ? (
              <div className="grid gap-5 xl:grid-cols-2">
                <ScreenColumn title="Hacı Tarafı" items={screenEditor.haci} onToggle={(key) => toggleScreen("haci", key)} />
                <ScreenColumn title="Rehber Tarafı" items={screenEditor.rehber} onToggle={(key) => toggleScreen("rehber", key)} />
              </div>
            ) : preview ? (
              <DataPreview
                data={preview}
                module={activeModule}
                onEdit={(row) => {
                  setEditRow(row);
                  setCreateModule(activeModule);
                }}
                onDelete={deleteRecord}
              />
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
      {createModule ? (
        <CreateModal
          module={createModule}
          creating={creating}
          initialRow={editRow}
          onClose={() => {
            setCreateModule(null);
            setEditRow(null);
          }}
          onSubmit={createRecord}
        />
      ) : null}
    </section>
  );
}

function CreateModal({
  module,
  creating,
  initialRow,
  onClose,
  onSubmit
}: {
  module: AdminModule;
  creating: boolean;
  initialRow: Record<string, unknown> | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-8">
      <form
        className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-5 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(new FormData(event.currentTarget));
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#202833]">{module.title} {initialRow ? "Düzenle" : "Ekle"}</h2>
            <p className="mt-1 text-sm font-medium text-[#64717f]">Alanlar mobil uygulamadaki backend kayıt yapısıyla uyumludur.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-black/10 text-[#202833] hover:bg-[#f6f7f3]"
            aria-label="Kapat"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        {initialRow ? <input type="hidden" name="Id" value={String(getRowId(initialRow) || "")} /> : null}
        {module.key === "personel" ? <PersonelForm /> : null}
        {module.key === "kafile" ? <KafileForm /> : null}
        {module.key === "otel" ? <OtelForm /> : null}
        {module.key === "duyuru" ? <DuyuruForm /> : null}
        {module.key === "konferans" ? <KonferansForm /> : null}
        {module.key === "anket" ? <AnketForm /> : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-md border border-black/10 bg-white px-4 text-sm font-bold text-[#202833] hover:bg-[#f6f7f3]"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#238071] px-4 text-sm font-bold text-white hover:bg-[#202833] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Kaydediliyor" : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PersonelForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField name="Ad" label="Ad" required />
      <FormField name="Soyad" label="Soyad" required />
      <FormField name="Telefon" label="Telefon" type="tel" required />
      <FormField name="Sifre" label="Şifre" type="password" required />
      <FormSelect
        name="Tur"
        label="Personel Türü"
        required
        options={[
          { value: "2", label: "Rehber" },
          { value: "4", label: "Ana Rehber" }
        ]}
      />
      <FormField name="AnaRehberSecimi" label="Bağlı Ana Rehber" />
      <FormField name="Oda" label="Oda" />
      <FormField name="Kat" label="Kat" />
      <FormField name="Latitude" label="Enlem" type="number" step="any" />
      <FormField name="Longitude" label="Boylam" type="number" step="any" />
      <FormField name="ResimDosya" label="Fotoğraf" type="file" />
    </div>
  );
}

function KafileForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField name="PersonelId" label="Sorumlu Personel ID" type="number" required />
      <FormField name="OtelId" label="Otel ID" type="number" required />
      <FormField name="Nereden" label="Nereden" />
      <FormField name="Nereye" label="Nereye" />
      <FormField name="TurBaslangicTarihi" label="Tur Başlangıç Tarihi" type="date" />
      <FormField name="TurBitisTarihi" label="Tur Bitiş Tarihi" type="date" />
      <FormField name="YemekSaati1" label="Kahvaltı Saati" type="time" />
      <FormField name="YemekSaati2" label="Öğle Yemeği Saati" type="time" />
      <FormField name="YemekSaati3" label="Akşam Yemeği Saati" type="time" />
      <FormField name="Bilgi" label="Bilgi" textarea className="md:col-span-2" />
    </div>
  );
}

function OtelForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField name="Ad" label="Otel Adı" required />
      <FormField name="MudurAd" label="Müdür Adı" />
      <FormField name="Telefon" label="Telefon" type="tel" />
      <FormField name="ResepsiyonTel" label="Resepsiyon Telefonu" type="tel" />
      <FormField name="Konum" label="Konum" required className="md:col-span-2" />
      <FormField name="ResimDosya" label="Resim" type="file" className="md:col-span-2" />
    </div>
  );
}

function DuyuruForm() {
  return <FormField name="Metin" label="Duyuru Metni" required textarea />;
}

function KonferansForm() {
  return <FormField name="Baslik" label="Konferans Başlığı" required />;
}

function AnketForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField name="Baslik" label="Anket Başlığı" required className="md:col-span-2" />
      <FormField name="Aciklama" label="Açıklama" textarea className="md:col-span-2" />
      <FormField name="GrupId" label="Grup ID" type="number" />
    </div>
  );
}

function FormField({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
  step,
  className = ""
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  step?: string;
  className?: string;
}) {
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#202833] outline-none focus:border-[#238071] focus:ring-2 focus:ring-[#238071]/15";

  return (
    <label className={`block text-sm font-bold text-[#202833] ${className}`}>
      {label}
      {required ? <span className="text-[#b67828]"> *</span> : null}
      {textarea ? (
        <textarea name={name} required={required} rows={4} className={fieldClass} />
      ) : (
        <input name={name} type={type} required={required} step={step} className={fieldClass} />
      )}
    </label>
  );
}

function FormSelect({
  name,
  label,
  required = false,
  options
}: {
  name: string;
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm font-bold text-[#202833]">
      {label}
      {required ? <span className="text-[#b67828]"> *</span> : null}
      <select
        name={name}
        required={required}
        className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#202833] outline-none focus:border-[#238071] focus:ring-2 focus:ring-[#238071]/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function getDefaultScreenEditor(): ScreenEditorResponse {
  return {
    haci: defaultScreenEditor.haci.map((item) => ({ ...item, bagliEkranlar: [...item.bagliEkranlar] })) as ScreenItem[],
    rehber: defaultScreenEditor.rehber.map((item) => ({ ...item, bagliEkranlar: [...item.bagliEkranlar] })) as ScreenItem[]
  };
}

function normalizeScreenEditorResponse(data: unknown): ScreenEditorResponse {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const haci = Array.isArray(record.haci) ? record.haci : Array.isArray(record.Haci) ? record.Haci : [];
  const rehber = Array.isArray(record.rehber) ? record.rehber : Array.isArray(record.Rehber) ? record.Rehber : [];

  return {
    haci: haci.map(normalizeScreenItem),
    rehber: rehber.map(normalizeScreenItem)
  };
}

function normalizeScreenItem(item: unknown): ScreenItem {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
  const key = String(record.key ?? record.Key ?? "");

  return {
    key,
    baslik: String(record.baslik ?? record.Baslik ?? formatColumnTitle(key)),
    kullaniciTarafi: (record.kullaniciTarafi ?? record.KullaniciTarafi) === "rehber" ? "rehber" : "haci",
    secili: typeof (record.secili ?? record.Secili) === "boolean" ? Boolean(record.secili ?? record.Secili) : true,
    bagliEkranlar: Array.isArray(record.bagliEkranlar)
      ? record.bagliEkranlar.map(String)
      : Array.isArray(record.BagliEkranlar)
        ? record.BagliEkranlar.map(String)
        : []
  };
}

function screenStorageKey(firmaId: number) {
  return `rafikAdminScreenEditor:${firmaId || "default"}`;
}

function saveScreenEditorSelection(data: ScreenEditorResponse, firmaId: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    screenStorageKey(firmaId),
    JSON.stringify({
      haci: data.haci.map(({ key, secili }) => ({ key, secili })),
      rehber: data.rehber.map(({ key, secili }) => ({ key, secili }))
    })
  );
}

function applySavedScreenEditor(data: ScreenEditorResponse, firmaId: number) {
  if (typeof window === "undefined") return data;

  try {
    const saved = JSON.parse(localStorage.getItem(screenStorageKey(firmaId)) || "{}") as {
      haci?: Array<{ key: string; secili: boolean }>;
      rehber?: Array<{ key: string; secili: boolean }>;
    };
    const savedHaci = new Map((saved.haci || []).map((item) => [item.key, item.secili]));
    const savedRehber = new Map((saved.rehber || []).map((item) => [item.key, item.secili]));

    return normalizeScreensLocal({
      haci: data.haci.map((item) => ({ ...item, secili: savedHaci.get(item.key) ?? item.secili })),
      rehber: data.rehber.map((item) => ({ ...item, secili: savedRehber.get(item.key) ?? item.secili }))
    });
  } catch {
    return data;
  }
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

function DataPreview({
  data,
  module,
  onEdit,
  onDelete
}: {
  data: unknown;
  module: AdminModule;
  onEdit: (row: Record<string, unknown>) => void;
  onDelete: (row: Record<string, unknown>) => void;
}) {
  const rows = Array.isArray(data) ? data : [data];
  const objectRows = rows
    .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row))
    .map(normalizeTableRow)
    .filter((row) => shouldShowRow(row, module.key));
  const relationMaps = buildRelationMaps(objectRows);
  const maxColumns = module.key === "analiz" ? 6 : 9;
  const columns = getDisplayColumns(objectRows, module.key).slice(0, maxColumns);

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
          <thead className="bg-[#f6f7f3] text-xs font-bold normal-case text-[#64717f]">
            <tr>
              <th className="whitespace-nowrap px-3 py-3">İşlemler</th>
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
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="grid h-8 w-8 place-items-center rounded-md border border-black/10 text-[#238071] hover:bg-[#eef8f5]"
                      aria-label="Düzenle"
                    >
                      <FiEdit2 aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row)}
                      className="grid h-8 w-8 place-items-center rounded-md border border-black/10 text-[#b42318] hover:bg-[#fff1f0]"
                      aria-label="Sil"
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                </td>
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
        {objectRows.length} kayıt gösteriliyor. Tablo ilk 50 kaydı listeler.
      </div>
    </div>
  );
}

const technicalColumns = new Set([
  "id",
  "ad",
  "soyad",
  "firma",
  "firmaId",
  "firmaID",
  "firmaAdi",
  "firmaAd",
  "grup",
  "Grup",
  "personel",
  "Personel",
  "personelId",
  "PersonelId",
  "createDate",
  "createdDate",
  "createdAt",
  "createUser",
  "createdUser",
  "updateDate",
  "updatedDate",
  "updatedAt",
  "updateUser",
  "updatedUser",
  "deletedAt",
  "password",
  "sifre",
  "token",
  "refreshToken",
  "profilPhoto",
  "ProfilPhoto",
  "resim",
  "Resim",
  "resimUrl",
  "ResimUrl",
  "imageUrl",
  "anaRehberFoto",
  "rehberFoto"
]);

const preferredColumnOrder = [
  "fotograf",
  "adSoyad",
  "telefon",
  "personelTipi",
  "kullaniciTip",
  "tur",
  "baslik",
  "title",
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
  fotograf: "Fotoğraf",
  fotoğraf: "Fotoğraf",
  tur: "Personel Türü",
  Tur: "Personel Türü",
  personelTipi: "Personel Tipi",
  PersonelTipi: "Personel Tipi",
  "Personel Tipi": "Personel Tipi",
  kullaniciTip: "Kullanıcı Tipi",
  KullaniciTip: "Kullanıcı Tipi",
  sureSaniye: "Süre (sn)",
  SureSaniye: "Süre (sn)",
  "Sure Saniye": "Süre (sn)",
  "Süre Saniye": "Süre (sn)",
  sure: "Süre",
  Sure: "Süre",
  mudurAd: "Müdür Adı",
  mudurAdi: "Müdür Adı",
  soyad: "Soyad",
  adSoyad: "Ad Soyad",
  isim: "İsim",
  baslik: "Başlık",
  title: "Başlık",
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
  bagliAnaRehberId: "Bağlı Ana Rehber",
  bagliAnaRehberAdSoyad: "Bağlı Ana Rehber",
  telefon: "Telefon",
  tel: "Telefon",
  resepsiyonTel: "Resepsiyon Telefonu",
  resepsiyonTelefon: "Resepsiyon Telefonu",
  email: "E-posta",
  eposta: "E-posta",
  kullaniciTipi: "Kullanıcı Tipi",
  durum: "Durum",
  aktif: "Aktif",
  onay: "Onay",
  onayli: "Onaylı",
  tarih: "Tarih",
  createDate: "Oluşturma Tarihi",
  createdDate: "Oluşturma Tarihi",
  updateDate: "Güncelleme Tarihi",
  updatedDate: "Güncelleme Tarihi",
  createUser: "Oluşturan",
  createdUser: "Oluşturan",
  updateUser: "Güncelleyen",
  updatedUser: "Güncelleyen",
  baslangicTarihi: "Başlangıç",
  bitisTarihi: "Bitiş",
  aciklama: "Açıklama",
  odaNo: "Oda No",
  katNo: "Kat",
  plaka: "Plaka",
  konum: "Konum",
  resim: "Resim",
  resimUrl: "Resim",
  imageUrl: "Resim",
  adres: "Adres",
  ulke: "Ülke",
  sehir: "Şehir",
  il: "İl",
  ilce: "İlçe",
  doviz: "Döviz",
  kible: "Kıble",
  turSayaci: "Tur Sayacı",
  ibadetVideolari: "İbadet Videoları",
  namazVakitleri: "Namaz Vakitleri",
  bulusmaNoktasi: "Buluşma Noktası",
  umreProgrami: "Umre Programı",
  ucusBilgi: "Uçuş Bilgi"
};

const enumLabels: Record<string, Record<number, string>> = {
  tur: {
    2: "Rehber",
    4: "Ana Rehber"
  },
  Tur: {
    2: "Rehber",
    4: "Ana Rehber"
  },
  personelTipi: {
    2: "Rehber",
    4: "Ana Rehber"
  },
  PersonelTipi: {
    2: "Rehber",
    4: "Ana Rehber"
  },
  "Personel Tipi": {
    2: "Rehber",
    4: "Ana Rehber"
  },
  kullaniciTip: {
    1: "Hacı adayı",
    2: "Rehber",
    4: "Ana Rehber",
    99: "Admin"
  },
  KullaniciTip: {
    1: "Hacı adayı",
    2: "Rehber",
    4: "Ana Rehber",
    99: "Admin"
  },
  kullaniciTipi: {
    1: "Hacı adayı",
    2: "Rehber",
    4: "Ana Rehber",
    99: "Admin"
  },
  durum: {
    0: "Pasif",
    1: "Aktif",
    2: "Beklemede",
    3: "İptal"
  }
};

function normalizeTableRow(row: Record<string, unknown>) {
  const next = { ...row };
  const firstName = getString(row.ad) || getString(row.Ad);
  const lastName = getString(row.soyad) || getString(row.Soyad);
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName && !next.adSoyad) next.adSoyad = fullName;

  const linkedGuideName = `${getString(row.bagliAnaRehberAd) || getString(row.BagliAnaRehberAd)} ${
    getString(row.bagliAnaRehberSoyad) || getString(row.BagliAnaRehberSoyad)
  }`.trim();
  if (linkedGuideName) next.bagliAnaRehberAdSoyad = linkedGuideName;

  const imageValue =
    getString(row.fotograf) ||
    getString(row.resim) ||
    getString(row.Resim) ||
    getString(row.resimUrl) ||
    getString(row.ResimUrl) ||
    getString(row.imageUrl) ||
    getString(row.profilPhoto) ||
    getString(row.ProfilPhoto) ||
    getString(row.anaRehberFoto) ||
    getString(row.rehberFoto);

  if (imageValue) next.fotograf = imageValue;
  return next;
}

function shouldShowRow(row: Record<string, unknown>, moduleKey: string) {
  if (moduleKey !== "konferans") return true;
  const durationSeconds = getConferenceDurationSeconds(row);
  return durationSeconds === null || durationSeconds >= 120;
}

function getConferenceDurationSeconds(row: Record<string, unknown>) {
  const directDuration = getNumericField(row, ["sure", "Sure", "sureSaniye", "SureSaniye", "duration", "Duration", "durationSeconds", "DurationSeconds"]);
  if (directDuration !== null) return directDuration > 1000 ? Math.round(directDuration / 1000) : directDuration;

  const start = getDateField(row, ["baslangicTarihi", "BaslangicTarihi", "startDate", "StartDate", "baslamaZamani", "BaslamaZamani"]);
  const end = getDateField(row, ["bitisTarihi", "BitisTarihi", "endDate", "EndDate", "bitisZamani", "BitisZamani"]);
  if (!start || !end) return null;

  const seconds = Math.round((end.getTime() - start.getTime()) / 1000);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

function getDisplayColumns(rows: Record<string, unknown>[], moduleKey = "") {
  const allColumns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const hiddenIdColumns = new Set<string>();

  for (const column of allColumns) {
    if (!isIdColumn(column)) continue;
    const readableColumn = findReadableColumn(allColumns, getIdBase(column));
    if (readableColumn) hiddenIdColumns.add(column);
  }

  return allColumns
    .filter((column) => !technicalColumns.has(column) && !hiddenIdColumns.has(column) && !shouldHideColumn(column, moduleKey))
    .sort((a, b) => columnScore(a) - columnScore(b));
}

function shouldHideColumn(column: string, moduleKey: string) {
  const normalized = column.toLocaleLowerCase("tr-TR");
  if (normalized.includes("firma")) return true;
  if (normalized.includes("created") || normalized.includes("create")) return true;
  if (normalized.includes("updated") || normalized.includes("update")) return true;
  if (normalized.includes("tarih") && !["turBaslangicTarihi", "turBitisTarihi", "tarih"].includes(column)) return true;
  if (moduleKey === "personel" && ["bagliAnaRehberAd", "bagliAnaRehberSoyad"].includes(column)) return true;
  if (moduleKey === "analiz" && /(id$|ID$|oran|yuzde|percentage|count|adet|toplam|sayisi|sayısı)/.test(column)) return true;
  return false;
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
  const words = withoutId
    .replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map((word) => translateColumnWord(word))
    .join(" ")
    .trim();
  return words ? words.charAt(0).toLocaleUpperCase("tr-TR") + words.slice(1) : column;
}

function translateColumnWord(word: string) {
  const normalized = word.toLocaleLowerCase("tr-TR");
  const words: Record<string, string> = {
    create: "Oluşturma",
    created: "Oluşturma",
    update: "Güncelleme",
    updated: "Güncelleme",
    user: "Kullanıcı",
    date: "Tarihi",
    name: "Ad",
    title: "Başlık",
    phone: "Telefon",
    image: "Resim",
    location: "Konum",
    status: "Durum",
    description: "Açıklama",
    manager: "Müdür",
    hotel: "Otel",
    room: "Oda",
    group: "Grup",
    company: "Firma"
  };

  return words[normalized] || word;
}

function formatCell(value: unknown, column = "", row?: Record<string, unknown>, relationMaps?: RelationMaps) {
  if (value === null || value === undefined) return "";
  if (column === "fotograf" && typeof value === "string") return <ImagePreview src={value} />;
  if (isLocationColumn(column)) return <LocationLink value={value} row={row} />;
  if (typeof value === "boolean") return value ? "Evet" : "Hayır";
  if (typeof value === "number") {
    const enumValue = enumLabels[column]?.[value];
    if (enumValue) return enumValue;
    if (isIdColumn(column)) return resolveRelationName(column, value, row, relationMaps) ?? String(value);
  }
  if (typeof value === "string" && enumLabels[column]?.[Number(value)]) return enumLabels[column][Number(value)];
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

function ImagePreview({ src }: { src: string }) {
  const imageSrc = normalizeImageUrl(src);
  if (!imageSrc) return "";

  return (
    <Image
      src={imageSrc}
      alt="Fotoğraf"
      width={48}
      height={48}
      unoptimized
      className="h-12 w-12 rounded-md border border-black/10 object-cover"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function normalizeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const baseUrl = process.env.NEXT_PUBLIC_UMRE_API_BASE_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "") || "http://37.148.210.227:7253";
  return `${baseUrl}/${trimmed.replace(/^\/+/, "")}`;
}

function LocationLink({ value, row }: { value: unknown; row?: Record<string, unknown> }) {
  const href = getMapsUrl(value, row);
  if (!href) return "";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid h-8 w-8 place-items-center rounded-md border border-[#238071]/30 text-[#238071] hover:bg-[#eef8f5]"
      aria-label="Konumu aç"
      title="Konumu aç"
    >
      <FiMapPin aria-hidden="true" />
    </a>
  );
}

function getMapsUrl(value: unknown, row?: Record<string, unknown>) {
  const lat = getNumericField(row, ["latitude", "Latitude", "lat", "Lat", "enlem", "Enlem"]);
  const lng = getNumericField(row, ["longitude", "Longitude", "lng", "Lng", "lon", "Lon", "boylam", "Boylam"]);
  if (lat !== null && lng !== null) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const text = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
  if (!text || text === "-") return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
}

function getNumericField(row: Record<string, unknown> | undefined, keys: string[]) {
  if (!row) return null;
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }
  return null;
}

function getDateField(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === "string" && value.trim()) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date;
    }
  }
  return null;
}

function isLocationColumn(column: string) {
  const normalized = column.toLocaleLowerCase("tr-TR");
  return ["konum", "adres", "location", "map", "harita"].some((keyword) => normalized.includes(keyword));
}

function getRowId(row: Record<string, unknown>) {
  const value = row.id ?? row.Id ?? row.personelId ?? row.PersonelId ?? row.duyuruId ?? row.DuyuruId ?? row.konferansId ?? row.KonferansId;
  return typeof value === "number" ? value : Number(value || 0);
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
              {item.bagliEkranlar.length ? <span className="text-xs font-medium text-[#64717f]">Bağlı: {formatLinkedScreens(item.bagliEkranlar)}</span> : null}
            </span>
            {item.secili ? <FiCheckSquare className="h-5 w-5 text-[#238071]" aria-hidden="true" /> : <FiSquare className="h-5 w-5 text-[#9aa4ad]" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatLinkedScreens(items: string[]) {
  return items
    .map((item) => {
      const [side, key] = item.split(":");
      const sideLabel = side === "haci" ? "Hacı" : side === "rehber" ? "Rehber" : side;
      return `${sideLabel}: ${formatColumnTitle(key)}`;
    })
    .join(", ");
}

