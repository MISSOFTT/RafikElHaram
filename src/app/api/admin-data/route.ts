import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, type AdminSessionUser } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

const allowedEndpoints = {
  personel: (user: AdminSessionUser) => `/Admin/FirmaPersonelleri/${Number(user.firmaId || 0)}`,
  kafile: (user: AdminSessionUser) => `/Kafile/AnaRehber/GetAllKafile/${Number(user.firmaId || 0)}`,
  otel: (user: AdminSessionUser) => `/Otel/AnaRehber/GetAllOteller/${Number(user.firmaId || 0)}`,
  etkinlik: (user: AdminSessionUser) => `/Admin/GrupEtkinlikOnaylari/${Number(user.grupId || 0)}`,
  ekranDuzenleyici: () => "/MenuDegisiklik/Admin/EkranDuzenleyici"
} as const;

type ModuleKey = keyof typeof allowedEndpoints;

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminSession(request.cookies.get("rafik_admin_session")?.value);
    if (!user) {
      return NextResponse.json({ message: "Oturum bulunamadi. Lutfen tekrar giris yapin." }, { status: 401 });
    }

    const body = (await request.json()) as { moduleKey?: ModuleKey };
    if (!body.moduleKey || !(body.moduleKey in allowedEndpoints)) {
      return NextResponse.json({ message: "Gecersiz modul istegi." }, { status: 400 });
    }

    const response = await fetch(`${backendBaseUrl}${allowedEndpoints[body.moduleKey](user)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ message: "Veriler alinamadi. Lutfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}
