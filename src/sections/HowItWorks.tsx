"use client";

import { LocalizedImage } from "@/components/LocalizedImage";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-ink text-white">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
        <Reveal>
          <SectionHeading align="left" inverted eyebrow={t.how.eyebrow} title={t.how.title} description={t.how.description} />
          <div className="mt-8 grid gap-4 md:mt-10 md:gap-5">
            {t.how.steps.map(([title, description], index) => (
              <div key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-orange text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/68">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-2 shadow-2xl backdrop-blur-xl sm:p-3">
            <LocalizedImage
              imageKey="image12"
              alt={t.how.imageAlt}
              width={1366}
              height={768}
              className="h-auto max-w-full rounded-[1.45rem] object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
