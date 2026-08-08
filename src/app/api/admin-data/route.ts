import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, type AdminSessionUser } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

const allowedEndpoints = {
  personel: (user: AdminSessionUser) => [`/Admin/FirmaPersonelleri/${Number(user.firmaId || 0)}`],
  kafile: (user: AdminSessionUser) => [`/Kafile/AnaRehber/GetAllKafile/${Number(user.firmaId || 0)}`],
  otel: (user: AdminSessionUser) => [`/Otel/AnaRehber/GetAllOteller/${Number(user.firmaId || 0)}`],
  etkinlik: (user: AdminSessionUser) => [`/Admin/GrupEtkinlikOnaylari/${Number(user.grupId || 0)}`],
  analiz: (user: AdminSessionUser) => [
    `/Admin/Analiz/${Number(user.firmaId || 0)}`,
    `/Analiz/AnaRehber/${Number(user.firmaId || 0)}`,
    `/Dashboard/AnaRehber/${Number(user.firmaId || 0)}`
  ],
  duyuru: (user: AdminSessionUser) => [
    `/Duyuru/AnaRehber/GetAllDuyurular/${Number(user.firmaId || 0)}`,
    `/Duyuru/GetAllDuyurular/${Number(user.firmaId || 0)}`,
    `/Admin/Duyurular/${Number(user.firmaId || 0)}`,
    `/Duyurular/${Number(user.firmaId || 0)}`
  ],
  sos: (user: AdminSessionUser) => [
    `/SOS/AnaRehber/GetAllSOS/${Number(user.grupId || user.firmaId || 0)}`,
    `/Sos/AnaRehber/GetAllSos/${Number(user.grupId || user.firmaId || 0)}`,
    `/Admin/SOS/${Number(user.grupId || user.firmaId || 0)}`,
    `/Yardim/AnaRehber/GetAllYardim/${Number(user.grupId || user.firmaId || 0)}`
  ],
  konferans: (user: AdminSessionUser) => [
    `/Konferans/AnaRehber/GetAllKonferans/${Number(user.grupId || user.firmaId || 0)}`,
    `/Konferans/GetAllKonferans/${Number(user.grupId || user.firmaId || 0)}`,
    `/Admin/Konferans/${Number(user.grupId || user.firmaId || 0)}`,
    `/Telekonferans/AnaRehber/GetAllTelekonferans/${Number(user.grupId || user.firmaId || 0)}`
  ],
  ekranDuzenleyici: (user: AdminSessionUser) => [
    `/MenuDegisiklik/Admin/EkranDuzenleyici/${Number(user.firmaId || 0)}`,
    "/MenuDegisiklik/Admin/EkranDuzenleyici",
    `/MenuDegisiklik/EkranDuzenleyici/${Number(user.firmaId || 0)}`
  ]
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

    const endpoints = allowedEndpoints[body.moduleKey](user);
    let response: Response | null = null;

    for (const endpoint of endpoints) {
      response = await fetch(`${backendBaseUrl}${endpoint}`, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      if (response.ok || response.status !== 404) break;
    }

    if (!response) {
      return NextResponse.json({ message: "Modül için endpoint bulunamadı." }, { status: 404 });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ message: "Veriler alınamadı. Lütfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}
