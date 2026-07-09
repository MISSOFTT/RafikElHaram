import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { FloatingTrialButton } from "@/components/FloatingTrialButton";
import { Navbar } from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rafikalharam.com"),
  title: {
    default: "Rafik Al Haram | Hac ve Umre Dijital Rehberi",
    template: "%s | Rafik Al Haram"
  },
  icons: {
    icon: [
      {
        url: "/brand/rafik-al-haram-logo.jpeg",
        type: "image/jpeg"
      }
    ],
    shortcut: "/brand/rafik-al-haram-logo.jpeg",
    apple: "/brand/rafik-al-haram-logo.jpeg"
  },
  description:
    "Rafik Al Haram, hac ve umre organizasyonları için hacı adayı mobil rehberi, rehber paneli, grup yönetimi, AR yönlendirme, dini içerik ve çevirmen modüllerini birleştiren dijital yönetim sistemidir.",
  keywords: [
    "hac uygulaması",
    "umre uygulaması",
    "hacı adayı mobil uygulaması",
    "kafile yönetimi",
    "rehber paneli",
    "Rafik Al Haram"
  ],
  openGraph: {
    title: "Rafik Al Haram",
    description: "Hac ve umre yolculuğu için dijital rehber ve yönetim sistemi.",
    type: "website",
    locale: "tr_TR",
    images: ["/media/images/tr/image4.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <FloatingTrialButton />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
