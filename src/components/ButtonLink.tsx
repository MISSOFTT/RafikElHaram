import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowRight } from "react-icons/fi";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const base =
    "focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300";
  const styles =
    variant === "primary"
      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/25 hover:-translate-y-0.5 hover:bg-[#c78328]"
      : "border border-ink/10 bg-white text-ink hover:-translate-y-0.5 hover:border-brand-orange/50 hover:text-brand-teal";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
      <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
