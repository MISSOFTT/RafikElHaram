"use client";

import { FiAlertTriangle, FiBell, FiCalendar, FiCompass, FiGlobe, FiGrid, FiMapPin, FiMic, FiShield, FiUsers } from "react-icons/fi";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";

const icons = [FiUsers, FiGrid, FiCalendar, FiMapPin, FiShield, FiCompass, FiMic, FiGlobe, FiAlertTriangle, FiBell];

export function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="section-padding bg-[#fbfbf8]">
      <div className="section-shell">
        <Reveal>
          <SectionHeading eyebrow={t.features.eyebrow} title={t.features.title} description={t.features.description} />
        </Reveal>
        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {t.features.items.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <Reveal key={title} delay={index * 0.03}>
                <article className="group h-full min-w-0 overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-orange/35 hover:shadow-soft sm:p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-orange/12 text-brand-orange transition group-hover:bg-brand-orange group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
