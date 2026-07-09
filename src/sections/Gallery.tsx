"use client";

import Link from "next/link";
import { LocalizedImage } from "@/components/LocalizedImage";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import type { PresentationImageKey } from "@/lib/media";

type GalleryProps = {
  limit?: number;
};

const repeatedGalleryImages = new Set<PresentationImageKey>(["image1", "image4", "image8"]);

export function Gallery({ limit }: GalleryProps) {
  const { t } = useLanguage();
  const items = t.gallery.items
    .map((title, index) => ({ title, imageKey: `image${index + 1}` as PresentationImageKey }))
    .filter((item) => !repeatedGalleryImages.has(item.imageKey));
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <section id="gallery" className="section-padding bg-[#fbfbf8]">
      <div className="section-shell">
        <Reveal>
          <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title} description={t.gallery.description} />
        </Reveal>
        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {visibleItems.map((item, index) => (
            <Reveal key={item.imageKey} delay={index * 0.03}>
              <article className="group h-full min-w-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="aspect-[16/10] w-full overflow-hidden bg-white p-3 sm:p-4">
                  <div className="relative h-full w-full">
                    <LocalizedImage
                      imageKey={item.imageKey}
                      alt={`Rafik Al Haram ${item.title} ${t.gallery.altSuffix}`}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, calc(100vw - 64px)"
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.015]"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        {limit ? (
          <div className="mt-10 text-center">
            <Link
              href="/galeri"
              className="focus-ring inline-flex rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand-orange hover:text-brand-orange"
            >
              {t.gallery.all}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
