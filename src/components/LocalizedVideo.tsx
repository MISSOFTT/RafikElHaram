"use client";

import { useMemo } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { PromoVideoKey } from "@/lib/media";
import { getLocalizedYouTubeEmbedSrc } from "@/lib/media";
import { useLanguage } from "@/lib/i18n";

type LocalizedVideoProps = Omit<ComponentPropsWithoutRef<"iframe">, "src"> & {
  videoKey: PromoVideoKey;
};

export function LocalizedVideo({ videoKey, title, ...props }: LocalizedVideoProps) {
  const { language } = useLanguage();
  const src = useMemo(() => getLocalizedYouTubeEmbedSrc(videoKey, language), [videoKey, language]);

  return <iframe key={`${videoKey}-${language}`} src={src} title={title} allowFullScreen {...props} />;
}
