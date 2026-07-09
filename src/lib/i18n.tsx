"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "tr" | "en" | "ar";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)[Language];
};

const STORAGE_KEY = "rafik-language";

export const translations = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      features: "Özellikler",
      plans: "Paketler",
      gallery: "Galeri",
      contact: "İletişim",
      demo: "Demo Talep Et",
      language: "Dil seçimi"
    },
    common: {
      brandSubtitle: "Hac ve Umre Dijital Rehberi",
      tryNow: "Hemen Deneyin",
      viewPackages: "Paketleri Görüntüle"
    },
    hero: {
      eyebrow: "Hac ve umre yolculuğunun dijital rehberi",
      title: "Misafirinizin Her An Yanında Olun.",
      description:
        "Rafik Al Haram, umre ve hac misafirlerinizi tek bir mobil uygulama üzerinden yönetin, bilgilendirin ve her an ulaşılabilir olun.",
      detail:
        "Uygulama; günlük ibadet akışını, otel ve oda bilgilerini, buluşma noktalarını, servis takibini, dini içerikleri, acil yardım akışını ve rehber-yönetici kontrolünü aynı mobil deneyimde anlaşılır biçimde sunar.",
      primary: "Demo Talep Et",
      secondary: "Özellikleri İncele",
      bullets: [
        "Hacı adayı için sade ana ekran",
        "Otel, oda, grup ve rehber bilgileri",
        "Günlük ibadet ve etkinlik programı",
        "Akıllı buluşma noktaları ve harita",
        "AR destekli servis ve nokta yönlendirme",
        "Fetva, dua ve dini rehberlik içerikleri",
        "Bas-konuş çevirmen desteği",
        "SOS ve kritik bildirim akışı"
      ],
      playStore: "Play Store'dan İndir",
      appStore: "App Store'dan İndir",
      appStoreSoonTitle: "Çok yakında",
      appStoreSoonDescription: "Rafik Al Haram iOS uygulaması App Store'da yayınlanmak üzere hazırlanıyor.",
      close: "Kapat",
      imageAlt: "Rafik Al Haram hacı adayı ve yönetici kontrol paneli ekranları",
      stats: [
        {
          title: "3 Kullanıcı Rolü",
          subtitle: "Hacı Adayı • Rehber • Yönetici",
          description:
            "Her kullanıcı yalnızca ihtiyaç duyduğu ekranları görür. Böylece kullanım kolaylaşır, hata riski azalır ve süreçler daha verimli yönetilir."
        },
        {
          title: "20+ Akıllı Modül",
          subtitle: "Tüm ihtiyaçlar tek uygulamada",
          description:
            "İletişim, kafile yönetimi, ibadet programları, otel bilgileri, konum, bildirimler, acil yardım ve çok daha fazlası tek uygulamada."
        },
        {
          title: "Tek Merkezden Yönetim",
          subtitle: "Saniyeler içinde kontrol",
          description:
            "Kafileler, personeller, oteller, etkinlikler, duyurular ve içerikler tek yönetim panelinden saniyeler içinde yönetilir."
        }
      ]
    },
    about: {
      eyebrow: "Uygulamanın amacı",
      title: "İbadet huzurunu koruyan, operasyon yükünü azaltan dijital yol arkadaşı.",
      description:
        "Rafik Al Haram, hac ve umre organizasyonlarında en kritik iki ihtiyacı aynı anda çözer: hacı adayının yolculuk boyunca ne yapacağını güvenle bilmesi ve organizasyon ekibinin sahayı anlık yönetebilmesi.",
      cta: "Hikayeyi Oku",
      cards: [
        ["Hacı adayı", "Otel, oda, servis, grup, rehber, dua, fetva, etkinlik ve acil yardım bilgilerine tek noktadan erişir."],
        ["Personel rehberi", "Sorumlu olduğu grubu yönetir, katılımı doğrular, lokasyon ve iletişim akışını canlı tutar."],
        ["Ana rehber", "Tüm kafile gruplarını, personeli, etkinlikleri ve operasyonel kararları üst seviyeden denetler."],
        ["Kurum", "Dağınık saha bilgisini ölçülebilir, izlenebilir ve kullanıcı dostu bir dijital sisteme dönüştürür."]
      ]
    },
    features: {
      eyebrow: "Özellikler",
      title: "Hacı adayı deneyiminden ana rehber kontrolüne kadar bütün yolculuk tek sistemde.",
      description:
        "Rafik Al Haram; saha operasyonu, misafir bilgilendirme, dini rehberlik, konum takibi ve canlı iletişim ihtiyaçlarını tek uygulama altında toplar.",
      items: [
        ["Rol Bazlı Kullanıcı Mimarisi", "Sistem giriş yapan kişiyi tanır; hacı adayına sade rehberlik ekranı, personele grup yönetimi, ana rehbere tüm kafile operasyonunu sunar."],
        ["Erişilebilir ve Sade Arayüz", "Büyük dokunmatik alanlar, okunabilir tipografi ve yalın menü yapısı özellikle ileri yaş kullanıcıların teknoloji bariyerini azaltır."],
        ["Lojistik ve Planlama Merkezi", "Otel, oda, servis, grup, günlük ibadet programı ve kritik bildirimler tek ekrandan anlaşılır biçimde yönetilir."],
        ["Akıllı Buluşma Noktaları", "Aktif noktalar listelenir, haritada görüntülenir, fotoğrafla tanıtılır ve AR yönlendirme ile kalabalık içinde bulunabilir hale gelir."],
        ["Fetva ve Dini Rehberlik", "Tematik fihrist, akıllı arama ve soru-cevap formatıyla hac ve umre sürecinde güvenilir bilgiye erişim sağlar."],
        ["İbadet ve Dua Rehberi", "Tavaf, sa'y, ihram, Arafat ve diğer aşamalar için Arapça metin ve Türkçe anlamı birlikte sunan bağlamsal dua kütüphanesi."],
        ["Bas-Konuş Çevirmen", "Türkçe-Arapça sesli çeviri desteğiyle yerel yetkililer, esnaf ve görevlilerle hızlı iletişim kurulmasını kolaylaştırır."],
        ["Servis ve Araç Bulma", "Araç fotoğrafı, plaka, harita görünümü ve AR yönlendirme ile hacı adayının doğru servise güvenle ulaşmasını sağlar."],
        ["SOS Acil Yardım", "Beklenmedik durumlarda tek dokunuşla yardım talebi oluşturularak rehber ve organizasyon ekibi bilgilendirilir; en kısa sürede yardıma gelmeleri temin edilir."],
        ["Kritik Bildirimler ve Duyurular", "Program değişiklikleri, buluşma noktaları, yardım talepleri, konferanslar ve duyurular saniyeler içinde tüm kafileye bildirilir. Hiçbir önemli bilginin gözden kaçmaması sağlanır."]
      ]
    },
    advantages: {
      eyebrow: "Avantajlar",
      title: "Sahada daha az belirsizlik, ekipte daha fazla kontrol.",
      description:
        "Rafik Al Haram, hem hacı adayının kaygısını azaltır hem de organizasyon ekibinin zamanını operasyonun gerçekten kritik noktalarına ayırmasını sağlar.",
      items: [
        "Kalabalık ve yoğun program ortamında kaybolma, yanlış noktaya gitme ve servis karışıklığı riskini azaltır.",
        "Rehberlerin yoklama, arama, lokasyon kontrolü ve katılım takibi için harcadığı zamanı düşürür.",
        "Dini içerikleri fiziksel kitap taşıma ihtiyacı olmadan, okunabilir ve arama yapılabilir biçimde sunar.",
        "Ana rehbere grup, personel, otel, etkinlik ve onay süreçleri üzerinde merkezi denetim kazandırır.",
        "Hacı adayına nerede, ne zaman, kiminle ve hangi araca bineceği konusunda sürekli güven hissi verir.",
        "Dil bariyerini azaltarak sahadaki pratik iletişimi hızlandırır."
      ]
    },
    how: {
      eyebrow: "Nasıl çalışır",
      title: "Planlama merkezde başlar, sahada mobil akışa dönüşür.",
      description:
        "Her rol kendi ihtiyacına göre sadeleştirilmiş ekran görür; aynı veri organizasyon ekibi için yönetilebilir bir operasyon tablosuna dönüşür.",
      imageAlt: "Rafik Al Haram rehber panelinde grup oluşturma ve yönetimi",
      steps: [
        ["Kafile ve Roller Tanımlanır", "Ana rehber grupları, rehberleri, otelleri, servisleri ve kullanıcı yetkilerini tek merkezden oluşturur."],
        ["Program ve Noktalar Yayına Alınır", "Günlük ibadet akışı, buluşma noktaları, yemek saatleri, servis bilgileri ve etkinlikler mobil ekrana düşer."],
        ["Hacı Adayı Sade Panelden İlerler", "Kullanıcı otelini, odasını, grubunu, rehberini, duaları, fetvaları ve acil yardım butonunu kolayca bulur."],
        ["Rehber Sahadan Anlık Yönetir", "Katılım, konum, grup üyeleri, favoriler, aramalar ve nokta güncellemeleri rehber panelinden takip edilir."]
      ]
    },
    gallery: {
      eyebrow: "Ekran görüntüleri",
      title: "Sunumdaki gerçek arayüzlerle ürün akışını görün.",
      description: "Giriş ekranından grup yönetimine, dini rehberlikten AR servis bulmaya kadar uygulamanın temel deneyimleri.",
      all: "Tüm Galeriyi Aç",
      altSuffix: "ekran görüntüsü",
      items: [
        "Kurumsal Açılış",
        "Sade Giriş Deneyimi",
        "Üç Katmanlı Mimari",
        "Kontrol Panelleri",
        "Lojistik Merkezi",
        "Fetva Rehberi",
        "Dua Rehberi",
        "Grubum Paneli",
        "Etkinlik Takibi",
        "Akıllı Buluşma Noktaları",
        "Rehber Katılım Yönetimi",
        "Grup Oluşturma",
        "Dinamik Nokta Yönetimi",
        "Çevirmen Modülü",
        "Servis Bulma"
      ]
    },
    videos: {
      eyebrow: "Videolar",
      title: "Rafik El Haram",
      description: "Kutsal mekanlardaki dijital yardımcı",
      titles: ["Tanıtım Videosu 1", "Tanıtım Videosu 2", "Tanıtım Videosu 3"]
    },
    faq: {
      eyebrow: "SSS",
      title: "Merak edilenler",
      items: [
        ["Rafik Al Haram kimler için geliştirildi?", "Hac ve umre organizasyonlarında hacı adayları, personel rehberleri ve ana rehberlerin aynı operasyonu farklı yetki seviyeleriyle yönetebilmesi için geliştirildi."],
        ["Yaşlı kullanıcılar uygulamayı rahat kullanabilir mi?", "Evet. Büyük butonlar, sade menüler, geniş boşluklar ve okunabilir tipografi ile teknoloji bariyerini azaltmayı hedefler."],
        ["Uygulama sadece bilgilendirme mi yapıyor?", "Hayır. Grup oluşturma, rehber ve otel atama, etkinlik onayı, dijital yoklama, konum doğrulama, servis takibi, AR yönlendirme ve acil yardım gibi operasyonel fonksiyonlar da sunar."],
        ["Dini içerikler nasıl kurgulanıyor?", "Fetva ve dua içerikleri tematik başlıklarla, arama yapılabilir soru-cevap yapısıyla ve kullanıcıyı yormayan okuma kartlarıyla sunulur."],
        ["Çevirmen modülü hangi ihtiyacı çözer?", "Türkçe-Arapça bas-konuş deneyimiyle yerel görevliler, esnaf ve farklı dil konuşan kişilerle pratik iletişim kurulmasına yardımcı olur."]
      ]
    },
    contact: {
      eyebrow: "İletişim",
      title: "Kafile operasyonunuzu dijitalleştirmek için görüşelim.",
      description: "Rafik Al Haram'ın hac ve umre organizasyonunuzdaki kullanım senaryolarını birlikte değerlendirelim.",
      labels: {
        email: "E-posta",
        phone: "Telefon",
        istanbul: "İstanbul Ofis",
        erzurum: "Erzurum Ofis",
        name: "Ad Soyad",
        org: "Kurum",
        contactInfo: "İletişim Bilgileri",
        message: "Mesajınız",
        send: "Mesaj Gönder"
      },
      placeholders: {
        name: "Adınız Soyadınız",
        org: "Firma veya organizasyon",
        email: "ornek@kurum.com",
        phone: "+90",
        message: "Organizasyonunuz, kafile büyüklüğü ve ihtiyaçlarınızı paylaşın."
      }
    },
    footer: {
      subtitle: "Hacı adayları için dijital rehber ve yönetim sistemi.",
      description: "Hac ve umre organizasyonlarında saha koordinasyonunu, dini rehberliği ve kullanıcı güvenini tek mobil deneyimde buluşturur.",
      quickLinks: "Hızlı Linkler",
      contact: "İletişim",
      rights: "© 2026 Rafik Al Haram. Tüm hakları saklıdır.",
      note: "KVKK uyumlu, erişilebilir ve mobil öncelikli deneyim."
    }
  },
  en: {
    nav: { home: "Home", about: "About", features: "Features", plans: "Packages", gallery: "Gallery", contact: "Contact", demo: "Request Demo", language: "Language" },
    common: { brandSubtitle: "Digital Guide for Hajj and Umrah", tryNow: "Try Now", viewPackages: "View Packages" },
    hero: {
      eyebrow: "The digital guide for Hajj and Umrah journeys",
      title: "Stay Beside Your Guests at Every Moment.",
      description:
        "With Rafik Al Haram, manage, inform, and stay reachable for your Umrah and Hajj guests through one mobile application.",
      detail:
        "The app brings daily worship flow, hotel and room details, meeting points, transport tracking, religious content, emergency help, and guide-manager control into one clear mobile experience.",
      primary: "Request Demo",
      secondary: "Explore Features",
      bullets: [
        "Simple home screen for pilgrims",
        "Hotel, room, group, and guide details",
        "Daily worship and event schedule",
        "Smart meeting points and map",
        "AR-assisted transport and point guidance",
        "Fatwa, prayer, and religious guidance",
        "Push-to-talk translator support",
        "SOS and critical alert flow"
      ],
      playStore: "Download on Play Store",
      appStore: "Download on App Store",
      appStoreSoonTitle: "Coming soon",
      appStoreSoonDescription: "The Rafik Al Haram iOS app is being prepared for release on the App Store.",
      close: "Close",
      imageAlt: "Rafik Al Haram pilgrim and manager dashboard screens",
      stats: [
        {
          title: "3 User Roles",
          subtitle: "Pilgrim • Guide • Manager",
          description:
            "Each user sees only the screens they need. This makes usage easier, reduces the risk of mistakes, and helps processes run more efficiently."
        },
        {
          title: "20+ Smart Modules",
          subtitle: "All needs in one app",
          description:
            "Communication, group management, worship schedules, hotel details, location, notifications, emergency help, and much more in one application."
        },
        {
          title: "Centralized Management",
          subtitle: "Control in seconds",
          description:
            "Groups, staff, hotels, events, announcements, and content can be managed from one admin panel within seconds."
        }
      ]
    },
    about: {
      eyebrow: "Purpose",
      title: "A digital companion that protects spiritual focus and reduces operational load.",
      description:
        "Rafik Al Haram solves two critical needs at once: helping pilgrims know what to do with confidence and enabling the organization team to manage field operations in real time.",
      cta: "Read the Story",
      cards: [
        ["Pilgrim", "Accesses hotel, room, transport, group, guide, prayers, fatwas, events, and emergency help from one place."],
        ["Guide", "Manages the assigned group, verifies attendance, and keeps location and communication flows active."],
        ["Lead guide", "Supervises all groups, staff, events, and operational decisions at a higher level."],
        ["Organization", "Turns scattered field data into a measurable, trackable, and user-friendly digital system."]
      ]
    },
    features: {
      eyebrow: "Features",
      title: "The whole journey, from pilgrim experience to lead-guide control, in one system.",
      description: "Rafik Al Haram brings field operations, guest information, religious guidance, location tracking, and live communication into one application.",
      items: [
        ["Role-Based User Architecture", "The system recognizes each user and provides a simple pilgrim screen, group tools for guides, and full operations for lead guides."],
        ["Accessible, Simple Interface", "Large touch areas, readable typography, and clear menus reduce technology barriers for older users."],
        ["Logistics and Planning Hub", "Hotel, room, transport, group, daily worship schedule, and critical notifications are managed clearly from one screen."],
        ["Smart Meeting Points", "Active points can be listed, viewed on a map, introduced with photos, and found in crowds with AR guidance."],
        ["Fatwa and Religious Guidance", "Topic indexes, smart search, and Q&A formats help users access reliable guidance during Hajj and Umrah."],
        ["Worship and Prayer Guide", "A contextual prayer library for tawaf, sa'i, ihram, Arafat, and other stages."],
        ["Push-to-Talk Translator", "Turkish-Arabic voice translation helps users communicate quickly with officials, shops, and local staff."],
        ["Transport and Vehicle Finder", "Vehicle photos, plate numbers, map view, and AR guidance help pilgrims reach the right service safely."],
        ["SOS Emergency Help", "In unexpected situations, users can create a help request with one tap. Guides and the organization team are notified so assistance can arrive as quickly as possible."],
        ["Critical Notifications and Announcements", "Program changes, meeting points, help requests, conferences, and announcements are shared with the whole group within seconds so no important information is missed."]
      ]
    },
    advantages: {
      eyebrow: "Advantages",
      title: "Less uncertainty in the field, more control for the team.",
      description: "Rafik Al Haram lowers pilgrim anxiety and helps teams spend time on the truly critical parts of operations.",
      items: [
        "Reduces the risk of getting lost, going to the wrong point, or confusing transport in crowded programs.",
        "Cuts the time guides spend on attendance, calls, location checks, and participation tracking.",
        "Provides religious content without carrying physical books, in a readable and searchable format.",
        "Gives lead guides central control over groups, staff, hotels, events, and approvals.",
        "Gives pilgrims continuous confidence about where to be, when to move, who to follow, and which vehicle to use.",
        "Reduces language barriers and speeds up practical field communication."
      ]
    },
    how: {
      eyebrow: "How it works",
      title: "Planning starts centrally and becomes a mobile flow in the field.",
      description: "Each role sees simplified screens for its needs, while the same data becomes a manageable operations board for the team.",
      imageAlt: "Rafik Al Haram guide panel for group creation and management",
      steps: [
        ["Groups and Roles Are Defined", "The lead guide creates groups, guides, hotels, transport, and permissions from one center."],
        ["Programs and Points Go Live", "Daily worship flow, meeting points, meal times, transport details, and events appear on mobile screens."],
        ["Pilgrims Follow a Simple Panel", "Users easily find hotel, room, group, guide, prayers, fatwas, and emergency help."],
        ["Guides Manage the Field Live", "Attendance, location, members, favorites, calls, and point updates are tracked from the guide panel."]
      ]
    },
    gallery: {
      eyebrow: "Screenshots",
      title: "See the product flow through real presentation interfaces.",
      description: "Core experiences from login and group management to religious guidance and AR transport finding.",
      all: "Open Full Gallery",
      altSuffix: "screenshot",
      items: [
        "Corporate Opening",
        "Simple Login Experience",
        "Three-Layer Architecture",
        "Control Panels",
        "Logistics Center",
        "Fatwa Guide",
        "Prayer Guide",
        "My Group Panel",
        "Event Tracking",
        "Smart Meeting Points",
        "Guide Attendance Management",
        "Group Creation",
        "Dynamic Point Management",
        "Translator Module",
        "Transport Finder"
      ]
    },
    videos: {
      eyebrow: "Videos",
      title: "Rafik El Haram",
      description: "The digital companion in the holy places",
      titles: ["Introduction Video 1", "Introduction Video 2", "Introduction Video 3"]
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        ["Who is Rafik Al Haram built for?", "It is built for pilgrims, guide staff, and lead guides to manage the same operation with different permission levels."],
        ["Can older users use it comfortably?", "Yes. Large buttons, simple menus, generous spacing, and readable typography are designed to reduce technology barriers."],
        ["Is it only informational?", "No. It also includes group creation, guide and hotel assignment, event approval, digital attendance, location verification, transport tracking, AR guidance, and emergency help."],
        ["How is religious content structured?", "Fatwa and prayer content is presented with thematic headings, searchable Q&A, and easy reading cards."],
        ["What problem does the translator solve?", "It helps users communicate practically with local staff, shops, and people speaking different languages."]
      ]
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's discuss digitizing your group operation.",
      description: "Together, we can evaluate how Rafik Al Haram fits your Hajj and Umrah organization.",
      labels: { email: "Email", phone: "Phone", istanbul: "Istanbul Office", erzurum: "Erzurum Office", name: "Full Name", org: "Organization", contactInfo: "Contact Details", message: "Message", send: "Send Message" },
      placeholders: { name: "Your full name", org: "Company or organization", email: "name@company.com", phone: "+90", message: "Share your organization, group size, and needs." }
    },
    footer: {
      subtitle: "Digital guide and management system for pilgrims.",
      description: "Brings field coordination, religious guidance, and user confidence together in one mobile experience.",
      quickLinks: "Quick Links",
      contact: "Contact",
      rights: "© 2026 Rafik Al Haram. All rights reserved.",
      note: "Privacy-aware, accessible, and mobile-first experience."
    }
  },
  ar: {
    nav: { home: "الرئيسية", about: "من نحن", features: "المزايا", plans: "الباقات", gallery: "المعرض", contact: "تواصل", demo: "اطلب عرضا", language: "اختيار اللغة" },
    common: { brandSubtitle: "الدليل الرقمي للحج والعمرة", tryNow: "جرّب الآن", viewPackages: "عرض الباقات" },
    hero: {
      eyebrow: "الدليل الرقمي لرحلات الحج والعمرة",
      title: "كن مع ضيوفك في كل لحظة.",
      description:
        "مع رفيق الحرم يمكنك إدارة ضيوف العمرة والحج وإبلاغهم والبقاء متاحا لهم عبر تطبيق جوال واحد.",
      detail:
        "يجمع التطبيق برنامج العبادة اليومي ومعلومات الفندق والغرفة ونقاط اللقاء وتتبع النقل والمحتوى الديني والمساعدة الطارئة وتحكم المرشد والإدارة في تجربة جوال واضحة.",
      primary: "اطلب عرضا",
      secondary: "استعرض المزايا",
      bullets: [
        "شاشة رئيسية بسيطة للحاج",
        "معلومات الفندق والغرفة والمجموعة والمرشد",
        "برنامج العبادة والفعاليات اليومي",
        "نقاط لقاء ذكية وخريطة",
        "توجيه للوسائل والنقاط بالواقع المعزز",
        "فتاوى وأدعية وإرشاد ديني",
        "دعم مترجم اضغط وتحدث",
        "تدفق SOS والتنبيهات المهمة"
      ],
      playStore: "حمّل من Play Store",
      appStore: "حمّل من App Store",
      appStoreSoonTitle: "قريبا جدا",
      appStoreSoonDescription: "تطبيق رفيق الحرم لنظام iOS قيد التحضير للنشر على App Store.",
      close: "إغلاق",
      imageAlt: "شاشات رفيق الحرم للحاج ولوحة الإدارة",
      stats: [
        {
          title: "3 أدوار للمستخدمين",
          subtitle: "الحاج • المرشد • المدير",
          description:
            "يرى كل مستخدم الشاشات التي يحتاجها فقط. وبذلك يصبح الاستخدام أسهل، وتقل احتمالات الخطأ، وتدار العمليات بكفاءة أعلى."
        },
        {
          title: "20+ وحدة ذكية",
          subtitle: "كل الاحتياجات في تطبيق واحد",
          description:
            "التواصل، إدارة المجموعات، برامج العبادة، معلومات الفندق، الموقع، التنبيهات، المساعدة الطارئة، وأكثر من ذلك في تطبيق واحد."
        },
        {
          title: "إدارة من مركز واحد",
          subtitle: "تحكم خلال ثوان",
          description:
            "تدار المجموعات والموظفون والفنادق والفعاليات والإعلانات والمحتوى من لوحة إدارة واحدة خلال ثوان."
        }
      ]
    },
    about: {
      eyebrow: "هدف التطبيق",
      title: "رفيق رقمي يحافظ على طمأنينة العبادة ويخفف عبء التشغيل.",
      description:
        "يحل رفيق الحرم حاجتين أساسيتين: أن يعرف الحاج ما يجب فعله بثقة، وأن يدير فريق التنظيم الميدان لحظة بلحظة.",
      cta: "اقرأ القصة",
      cards: [
        ["الحاج", "يصل إلى معلومات الفندق والغرفة والنقل والمجموعة والمرشد والأدعية والفتاوى والفعاليات والمساعدة الطارئة من مكان واحد."],
        ["المرشد", "يدير مجموعته ويتحقق من الحضور ويحافظ على تدفق الموقع والتواصل."],
        ["المرشد الرئيسي", "يشرف على كل المجموعات والموظفين والفعاليات والقرارات التشغيلية."],
        ["المؤسسة", "تحول بيانات الميدان المتفرقة إلى نظام رقمي قابل للقياس والمتابعة وسهل الاستخدام."]
      ]
    },
    features: {
      eyebrow: "المزايا",
      title: "رحلة كاملة في نظام واحد، من تجربة الحاج إلى تحكم المرشد الرئيسي.",
      description: "يجمع رفيق الحرم عمليات الميدان وإبلاغ الضيوف والإرشاد الديني وتتبع الموقع والتواصل المباشر في تطبيق واحد.",
      items: [
        ["بنية مستخدم حسب الدور", "يتعرف النظام على المستخدم ويعرض للحاج شاشة مبسطة، وللمرشد أدوات المجموعة، وللمرشد الرئيسي كامل التشغيل."],
        ["واجهة بسيطة وسهلة الوصول", "مساحات لمس كبيرة وخط واضح وقوائم بسيطة تقلل حاجز التقنية، خصوصا لكبار السن."],
        ["مركز التخطيط والخدمات", "إدارة الفندق والغرفة والنقل والمجموعة وبرنامج العبادة والتنبيهات المهمة من شاشة واضحة."],
        ["نقاط لقاء ذكية", "عرض النقاط على الخريطة ومع الصور والوصول إليها وسط الزحام بتوجيه الواقع المعزز."],
        ["الفتاوى والإرشاد الديني", "فهرسة موضوعية وبحث ذكي وصيغة سؤال وجواب للوصول إلى إرشاد موثوق."],
        ["دليل العبادة والأدعية", "مكتبة أدعية سياقية للطواف والسعي والإحرام وعرفة وغيرها."],
        ["مترجم اضغط وتحدث", "ترجمة صوتية تركية-عربية لتسهيل التواصل مع المسؤولين والمتاجر والكوادر المحلية."],
        ["العثور على الحافلة والمركبة", "صور المركبة واللوحة والخريطة والتوجيه المعزز تساعد الحاج على الوصول للخدمة الصحيحة."],
        ["مساعدة SOS الطارئة", "في الحالات غير المتوقعة يمكن إنشاء طلب مساعدة بلمسة واحدة، ويتم إبلاغ المرشد وفريق التنظيم ليصل الدعم في أسرع وقت ممكن."],
        ["التنبيهات والإعلانات المهمة", "تصل تغييرات البرنامج ونقاط اللقاء وطلبات المساعدة والمؤتمرات والإعلانات إلى كامل المجموعة خلال ثوان حتى لا تضيع أي معلومة مهمة."]
      ]
    },
    advantages: {
      eyebrow: "الفوائد",
      title: "حيرة أقل في الميدان وتحكم أكبر للفريق.",
      description: "يقلل رفيق الحرم قلق الحاج ويساعد الفريق على التركيز على النقاط التشغيلية الأهم.",
      items: [
        "يقلل خطر الضياع أو الذهاب إلى نقطة خاطئة أو الخلط بين وسائل النقل.",
        "يخفض الوقت الذي يقضيه المرشدون في الحضور والاتصال وفحص الموقع والمتابعة.",
        "يقدم المحتوى الديني بصيغة مقروءة وقابلة للبحث دون حمل كتب ورقية.",
        "يمنح المرشد الرئيسي تحكما مركزيا بالمجموعات والموظفين والفنادق والفعاليات والموافقات.",
        "يمنح الحاج ثقة مستمرة حول المكان والوقت والشخص والمركبة المناسبة.",
        "يقلل حاجز اللغة ويسرع التواصل العملي في الميدان."
      ]
    },
    how: {
      eyebrow: "كيف يعمل",
      title: "يبدأ التخطيط مركزيا ثم يتحول إلى تدفق جوال في الميدان.",
      description: "يرى كل دور شاشات مبسطة تناسب احتياجه، وتتحول البيانات نفسها إلى لوحة تشغيل قابلة للإدارة.",
      imageAlt: "لوحة المرشد في رفيق الحرم لإنشاء وإدارة المجموعات",
      steps: [
        ["تعريف المجموعات والأدوار", "ينشئ المرشد الرئيسي المجموعات والمرشدين والفنادق والنقل والصلاحيات من مركز واحد."],
        ["نشر البرامج والنقاط", "تظهر برامج العبادة ونقاط اللقاء وأوقات الطعام ومعلومات النقل والفعاليات على شاشة الجوال."],
        ["يتقدم الحاج من لوحة بسيطة", "يجد المستخدم الفندق والغرفة والمجموعة والمرشد والأدعية والفتاوى وزر الطوارئ بسهولة."],
        ["يدير المرشد الميدان مباشرة", "تتم متابعة الحضور والموقع والأعضاء والمفضلة والاتصالات وتحديثات النقاط من لوحة المرشد."]
      ]
    },
    gallery: {
      eyebrow: "لقطات الشاشة",
      title: "شاهد تدفق المنتج من خلال واجهات العرض الحقيقية.",
      description: "تجارب أساسية من تسجيل الدخول وإدارة المجموعات إلى الإرشاد الديني والعثور على النقل بالواقع المعزز.",
      all: "افتح المعرض الكامل",
      altSuffix: "لقطة شاشة",
      items: [
        "الافتتاح المؤسسي",
        "تجربة دخول بسيطة",
        "بنية ثلاثية الطبقات",
        "لوحات التحكم",
        "مركز الخدمات",
        "دليل الفتاوى",
        "دليل الأدعية",
        "لوحة مجموعتي",
        "متابعة الفعاليات",
        "نقاط لقاء ذكية",
        "إدارة حضور المرشد",
        "إنشاء مجموعة",
        "إدارة نقاط ديناميكية",
        "وحدة الترجمة",
        "العثور على النقل"
      ]
    },
    videos: {
      eyebrow: "الفيديوهات",
      title: "رفيق الحرم",
      description: "المساعد الرقمي في الأماكن المقدسة",
      titles: ["فيديو تعريفي 1", "فيديو تعريفي 2", "فيديو تعريفي 3"]
    },
    faq: {
      eyebrow: "الأسئلة",
      title: "أسئلة شائعة",
      items: [
        ["لمن تم تطوير رفيق الحرم؟", "تم تطويره للحجاج والمرشدين والمرشدين الرئيسيين لإدارة العملية نفسها بصلاحيات مختلفة."],
        ["هل يمكن لكبار السن استخدامه بسهولة؟", "نعم. الأزرار الكبيرة والقوائم البسيطة والمسافات الواسعة والخط المقروء تقلل حاجز التقنية."],
        ["هل التطبيق للمعلومات فقط؟", "لا. يشمل إنشاء المجموعات وتعيين المرشد والفندق واعتماد الفعاليات والحضور الرقمي والتحقق من الموقع وتتبع النقل والتوجيه المعزز والمساعدة الطارئة."],
        ["كيف يتم تنظيم المحتوى الديني؟", "تقدم الفتاوى والأدعية بعناوين موضوعية وبحث وصيغة سؤال وجواب وبطاقات قراءة سهلة."],
        ["ما فائدة وحدة الترجمة؟", "تساعد على التواصل العملي مع الكوادر المحلية والمتاجر والأشخاص بلغات مختلفة."]
      ]
    },
    contact: {
      eyebrow: "تواصل",
      title: "لنتحدث عن رقمنة إدارة مجموعتك.",
      description: "نقيّم معا كيف يناسب رفيق الحرم تنظيم الحج والعمرة لديك.",
      labels: { email: "البريد الإلكتروني", phone: "الهاتف", istanbul: "مكتب إسطنبول", erzurum: "مكتب أرضروم", name: "الاسم الكامل", org: "المؤسسة", contactInfo: "بيانات التواصل", message: "رسالتك", send: "إرسال الرسالة" },
      placeholders: { name: "اسمك الكامل", org: "الشركة أو المؤسسة", email: "name@company.com", phone: "+90", message: "شاركنا نوع التنظيم وحجم المجموعة والاحتياجات." }
    },
    footer: {
      subtitle: "دليل رقمي ونظام إدارة للحجاج.",
      description: "يجمع تنسيق الميدان والإرشاد الديني وثقة المستخدم في تجربة جوال واحدة.",
      quickLinks: "روابط سريعة",
      contact: "تواصل",
      rights: "© 2026 Rafik Al Haram. جميع الحقوق محفوظة.",
      note: "تجربة تراعي الخصوصية وسهلة الوصول ومصممة للجوال أولا."
    }
  }
} as const;

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "tr" || value === "en" || value === "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tr");

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
