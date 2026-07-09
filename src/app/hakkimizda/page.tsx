import type { Metadata } from "next";
import { About } from "@/sections/About";
import { Advantages } from "@/sections/Advantages";
import { LocalizedPageHero } from "@/sections/LocalizedPageHero";
import { LocalizedImage } from "@/components/LocalizedImage";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Rafik Al Haram'ın amacı; hacı adayları, rehberler ve organizasyon ekipleri için hac ve umre yolculuğunu sade, güvenli ve yönetilebilir hale getirmektir."
};

export default function AboutPage() {
  return (
    <>
      <LocalizedPageHero page="about" />
      <section className="section-padding bg-white">
        <div className="section-shell">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-3 shadow-soft">
              <LocalizedImage
                imageKey="image3"
                alt="Rafik Al Haram user architecture"
                width={2048}
                height={1152}
                className="h-auto max-w-full rounded-[1.45rem] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <About />
      <Advantages />
    </>
  );
}
