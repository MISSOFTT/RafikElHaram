import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, type AdminSessionUser } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

const createEndpoints = {
  personel: "/Personel/AnaRehber/PersonelKaydet",
  kafile: "/Kafile/AnaRehber/Grup/Kaydet",
  otel: "/Otel/AnaRehber/InsertUpdateOtel",
  duyuru: "/Duyuru/AnaRehber/Ekle",
  konferans: "/Konferans/Baslat"
} as const;

type CreateModuleKey = keyof typeof createEndpoints;

export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminSession(request.cookies.get("rafik_admin_session")?.value);
    if (!user?.id) {
      return NextResponse.json({ message: "Oturum bulunamadı. Lütfen tekrar giriş yapın." }, { status: 401 });
    }

    const requestForm = await request.formData();
    const moduleKey = String(requestForm.get("moduleKey") || "") as CreateModuleKey;
    if (!moduleKey || !(moduleKey in createEndpoints)) {
      return NextResponse.json({ message: "Geçersiz ekleme isteği." }, { status: 400 });
    }

    const response =
      moduleKey === "duyuru" || moduleKey === "konferans"
        ? await postJson(moduleKey, user, requestForm)
        : await postForm(moduleKey, user, requestForm);

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });
  } catch {
    return NextResponse.json({ message: "Kayıt gönderilemedi. Lütfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}

function authHeaders(user: AdminSessionUser): HeadersInit {
  const token = user.accessToken || user.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function postJson(moduleKey: "duyuru" | "konferans", user: AdminSessionUser, requestForm: FormData) {
  const body =
    moduleKey === "duyuru"
      ? {
          AnaRehberId: Number(user.id || 0),
          Metin: getRequiredString(requestForm, "Metin")
        }
      : {
          Baslik: getRequiredString(requestForm, "Baslik"),
          PersonelId: Number(user.id || 0)
        };

  return fetch(`${backendBaseUrl}${createEndpoints[moduleKey]}`, {
    method: "POST",
    headers: {
      ...authHeaders(user),
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

async function postForm(moduleKey: "personel" | "kafile" | "otel", user: AdminSessionUser, requestForm: FormData) {
  const backendForm = new FormData();

  if (moduleKey === "personel") {
    appendValue(backendForm, "Id", "-1");
    appendValue(backendForm, "PersonelId", user.id);
    appendFields(backendForm, requestForm, ["Ad", "Soyad", "Tur", "Telefon", "Sifre", "Latitude", "Longitude", "Oda", "Kat", "ResimDosya", "ProfilPhoto"]);
  }

  if (moduleKey === "kafile") {
    appendValue(backendForm, "Id", "-1");
    appendValue(backendForm, "CreateUserId", user.id);
    appendValue(backendForm, "AnaRehberId", user.id);
    appendFields(backendForm, requestForm, [
      "PersonelId",
      "OtelId",
      "YemekSaati1",
      "YemekSaati2",
      "YemekSaati3",
      "Bilgi",
      "Nereden",
      "Nereye",
      "TurBaslangicTarihi",
      "TurBitisTarihi"
    ]);
  }

  if (moduleKey === "otel") {
    appendValue(backendForm, "Id", "-1");
    appendValue(backendForm, "PersonelId", user.id);
    appendFields(backendForm, requestForm, ["Ad", "MudurAd", "Telefon", "Konum", "ResepsiyonTel", "ResimDosya"]);
  }

  return fetch(`${backendBaseUrl}${createEndpoints[moduleKey]}`, {
    method: "POST",
    headers: {
      ...authHeaders(user),
      Accept: "application/json"
    },
    body: backendForm
  });
}

function appendFields(target: FormData, source: FormData, names: string[]) {
  for (const name of names) {
    const value = source.get(name);
    if (value instanceof File) {
      if (value.size > 0) target.append(name, value);
      continue;
    }
    if (value !== null && String(value).trim() !== "") target.append(name, value);
  }
}

function appendValue(target: FormData, name: string, value: unknown) {
  if (value !== undefined && value !== null && String(value).trim() !== "") {
    target.append(name, String(value));
  }
}

function getRequiredString(form: FormData, name: string) {
  const value = String(form.get(name) || "").trim();
  if (!value) throw new Error(`${name} alanı zorunludur.`);
  return value;
}
