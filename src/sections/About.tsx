"use client";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";
import { useLanguage } from "@/lib/i18n";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-padding bg-white">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        <Reveal>
          <SectionHeading align="left" eyebrow={t.about.eyebrow} title={t.about.title} description={t.about.description} />
          <div className="mt-8">
            <ButtonLink href="/hakkimizda" variant="secondary">
              {t.about.cta}
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.about.cards.map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-ink/10 bg-[#fbfbf8] p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
