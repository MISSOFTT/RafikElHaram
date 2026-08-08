"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiGlobe, FiLock, FiMenu, FiX } from "react-icons/fi";
import { useLanguage, type Language } from "@/lib/i18n";

const sectionRouteMap: Record<string, string> = {
  hero: "/",
  about: "/hakkimizda",
  features: "/ozellikler",
  gallery: "/galeri",
  contact: "/iletisim"
};

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/hakkimizda" },
  { key: "features", href: "/ozellikler" },
  { key: "gallery", href: "/galeri" },
  { key: "contact", href: "/iletisim" }
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
      if (pathname !== "/") return;

      const visible = Object.keys(sectionRouteMap)
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          return { id, top: Math.abs(element.getBoundingClientRect().top - 120) };
        })
        .filter(Boolean) as Array<{ id: string; top: number }>;

      const nearest = visible.sort((a, b) => a.top - b.top)[0];
      if (nearest) setActive(sectionRouteMap[nearest.id]);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${
        scrolled ? "border-b border-black/5 bg-white/88 shadow-sm backdrop-blur-xl" : "bg-white/72 backdrop-blur-md"
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between" aria-label={t.nav.navigation}>
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full" aria-label="Rafik Al Haram">
          <span className="relative h-12 w-12 overflow-hidden rounded-full border border-brand-orange/20 bg-white shadow-sm">
            <Image
              src="/brand/rafik-al-haram-logo.jpeg"
              alt=""
              fill
              sizes="48px"
              className="object-cover object-top"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-ink">Rafik Al Haram</span>
            <span className="block text-xs font-medium text-muted">{t.common.brandSubtitle}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-brand-orange/12 text-brand-orange" : "text-graphite hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <label className="focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-orange flex h-11 items-center gap-2 rounded-full border border-ink/10 bg-white px-3 text-sm font-semibold text-ink shadow-sm">
            <FiGlobe aria-hidden="true" className="h-4 w-4 text-brand-orange" />
            <span className="sr-only">{t.nav.language}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="h-full bg-transparent text-sm font-semibold text-ink outline-none"
              aria-label={t.nav.language}
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <Link
            href="/iletisim"
            className="focus-ring rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-teal"
          >
            {t.nav.demo}
          </Link>
          <Link
            href="/admin/giris"
            className="focus-ring rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-brand-orange hover:text-white"
          >
            Admin Paneli
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white text-ink lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
          aria-expanded={open}
        >
          {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="section-shell grid gap-2 py-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-sm font-semibold text-ink hover:bg-ink/5">
                {t.nav[item.key]}
              </Link>
            ))}
            <label className="mt-2 flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink">
              <FiGlobe aria-hidden="true" className="h-4 w-4 text-brand-orange" />
              <span className="sr-only">{t.nav.language}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="w-full bg-transparent outline-none"
                aria-label={t.nav.language}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <Link href="/iletisim" className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white">
              {t.nav.demo}
            </Link>
            <Link href="/admin/giris" className="flex items-center gap-2 rounded-xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink">
              <FiLock aria-hidden="true" />
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
