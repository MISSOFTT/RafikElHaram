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
  firmaAdi?: string;
  grupAdi?: string;
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
  canCreate?: boolean;
};

export const adminModules: AdminModule[] = [
  {
    key: "personel",
    title: "Personel",
    description: "Ana rehber ve rehber listelerini yönet.",
    emptyState: "Firma personellerini getirmek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Admin/FirmaPersonelleri/${user.firmaId}`,
    canCreate: true
  },
  {
    key: "kafile",
    title: "Kafileler",
    description: "Firma kafileleri, grup bilgileri ve hacı listeleri.",
    emptyState: "Kafile kayıtlarını görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Kafile/AnaRehber/GetAllKafile/${user.firmaId}`,
    canCreate: true
  },
  {
    key: "otel",
    title: "Oteller",
    description: "Firma otelleri ve grup otel bilgileri.",
    emptyState: "Firma otellerini görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Otel/AnaRehber/GetAllOteller/${user.firmaId}`,
    canCreate: true
  },
  {
    key: "etkinlik",
    title: "Etkinlik Onayları",
    description: "Grup etkinlik onaylarını takip et.",
    emptyState: "Grup etkinlik onaylarını görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Admin/GrupEtkinlikOnaylari/${user.grupId}`,
    canCreate: true
  },
  {
    key: "analiz",
    title: "Analiz",
    description: "Genel özet, sayaçlar ve zaman serileri.",
    emptyState: "Analiz verilerini görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Admin/Analiz/${user.firmaId}`
  },
  {
    key: "duyuru",
    title: "Duyurular",
    description: "Ana rehber duyuruları ve görüntüleme bilgileri.",
    emptyState: "Duyuruları görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Duyuru/AnaRehber/GetAllDuyurular/${user.firmaId}`,
    canCreate: true
  },
  {
    key: "sos",
    title: "SOS",
    description: "Aktif ve geçmiş yardım kayıtları.",
    emptyState: "SOS kayıtlarını görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/SOS/AnaRehber/GetAllSOS/${user.grupId || user.firmaId}`,
    canCreate: true
  },
  {
    key: "konferans",
    title: "Konferans",
    description: "Canlı konferans kayıtları ve katılımcılar.",
    emptyState: "Konferans kayıtlarını görüntülemek için Yenile düğmesini kullan.",
    endpoint: (user) => `/Konferans/AnaRehber/GetAllKonferans/${user.grupId || user.firmaId}`,
    canCreate: true
  },
  {
    key: "ekranDuzenleyici",
    title: "Ekran Düzenleyici",
    description: "Hacı ve rehber tarafında görünecek ekranları seç.",
    emptyState: "Checkbox listesini açmak için Yenile düğmesini kullan.",
    endpoint: () => "/MenuDegisiklik/Admin/EkranDuzenleyici"
  }
];

export const defaultScreenEditor = {
  haci: [
    { key: "dua", baslik: "Dua", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "fetva", baslik: "Fetva", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "doviz", baslik: "Döviz", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "kible", baslik: "Kıble", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "turSayaci", baslik: "Tur Sayacı", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "ibadetVideolari", baslik: "İbadet Videoları", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "namazVakitleri", baslik: "Namaz Vakitleri", kullaniciTarafi: "haci", secili: true, bagliEkranlar: [] },
    { key: "bulusmaNoktasi", baslik: "Buluşma Noktası", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:bulusmaNoktasi"] },
    { key: "servis", baslik: "Servis", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:servis"] },
    { key: "otel", baslik: "Otel", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:otel"] },
    { key: "umreProgrami", baslik: "Umre Programı", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:umreProgrami"] },
    { key: "ucusBilgi", baslik: "Uçuş Bilgi", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:ucusBilgi"] },
    { key: "etkinlik", baslik: "Etkinlik", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:etkinlik"] },
    { key: "duyuru", baslik: "Duyuru", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:duyuru"] },
    { key: "konferans", baslik: "Konferans", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:konferans"] },
    { key: "anket", baslik: "Anket", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:anket"] },
    { key: "sos", baslik: "SOS", kullaniciTarafi: "haci", secili: true, bagliEkranlar: ["rehber:sos"] }
  ],
  rehber: [
    { key: "bulusmaNoktasi", baslik: "Buluşma Noktası", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:bulusmaNoktasi"] },
    { key: "servis", baslik: "Servis", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:servis"] },
    { key: "otel", baslik: "Otel", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:otel"] },
    { key: "umreProgrami", baslik: "Umre Programı", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:umreProgrami"] },
    { key: "ucusBilgi", baslik: "Uçuş Bilgi", kullaniciTarafi: "rehber", secili: true, bagliEkranlar: ["haci:ucusBilgi"] },
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
