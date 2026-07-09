"use client";

import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { useLanguage } from "@/lib/i18n";

export function FloatingTrialButton() {
  const { t } = useLanguage();

  return (
    <Link
      href="/planlar"
      className="focus-ring fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-brand-orange px-6 py-4 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#c57f24] sm:bottom-6 sm:right-6 sm:px-7 sm:py-4"
      aria-label={t.common.viewPackages}
    >
      <FiLayers aria-hidden="true" className="h-5 w-5" />
      <span>{t.common.viewPackages}</span>
    </Link>
  );
}
