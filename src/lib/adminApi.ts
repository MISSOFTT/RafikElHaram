export const adminApiBaseUrl =
  process.env.NEXT_PUBLIC_UMRE_API_BASE_URL?.replace(/\/$/, "") || "http://37.148.210.227:7253/api";

export type AdminUser = {
  id: number;
  ad: string;
  soyad: string;
  telefon: string;
  kullaniciTipi: number;
  grupId: number;
  firmaId: number;
  firmaGirisiVar?: boolean;
  gorulecekSayfalar?: string[];
  gizlenecekSayfalar?: string[];
};

export type AdminModule = {
  key: string;
  title: string;
  description: string;
  emptyState: string;
  endpoint?: (user: AdminUser) => string;
};

export const adminModules: AdminModule[] = [
  {
    key: "personel",
    title: "Personel",
    description: "Ana rehber ve rehber listelerini yonet.",
    emptyState: "Firma personellerini getirmek icin Yenile dugmesini kullan.",
    endpoint: (user) => `/Admin/FirmaPersonelleri/${user.firmaId}`
  },
  {
    key: "kafile",
    title: "Kafileler",
    description: "Firma kafileleri, grup bilgileri ve haci listeleri.",
    emptyState: "Kafile kayitlarini goruntulemek icin Yenile dugmesini kullan.",
    endpoint: (user) => `/Kafile/AnaRehber/GetAllKafile/${user.firmaId}`
  },
  {
    key: "otel",
    title: "Oteller",
    description: "Firma otelleri ve grup otel bilgileri.",
    emptyState: "Firma otellerini goruntulemek icin Yenile dugmesini kullan.",
    endpoint: (user) => `/Otel/AnaRehber/GetAllOteller/${user.firmaId}`
  },
  {
    key: "etkinlik",
    title: "Etkinlik Onaylari",
    description: "Grup etkinlik onaylarini takip et.",
    emptyState: "Grup etkinlik onaylarini goruntulemek icin Yenile dugmesini kullan.",
    endpoint: (user) => `/Admin/GrupEtkinlikOnaylari/${user.grupId}`
  },
  {
    key: "analiz",
    title: "Analiz",
    description: "Genel ozet, sayaclar ve zaman serileri.",
    emptyState: "Analiz modulu icin tarih filtreleri ve grafikler bir sonraki adimda baglanacak."
  },
  {
    key: "duyuru",
    title: "Duyurular",
    description: "Ana rehber duyurulari ve goruntuleme bilgileri.",
    emptyState: "Duyuru ekleme, silme ve goruntuleyenler formlari API kayitlariyla baglanacak."
  },
  {
    key: "sos",
    title: "SOS",
    description: "Aktif ve gecmis yardim kayitlari.",
    emptyState: "SOS harita ve gecmis kayit akisi backend grup secimiyle baglanacak."
  },
  {
    key: "konferans",
    title: "Konferans",
    description: "Canli konferans kayitlari ve katilimcilar.",
    emptyState: "Konferans listesi ve katilimci detaylari grup secimiyle baglanacak."
  },
  {
    key: "ekranDuzenleyici",
    title: "Ekran Duzenleyici",
    description: "Haci ve rehber tarafinda gorunecek ekranlari sec.",
    emptyState: "Checkbox listesini acmak icin Yenile dugmesini kullan.",
    endpoint: () => "/MenuDegisiklik/Admin/EkranDuzenleyici"
  }
];

export const defaultScreenEditor = {
  haci: [
    { key: "dua", baslik: "Dua", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "fetva", baslik: "Fetva", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "doviz", baslik: "Doviz", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "kible", baslik: "Kible", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "turSayaci", baslik: "Tur Sayaci", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "ibadetVideolari", baslik: "Ibadet Videolari", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "namazVakitleri", baslik: "Namaz Vakitleri", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "bulusmaNoktasi", baslik: "Bulusma Noktasi", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:bulusmaNoktasi"] },
    { key: "servis", baslik: "Servis", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:servis"] },
    { key: "otel", baslik: "Otel", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:otel"] },
    { key: "umreProgrami", baslik: "Umre Programi", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:umreProgrami"] },
    { key: "ucusBilgi", baslik: "Ucus Bilgi", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:ucusBilgi"] },
    { key: "etkinlik", baslik: "Etkinlik", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:etkinlik"] },
    { key: "duyuru", baslik: "Duyuru", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:duyuru"] },
    { key: "konferans", baslik: "Konferans", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:konferans"] },
    { key: "anket", baslik: "Anket", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:anket"] },
    { key: "sos", baslik: "SOS", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:sos"] }
  ],
  rehber: [
    { key: "bulusmaNoktasi", baslik: "Bulusma Noktasi", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:bulusmaNoktasi"] },
    { key: "servis", baslik: "Servis", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:servis"] },
    { key: "otel", baslik: "Otel", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:otel"] },
    { key: "umreProgrami", baslik: "Umre Programi", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:umreProgrami"] },
    { key: "ucusBilgi", baslik: "Ucus Bilgi", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:ucusBilgi"] },
    { key: "etkinlik", baslik: "Etkinlik", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:etkinlik"] },
    { key: "duyuru", baslik: "Duyuru", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:duyuru"] },
    { key: "konferans", baslik: "Konferans", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:konferans"] },
    { key: "anket", baslik: "Anket", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:anket"] },
    { key: "sos", baslik: "SOS", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:sos"] }
  ]
} as const;

export async function apiGet(path: string) {
  const moduleKey = path.split("/").filter(Boolean)[0] || path;
  const response = await fetch("/api/admin-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ moduleKey }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
