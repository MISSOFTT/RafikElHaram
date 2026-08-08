import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminSession(request.cookies.get("rafik_admin_session")?.value);
    if (!user) {
      return NextResponse.json({ message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const token = user.accessToken || user.token;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${backendBaseUrl}/MenuDegisiklik/Admin/EkranDuzenleyici/Normalize`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, firmaId: Number(user.firmaId || 0) }),
      cache: "no-store"
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ message: "Ekran düzenleyici kaydı yapılamadı." }, { status: 502 });
  }
}
