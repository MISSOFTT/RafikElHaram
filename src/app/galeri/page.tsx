import type { Metadata } from "next";
import { Gallery } from "@/sections/Gallery";
import { LocalizedPageHero } from "@/sections/LocalizedPageHero";
import { VideoGallery } from "@/sections/VideoGallery";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Rafik Al Haram uygulamasının ekran görüntülerini, videolarını ve modül arayüzlerini inceleyin."
};

export default function GalleryPage() {
  return (
    <>
      <LocalizedPageHero page="gallery" />
      <VideoGallery />
      <Gallery />
    </>
  );
}
