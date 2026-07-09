"use client";

import { FiCheck } from "react-icons/fi";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";

export function Advantages() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-white">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
        <Reveal>
          <SectionHeading align="left" eyebrow={t.advantages.eyebrow} title={t.advantages.title} description={t.advantages.description} />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.advantages.items.map((item, index) => (
            <Reveal key={item} delay={index * 0.04}>
              <div className="flex h-full gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-teal/10 text-brand-teal">
                  <FiCheck aria-hidden="true" />
                </span>
                <p className="text-sm leading-7 text-muted">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
