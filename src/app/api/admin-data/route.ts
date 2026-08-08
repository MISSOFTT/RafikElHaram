import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, type AdminSessionUser } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

const allowedEndpoints = {
  personel: (user: AdminSessionUser) => `/Admin/FirmaPersonelleri/${Number(user.firmaId || 0)}`,
  kafile: (user: AdminSessionUser) => `/Kafile/AnaRehber/GetAllKafile/${Number(user.firmaId || 0)}`,
  otel: (user: AdminSessionUser) => `/Otel/AnaRehber/GetAllOteller/${Number(user.firmaId || 0)}`,
  anket: () => "/Anket/TumAnketler",
  analiz: (user: AdminSessionUser) => {
    const params = new URLSearchParams({
      kullaniciId: String(Number(user.id || 0)),
      kullaniciTip: String(Number(user.kullaniciTipi || 3)),
      grupId: String(Number(user.grupId || 0))
    });
    return `/Analiz/GenelOzet?${params.toString()}`;
  },
  duyuru: (user: AdminSessionUser) => `/Duyuru/AnaRehber/Liste/${Number(user.id || 0)}`,
  sos: (user: AdminSessionUser) => `/Sos/Admin/GrupGecmisSos/${Number(user.grupId || 0)}`,
  konferans: (user: AdminSessionUser) => `/Konferans/Admin/GrupKonferanslar/${Number(user.grupId || 0)}`,
  ekranDuzenleyici: (user: AdminSessionUser) => `/MenuDegisiklik/Admin/EkranDuzenleyici?firmaId=${Number(user.firmaId || 0)}`
} as const;

type ModuleKey = keyof typeof allowedEndpoints;

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminSession(request.cookies.get("rafik_admin_session")?.value);
    if (!user) {
      return NextResponse.json({ message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." }, { status: 401 });
    }

    const body = (await request.json()) as { moduleKey?: ModuleKey };
    if (!body.moduleKey || !(body.moduleKey in allowedEndpoints)) {
      return NextResponse.json({ message: "Geçersiz modül isteği." }, { status: 400 });
    }

    const response = await fetch(`${backendBaseUrl}${allowedEndpoints[body.moduleKey](user)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    const text = await response.text();
    if (body.moduleKey === "kafile" && response.ok) {
      const enriched = await enrichKafileWithHotelNames(text, user);
      if (enriched) return NextResponse.json(enriched);
    }

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ message: "Veriler alınamadı. Lütfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}

async function enrichKafileWithHotelNames(text: string, user: AdminSessionUser) {
  try {
    const data = JSON.parse(text);
    const rows = getRows(data);
    if (!rows.length) return data;

    const hotelResponse = await fetch(`${backendBaseUrl}${allowedEndpoints.otel(user)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    if (!hotelResponse.ok) return data;

    const hotelData = await hotelResponse.json();
    const hotelRows = getRows(hotelData);
    const hotelNames = new Map<number, string>();

    for (const hotel of hotelRows) {
      const id = getNumber(hotel.id ?? hotel.Id ?? hotel.otelId ?? hotel.OtelId);
      const name = getString(hotel.ad ?? hotel.Ad ?? hotel.adi ?? hotel.Adi ?? hotel.otelAdi ?? hotel.OtelAdi);
      if (id !== null && name) hotelNames.set(id, name);
    }

    for (const row of rows) {
      const hotelId = getNumber(row.otelId ?? row.OtelId ?? row.otelID ?? row.OtelID);
      if (hotelId !== null && hotelNames.has(hotelId)) {
        row.otelAdi = hotelNames.get(hotelId);
        row.OtelAdi = hotelNames.get(hotelId);
      }
    }

    return data;
  } catch {
    return null;
  }
}

function getRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.filter(isRecord);
  if (!isRecord(data)) return [];

  for (const value of Object.values(data)) {
    if (Array.isArray(value)) return value.filter(isRecord);
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}
