"use client";

import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

type PageKey = "about" | "features" | "gallery" | "contact";

const pageCopy = {
  tr: {
    about: {
      eyebrow: "Hakkımızda",
      title: "Hac ve umre organizasyonlarında dijital güven duygusu oluşturuyoruz.",
      description:
        "Rafik Al Haram, ibadet yolculuğunun manevi hassasiyetini korurken saha operasyonunun karmaşasını azaltmak için tasarlanmış mobil rehber ve yönetim sistemidir."
    },
    features: {
      eyebrow: "Özellikler",
      title: "Hac ve umre operasyonunun ihtiyaç duyduğu tüm kritik modüller.",
      description:
        "Rafik Al Haram; kullanıcı deneyimi, organizasyon kontrolü ve manevi rehberliği aynı ürün mimarisinde birleştirir."
    },
    gallery: {
      eyebrow: "Galeri",
      title: "Uygulamanın ekran akışları ve modül deneyimleri.",
      description: "Hacı adayı, rehber ve ana rehber ekranlarıyla ürünün saha kullanımını net biçimde görün."
    },
    contact: {
      eyebrow: "İletişim",
      title: "Kafile yönetimi ve hacı adayı deneyimi için dijital çözümü birlikte planlayalım.",
      description:
        "Organizasyon yapınızı, kullanıcı sayınızı ve saha ihtiyaçlarınızı paylaşın; Rafik Al Haram'ın size uygun kullanım modelini değerlendirelim."
    }
  },
  en: {
    about: {
      eyebrow: "About",
      title: "We create digital confidence for Hajj and Umrah organizations.",
      description:
        "Rafik Al Haram is a mobile guide and management system designed to reduce field complexity while respecting the spiritual sensitivity of the journey."
    },
    features: {
      eyebrow: "Features",
      title: "All critical modules needed for Hajj and Umrah operations.",
      description: "Rafik Al Haram combines user experience, organizational control, and spiritual guidance in one product architecture."
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Application screen flows and module experiences.",
      description: "Clearly see field usage through pilgrim, guide, and lead-guide screens."
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's plan the digital solution for group management and pilgrim experience.",
      description:
        "Share your organization structure, user count, and field needs so we can evaluate the right usage model for Rafik Al Haram."
    }
  },
  ar: {
    about: {
      eyebrow: "من نحن",
      title: "نبني شعورا رقميا بالثقة في تنظيمات الحج والعمرة.",
      description:
        "رفيق الحرم هو دليل جوال ونظام إدارة صمم لتقليل تعقيد الميدان مع الحفاظ على حساسية الرحلة الروحية."
    },
    features: {
      eyebrow: "المزايا",
      title: "كل الوحدات الأساسية التي تحتاجها عمليات الحج والعمرة.",
      description: "يجمع رفيق الحرم تجربة المستخدم والتحكم التنظيمي والإرشاد الروحي في بنية منتج واحدة."
    },
    gallery: {
      eyebrow: "المعرض",
      title: "تدفقات شاشات التطبيق وتجارب الوحدات.",
      description: "شاهد استخدام المنتج في الميدان بوضوح من خلال شاشات الحاج والمرشد والمرشد الرئيسي."
    },
    contact: {
      eyebrow: "تواصل",
      title: "لنخطط معا للحل الرقمي لإدارة المجموعة وتجربة الحاج.",
      description: "شاركنا بنية تنظيمك وعدد المستخدمين واحتياجات الميدان لنقيّم نموذج الاستخدام المناسب لرفيق الحرم."
    }
  }
} as const;

export function LocalizedPageHero({ page }: { page: PageKey }) {
  const { language } = useLanguage();
  const copy = pageCopy[language][page];

  return (
    <section className="bg-[linear-gradient(180deg,#fff_0%,#fbfbf8_100%)] pt-32">
      <div className="section-shell py-16 sm:py-20">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">{copy.eyebrow}</p>
          <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">{copy.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted">{copy.description}</p>
        </Reveal>
      </div>
    </section>
  );
}
