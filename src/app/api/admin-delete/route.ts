import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, type AdminSessionUser } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

type DeleteTarget = {
  method: string;
  path: string;
  body?: Record<string, unknown>;
};

const deleteEndpoints = {
  personel: (id: number): DeleteTarget => ({ method: "DELETE", path: `/Personel/AnaRehber/PersonelSil/${id}` }),
  kafile: (id: number): DeleteTarget => ({ method: "DELETE", path: `/Kafile/AnaRehber/KafileSil/${id}` }),
  duyuru: (id: number, user: AdminSessionUser) => ({
    method: "POST",
    path: "/Duyuru/AnaRehber/Sil",
    body: { DuyuruId: id, AnaRehberId: Number(user.id || 0) }
  }) satisfies DeleteTarget
} as const;

type DeleteModuleKey = keyof typeof deleteEndpoints;

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminSession(request.cookies.get("rafik_admin_session")?.value);
    if (!user?.id) {
      return NextResponse.json({ message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." }, { status: 401 });
    }

    const body = (await request.json()) as { moduleKey?: string; id?: number };
    const moduleKey = body.moduleKey as DeleteModuleKey;
    const id = Number(body.id || 0);

    if (!id || !moduleKey || !(moduleKey in deleteEndpoints)) {
      return NextResponse.json({ message: "Bu tablo için silme endpointi bulunamadı." }, { status: 400 });
    }

    const target = deleteEndpoints[moduleKey](id, user);
    const token = user.accessToken || user.token;
    const headers: HeadersInit = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (target.body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${backendBaseUrl}${target.path}`, {
      method: target.method,
      headers,
      body: target.body ? JSON.stringify(target.body) : undefined
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ message: "Kayıt silinemedi. Lütfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}
