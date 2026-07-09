"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";

export function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
      <div className="section-shell max-w-5xl">
        <Reveal>
          <SectionHeading title={t.faq.title} />
        </Reveal>
        <div className="mt-8 grid gap-4">
          {t.faq.items.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={question} delay={index * 0.03}>
                <div className="rounded-2xl border border-ink/10 bg-white shadow-card">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="focus-ring flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-ink">{question}</span>
                    <FiChevronDown
                      className={`h-5 w-5 shrink-0 text-brand-orange transition ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen ? <p className="px-6 pb-6 text-sm leading-7 text-muted">{answer}</p> : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
