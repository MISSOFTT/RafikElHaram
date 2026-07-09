import type { Metadata } from "next";
import { Features } from "@/sections/Features";
import { HowItWorks } from "@/sections/HowItWorks";
import { LocalizedPageHero } from "@/sections/LocalizedPageHero";

export const metadata: Metadata = {
  title: "Özellikler",
  description: "Rafik Al Haram'ın rol bazlı mimari, lojistik planlama, dini rehberlik, AR navigasyon ve rehber paneli özelliklerini inceleyin."
};

export default function FeaturesPage() {
  return (
    <>
      <LocalizedPageHero page="features" />
      <Features />
      <HowItWorks />
    </>
  );
}
