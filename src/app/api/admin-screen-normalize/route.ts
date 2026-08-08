import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

type ScreenSelection = {
  key: string;
  secili: boolean;
};

type ScreenNormalizeRequest = {
  firmaId?: number;
  haci?: ScreenSelection[];
  rehber?: ScreenSelection[];
};

const linkedScreens: Record<string, string[]> = {
  "haci:bulusmaNoktasi": ["rehber:bulusmaNoktasi"],
  "haci:servis": ["rehber:servis"],
  "haci:otel": ["rehber:otel"],
  "haci:umreProgrami": ["rehber:umreProgrami"],
  "haci:ucusBilgi": ["rehber:ucusBilgi"],
  "haci:etkinlik": ["rehber:etkinlik"],
  "haci:duyuru": ["rehber:duyuru"],
  "haci:konferans": ["rehber:konferans"],
  "haci:anket": ["rehber:anket"],
  "haci:sos": ["rehber:sos"],
  "rehber:bulusmaNoktasi": ["haci:bulusmaNoktasi"],
  "rehber:servis": ["haci:servis"],
  "rehber:otel": ["haci:otel"],
  "rehber:umreProgrami": ["haci:umreProgrami"],
  "rehber:ucusBilgi": ["haci:ucusBilgi"],
  "rehber:etkinlik": ["haci:etkinlik"],
  "rehber:duyuru": ["haci:duyuru"],
  "rehber:konferans": ["haci:konferans"],
  "rehber:anket": ["haci:anket"],
  "rehber:sos": ["haci:sos"]
};

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminSession(request.cookies.get("rafik_admin_session")?.value);
    if (!user) {
      return NextResponse.json({ message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." }, { status: 401 });
    }

    const body = (await request.json()) as ScreenNormalizeRequest;
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
      body: JSON.stringify({ ...body, firmaId: Number(user.firmaId || body.firmaId || 0) }),
      cache: "no-store"
    });

    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json(normalizeLocally(body), {
        headers: { "x-admin-screen-normalize-fallback": "true" }
      });
    }

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ haci: [], rehber: [] }, { headers: { "x-admin-screen-normalize-fallback": "true" } });
  }
}

function normalizeLocally(body: ScreenNormalizeRequest) {
  const haci = (body.haci || []).map((item) => ({ ...item }));
  const rehber = (body.rehber || []).map((item) => ({ ...item }));
  const lists = { haci, rehber };

  let changed = true;
  while (changed) {
    changed = false;
    for (const [side, items] of Object.entries(lists)) {
      for (const item of items) {
        if (item.secili) continue;

        for (const targetRef of linkedScreens[`${side}:${item.key}`] || []) {
          const [targetSide, targetKey] = targetRef.split(":") as ["haci" | "rehber", string];
          const target = lists[targetSide].find((candidate) => candidate.key === targetKey);
          if (target?.secili) {
            target.secili = false;
            changed = true;
          }
        }
      }
    }
  }

  return { haci, rehber };
}
