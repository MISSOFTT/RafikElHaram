import { NextRequest, NextResponse } from "next/server";
import { signAdminSession } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    if (payload.loginMode === "eposta" || payload.email) {
      return loginWithAccountEmail(payload);
    }

    const loginPayload = {
      Telefon: String(payload.Telefon || payload.telefon || payload.email || payload.eposta || "").trim(),
      Sifre: String(payload.Sifre || payload.sifre || "")
    };

    if (!loginPayload.Telefon || !loginPayload.Sifre) {
      return NextResponse.json({ message: "Telefon/e-posta ve şifre alanları zorunludur." }, { status: 400 });
    }

    const response = await fetch(`${backendBaseUrl}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(loginPayload),
      cache: "no-store"
    });

    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json({ message: normalizeLoginError(text, response.status) }, { status: response.status === 400 ? 401 : response.status });
    }

    const nextResponse = new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });

    const user = JSON.parse(text) as { id?: number; firmaId?: number; grupId?: number };
    nextResponse.cookies.set("rafik_admin_session", signAdminSession(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 8
    });

    return nextResponse;
  } catch {
    return NextResponse.json({ message: "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}

async function loginWithAccountEmail(payload: Record<string, unknown>) {
  const email = String(payload.email || payload.eposta || "").trim().toLowerCase();
  const password = String(payload.password || payload.Sifre || payload.sifre || "");

  if (!email || !password) {
    return NextResponse.json({ message: "E-posta ve şifre alanları zorunludur." }, { status: 400 });
  }

  const response = await fetch(`${backendBaseUrl}/Account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  const text = await response.text();
  if (!response.ok) {
    return NextResponse.json({ message: normalizeAccountLoginError(text, response.status) }, { status: response.status });
  }

  const session = JSON.parse(text) as AccountSessionResponse;
  const profile = session.profile ?? session;
  const adminUser = {
    id: Number(profile.legacyUserId || profile.legacyPersonelId || profile.userId || profile.id || 0),
    ad: String(profile.firstName || profile.ad || "Admin"),
    soyad: String(profile.lastName || profile.soyad || ""),
    telefon: String(profile.phone || profile.telefon || email),
    kullaniciTipi: Number(profile.roleCode ?? profile.kullaniciTipi ?? 99),
    grupId: Number(profile.groupId ?? profile.grupId ?? 0),
    firmaId: Number(profile.organizationId ?? profile.firmaId ?? 0),
    firmaAdi: String(profile.organizationName ?? profile.firmaAdi ?? profile.firmaAd ?? ""),
    grupAdi: String(profile.groupName ?? profile.grupAdi ?? profile.grupAd ?? ""),
    firmaGirisiVar: Number(profile.organizationId ?? profile.firmaId ?? 0) > 0,
    gorulecekSayfalar: [],
    gizlenecekSayfalar: [],
    accessToken: session.accessToken || session.token || "",
    refreshToken: session.refreshToken || ""
  };

  if (!adminUser.firmaId || adminUser.firmaId <= 0) {
    return NextResponse.json({ message: "Bu e-posta hesabı henüz bir firmaya bağlı değil." }, { status: 403 });
  }

  const nextResponse = NextResponse.json(adminUser);
  nextResponse.cookies.set("rafik_admin_session", signAdminSession(adminUser), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return nextResponse;
}

function normalizeLoginError(text: string, status: number) {
  if (text.includes("Kullanıcı bulunamadı")) {
    return "Kullanıcı bulunamadı. Telefon/e-posta ve şifrenizi kontrol edin.";
  }

  try {
    const data = JSON.parse(text) as { title?: string; errors?: Record<string, string[]> };
    if (data.errors) {
      return "Giriş isteği doğrulanamadı. Lütfen telefon/e-posta ve şifre alanlarını kontrol edin.";
    }
    if (data.title) return data.title;
  } catch {
    // Plain text backend response.
  }

  if (status === 400) {
    return "Giriş bilgileri kabul edilmedi. Lütfen bilgilerinizi kontrol edin.";
  }

  return "Giriş yapılamadı. Lütfen daha sonra tekrar deneyin.";
}

function normalizeAccountLoginError(text: string, status: number) {
  try {
    const data = JSON.parse(text) as { message?: string; title?: string; status?: string };
    if (data.status === "verification_required") return "E-posta doğrulaması gerekiyor.";
    if (data.status === "account_disabled") return "Bu hesap devre dışı bırakılmış.";
    if (data.message) return data.message;
    if (data.title) return data.title;
  } catch {
    // Plain text backend response.
  }

  if (status === 401 || status === 400) {
    return "E-posta veya şifre hatalı.";
  }
  if (status >= 500) return "Hesap servisi şu anda yanıt vermiyor.";
  return "E-posta ile giriş yapılamadı.";
}

type AccountSessionResponse = {
  profile?: Record<string, unknown>;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  [key: string]: unknown;
};
