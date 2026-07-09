"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useMemo } from "react";
import type { PresentationImageKey } from "@/lib/media";
import { getLocalizedImageSrc } from "@/lib/media";
import { useLanguage } from "@/lib/i18n";

type LocalizedImageProps = Omit<ImageProps, "src"> & {
  imageKey: PresentationImageKey;
};

export function LocalizedImage({ imageKey, alt, ...props }: LocalizedImageProps) {
  const { language } = useLanguage();
  const src = useMemo(() => getLocalizedImageSrc(imageKey, language), [imageKey, language]);

  return <Image {...props} key={`${imageKey}-${language}`} src={src} alt={alt} />;
}
