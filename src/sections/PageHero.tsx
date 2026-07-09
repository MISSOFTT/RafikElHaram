import { Reveal } from "@/components/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-[linear-gradient(180deg,#fff_0%,#fbfbf8_100%)] pt-32">
      <div className="section-shell py-16 sm:py-20">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">{eyebrow}</p>
          <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
