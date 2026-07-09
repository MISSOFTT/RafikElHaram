"use client";

import Link from "next/link";
import { FiArrowRight, FiBell, FiCalendar, FiCheckCircle, FiMapPin, FiMic, FiShield, FiUsers, FiVideo } from "react-icons/fi";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

const copy = {
  tr: {
    eyebrow: "Paketler",
    title: "Kafile büyüklüğünüze göre sade paketler ve net fiyatlandırma.",
    description:
      "Rafik Al Haram; hacı adayının yolculuk boyunca ihtiyaç duyduğu rehberlik ekranlarını, rehber ekibinin saha yönetimini ve kurumun operasyon kontrolünü anlaşılır iki paketle sunar.",
    unit: "katılan hacı başına",
    cta: "İletişim Kurun",
    note: "Fiyatlar organizasyonunuzdaki aktif katılımcı sayısına göre hesaplanır.",
    plans: [
      {
        name: "Standart",
        price: "$3",
        summary: "Dijital rehberlik, lojistik takip ve saha koordinasyonu için temel operasyon paketi.",
        badge: "Temel özellikler",
        highlighted: false,
        features: [
          "Hacı, rehber ve ana rehber için rol bazlı kullanım",
          "Otel, oda, grup, servis ve günlük program yönetimi",
          "Fetva, dua ve ibadet rehberi içerikleri",
          "Akıllı buluşma noktaları, harita ve AR yönlendirme",
          "SOS, kritik bildirimler ve saha duyuruları"
        ]
      },
      {
        name: "Profesyonel",
        price: "$5",
        summary: "Standart pakete ek olarak dil ve canlı iletişim ihtiyacı olan kafileler için genişletilmiş paket.",
        badge: "Çeviri + telekonferans",
        highlighted: true,
        features: [
          "Standart paketteki tüm özellikler",
          "Bas-konuş Türkçe-Arapça çeviri desteği",
          "Rehber, ana rehber ve kafile için telekonferans özelliği",
          "Sahada dil bariyerini azaltan hızlı iletişim akışı",
          "Yoğun programlarda merkezi anons ve yönlendirme desteği"
        ]
      }
    ],
    valueTitle: "Hangi paket ne zaman doğru?",
    valueItems: [
      ["Standart", "Kafile operasyonunun temel ihtiyacı; rehberlik, konum, servis, dini içerik ve bildirimleri tek merkezde toplamaksa uygundur."],
      ["Profesyonel", "Farklı dil temasının yüksek olduğu, rehberlerin canlı koordinasyon ve toplu iletişim ihtiyacı duyduğu organizasyonlar için daha güçlüdür."]
    ]
  },
  en: {
    eyebrow: "Packages",
    title: "Simple packages and clear pricing for your group size.",
    description:
      "Rafik Al Haram packages pilgrim guidance, field management for guides, and organizational control into two easy-to-compare plans.",
    unit: "per participating pilgrim",
    cta: "Contact Us",
    note: "Pricing is calculated by the number of active participants in your organization.",
    plans: [
      {
        name: "Standard",
        price: "$3",
        summary: "Core operations for digital guidance, logistics tracking, and field coordination.",
        badge: "Core features",
        highlighted: false,
        features: [
          "Role-based access for pilgrims, guides, and lead guides",
          "Hotel, room, group, transport, and daily schedule management",
          "Fatwa, prayer, and worship guide content",
          "Smart meeting points, maps, and AR guidance",
          "SOS, critical alerts, and field announcements"
        ]
      },
      {
        name: "Professional",
        price: "$5",
        summary: "An expanded plan for groups that need language support and live coordination.",
        badge: "Translation + teleconference",
        highlighted: true,
        features: [
          "Everything in the Standard plan",
          "Push-to-talk Turkish-Arabic translation",
          "Teleconference for guides, lead guides, and groups",
          "Faster field communication with fewer language barriers",
          "Central announcements and direction support in busy schedules"
        ]
      }
    ],
    valueTitle: "Which package fits best?",
    valueItems: [
      ["Standard", "Best when the priority is bringing guidance, location, transport, religious content, and alerts into one system."],
      ["Professional", "Best for organizations with frequent language contact and a stronger need for live group coordination."]
    ]
  },
  ar: {
    eyebrow: "الباقات",
    title: "باقات بسيطة وتسعير واضح حسب حجم مجموعتك.",
    description:
      "يجمع رفيق الحرم إرشاد الحاج وإدارة الميدان وتحكم المؤسسة في خطتين واضحتين وسهلتي المقارنة.",
    unit: "لكل حاج مشارك",
    cta: "تواصل معنا",
    note: "تحسب الأسعار حسب عدد المشاركين النشطين في تنظيمك.",
    plans: [
      {
        name: "الأساسية",
        price: "$3",
        summary: "حزمة تشغيل أساسية للإرشاد الرقمي وتتبع الخدمات وتنسيق الميدان.",
        badge: "المزايا الأساسية",
        highlighted: false,
        features: [
          "استخدام حسب الدور للحاج والمرشد والمرشد الرئيسي",
          "إدارة الفندق والغرفة والمجموعة والنقل والبرنامج اليومي",
          "محتوى الفتاوى والأدعية ودليل العبادة",
          "نقاط لقاء ذكية وخرائط وتوجيه بالواقع المعزز",
          "مساعدة طارئة وتنبيهات مهمة وإعلانات ميدانية"
        ]
      },
      {
        name: "الاحترافية",
        price: "$5",
        summary: "حزمة موسعة للمجموعات التي تحتاج إلى دعم اللغة والتنسيق المباشر.",
        badge: "ترجمة + مؤتمر صوتي",
        highlighted: true,
        features: [
          "كل مزايا الخطة الأساسية",
          "ترجمة تركية-عربية بالضغط والتحدث",
          "مؤتمر صوتي للمرشدين والمرشد الرئيسي والمجموعة",
          "تواصل ميداني أسرع مع تقليل حاجز اللغة",
          "دعم للإعلانات المركزية والتوجيه في البرامج المزدحمة"
        ]
      }
    ],
    valueTitle: "أي باقة تناسبك؟",
    valueItems: [
      ["الأساسية", "مناسبة عندما تكون الأولوية جمع الإرشاد والموقع والنقل والمحتوى الديني والتنبيهات في نظام واحد."],
      ["الاحترافية", "أنسب للتنظيمات التي تحتاج إلى تواصل لغوي متكرر وتنسيق مباشر أقوى للمجموعة."]
    ]
  }
} as const;

