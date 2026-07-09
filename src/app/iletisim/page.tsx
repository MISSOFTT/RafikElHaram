import type { Metadata } from "next";
import { Contact } from "@/sections/Contact";
import { LocalizedPageHero } from "@/sections/LocalizedPageHero";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Rafik Al Haram demo talebi, iş birliği ve ürün görüşmeleri için iletişime geçin."
};

export default function ContactPage() {
  return (
    <>
      <LocalizedPageHero page="contact" />
      <Contact />
    </>
  );
}
