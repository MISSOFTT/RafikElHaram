"use client";

import { LocalizedVideo } from "@/components/LocalizedVideo";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";

export function VideoGallery() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-white">
      <div className="section-shell">
        <Reveal>
          <SectionHeading eyebrow={t.videos.eyebrow} title={t.videos.title} description={t.videos.description} />
        </Reveal>
        <div className="mt-8 md:mt-10">
          <Reveal delay={0.04} className="mx-auto max-w-4xl">
            <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
              <div className="relative aspect-video bg-ink">
                <LocalizedVideo
                  videoKey="intro"
                  title={t.videos.titles[0]}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{t.videos.titles[0]}</h3>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