const planIcons = [FiUsers, FiMic];
const valueIcons = [FiCalendar, FiVideo];
const featureIcons = [FiShield, FiMapPin, FiBell];

export function Plans() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section className="bg-[linear-gradient(180deg,#fff_0%,#fbfbf8_46%,#fff_100%)] pt-28">
      <div className="section-shell py-12 sm:py-16">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">{t.eyebrow}</p>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">{t.title}</h1>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-muted">{t.description}</p>
            </div>
            <div className="rounded-2xl border border-brand-orange/20 bg-white p-5 shadow-card lg:p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-teal/10 text-brand-teal">
                  <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm leading-7 text-muted">{t.note}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {t.plans.map((plan, index) => {
            const Icon = planIcons[index];
            return (
              <Reveal key={plan.name} delay={index * 0.05}>
                <article
                  className={`h-full rounded-2xl border p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-7 ${
                    plan.highlighted ? "border-brand-orange/45 bg-ink text-white" : "border-ink/10 bg-white text-ink"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-2xl ${
                          plan.highlighted ? "bg-white/12 text-brand-orange" : "bg-brand-orange/12 text-brand-orange"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${plan.highlighted ? "text-brand-orange" : "text-brand-teal"}`}>{plan.badge}</p>
                        <h2 className="mt-1 text-2xl font-semibold leading-tight">{plan.name}</h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-semibold leading-none sm:text-5xl">{plan.price}</p>
                      <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/68" : "text-muted"}`}>{t.unit}</p>
                    </div>
                  </div>

                  <p className={`mt-6 max-w-2xl text-sm leading-7 ${plan.highlighted ? "text-white/74" : "text-muted"}`}>{plan.summary}</p>

                  <ul className="mt-7 grid gap-3.5">
                    {plan.features.map((feature, featureIndex) => {
                      const FeatureIcon = featureIcons[featureIndex % featureIcons.length];
                      return (
                        <li key={feature} className={`flex max-w-2xl gap-3 text-sm leading-7 ${plan.highlighted ? "text-white/82" : "text-graphite"}`}>
                          <FeatureIcon className={`mt-1 h-4 w-4 shrink-0 ${plan.highlighted ? "text-brand-orange" : "text-brand-teal"}`} aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    href="/iletisim"
                    className={`focus-ring mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-brand-orange text-white hover:bg-[#c78328]"
                        : "border border-ink/10 bg-white text-ink hover:border-brand-orange/50 hover:text-brand-teal"
                    }`}
                  >
                    {t.cta}
                    <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-7">
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">{t.valueTitle}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {t.valueItems.map(([title, description], index) => {
              const Icon = valueIcons[index];
              return (
                <div key={title} className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-orange/12 text-brand-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
