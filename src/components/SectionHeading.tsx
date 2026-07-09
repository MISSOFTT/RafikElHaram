type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverted?: boolean;
};

export function SectionHeading({ eyebrow, title, description, align = "center", inverted = false }: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">{eyebrow}</p>
      ) : null}
      <h2 className={`text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl ${inverted ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-8 sm:text-lg ${inverted ? "text-white/68" : "text-muted"}`}>{description}</p>
      ) : null}
    </div>
  );
}
