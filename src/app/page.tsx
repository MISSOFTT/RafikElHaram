import { About } from "@/sections/About";
import { Advantages } from "@/sections/Advantages";
import { Contact } from "@/sections/Contact";
import { FAQ } from "@/sections/FAQ";
import { Features } from "@/sections/Features";
import { Gallery } from "@/sections/Gallery";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";
import { VideoGallery } from "@/sections/VideoGallery";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Advantages />
      <HowItWorks />
      <Gallery limit={6} />
      <VideoGallery />
      <FAQ />
      <Contact />
    </>
  );
}
