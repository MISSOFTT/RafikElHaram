import type { Language } from "@/lib/i18n";

export type PresentationImageKey = `image${number}`;
export type PromoVideoKey = "intro";

const FALLBACK_LANGUAGE: Language = "tr";

const imageAvailability: Record<Language, ReadonlySet<number>> = {
  tr: new Set(Array.from({ length: 21 }, (_, index) => index + 1)),
  en: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14]),
  ar: new Set(Array.from({ length: 21 }, (_, index) => index + 1))
};

export function getLocalizedImageSrc(imageKey: PresentationImageKey, language: Language) {
  const match = imageKey.match(/^image(\d+)$/);
  const imageNumber = match ? Number(match[1]) : Number.NaN;
  const resolvedLanguage = imageAvailability[language].has(imageNumber) ? language : FALLBACK_LANGUAGE;

  return `/media/images/${resolvedLanguage}/${imageKey}.png`;
}

const youtubeVideoIds: Record<PromoVideoKey, Record<Language, string>> = {
  intro: {
    tr: "Ml80LXPGO7U",
    en: "Rnri3EtUSek",
    ar: "6WB6JfGiKpU"
  }
};

export function getLocalizedYouTubeEmbedSrc(videoKey: PromoVideoKey, language: Language) {
  const videoId = youtubeVideoIds[videoKey][language];

  return `https://www.youtube.com/embed/${videoId}`;
}
