"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { LocalizedImage } from "@/components/LocalizedImage";
import { useLanguage } from "@/lib/i18n";

const playStoreUrl = "https://play.google.com/store/apps/details?id=com.missoft.haciadaylari";
const highlightedDescriptionPhrases = {
  tr: "mobil uygulama",
  en: "mobile application",
  ar: "تطبيق جوال"
} as const;

export function Hero() {
  const { t, language } = useLanguage();
  const [isAppStoreOpen, setIsAppStoreOpen] = useState(false);
  const heroImageAspectRatio = language === "en" ? "2932 / 1080" : "2328 / 1006";
  const highlightedPhrase = highlightedDescriptionPhrases[language];
  const highlightedDescription = t.hero.description.includes(highlightedPhrase) ? t.hero.description.split(highlightedPhrase) : null;

  return (
    <section id="hero" className="relative overflow-hidden pt-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(215,149,54,0.13),transparent_28%),linear-gradient(180deg,#fff_0%,#fff_58%,#fbfbf8_100%)]" />
      <div className="section-shell flex min-h-[680px] flex-col items-center gap-0 py-10 sm:min-h-[760px] lg:py-14">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 w-full max-w-5xl text-center"
        >
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">{t.hero.title}</h1>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-muted sm:text-lg">
            {highlightedDescription ? (
              <>
                {highlightedDescription[0]}
                <strong className="font-semibold text-ink">{highlightedPhrase}</strong>
                {highlightedDescription[1]}
              </>
            ) : (
              t.hero.description
            )}
          </p>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-[min(calc(100vw-2rem),92rem)] max-w-none"
        >
          <div
            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-2 shadow-soft backdrop-blur-xl sm:p-3"
            style={{ aspectRatio: heroImageAspectRatio }}
          >
            <LocalizedImage
              imageKey="image4"
              alt={t.hero.imageAlt}
              fill
              sizes="(min-width: 1536px) 1472px, calc(100vw - 32px)"
              priority
              className="rounded-[1.55rem] object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="-mt-4 w-[calc(100%-1.5rem)] max-w-5xl rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-card backdrop-blur-xl sm:p-7 lg:p-8"
        >
          <div className="grid gap-4 border-b border-brand-orange/15 pb-6 lg:grid-cols-3">
            {t.hero.stats.map((stat) => (
              <div key={stat.title} className="rounded-2xl border border-brand-orange/20 bg-gradient-to-br from-[#f7ead6] via-[#fff8ed] to-white p-5 shadow-sm">
                <p className="text-xl font-semibold text-ink">{stat.title}</p>
                <p className="mt-2 text-sm font-semibold text-brand-teal">{stat.subtitle}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-7">
            <p className="inline-flex rounded-full border border-brand-orange/25 bg-white px-4 py-2 text-sm font-medium text-brand-orange shadow-sm">
              {t.hero.eyebrow}
            </p>

            <div className="mt-7 grid gap-3 text-sm leading-6 text-muted sm:grid-cols-2 lg:grid-cols-4">
              {t.hero.bullets.map((item) => (
                <span key={item} className="flex items-start gap-2">
                  <FiCheckCircle className="mt-1 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-brand-teal"
              >
                <FaGooglePlay className="h-4 w-4" aria-hidden="true" />
                {t.hero.playStore}
              </a>
              <button
                type="button"
                onClick={() => setIsAppStoreOpen(true)}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:border-brand-orange/50 hover:text-brand-teal"
              >
                <FaApple className="h-5 w-5" aria-hidden="true" />
                {t.hero.appStore}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {isAppStoreOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-soft">
            <button
              type="button"
              onClick={() => setIsAppStoreOpen(false)}
              className="focus-ring ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-muted transition hover:text-ink"
              aria-label={t.hero.close}
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </button>
            <FaApple className="mx-auto mt-2 h-10 w-10 text-ink" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-medium text-ink">{t.hero.appStoreSoonTitle}</h2>
            <p className="mt-3 leading-7 text-muted">{t.hero.appStoreSoonDescription}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
