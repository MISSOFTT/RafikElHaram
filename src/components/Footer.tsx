"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiMapPin, FiMessageCircle, FiPhoneCall } from "react-icons/fi";
import { useLanguage } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";

const socials = [
  { label: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
  { label: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
  { label: "YouTube", icon: FaYoutube, href: "https://youtube.com" }
];

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/hakkimizda" },
  { key: "features", href: "/ozellikler" },
  { key: "plans", href: "/planlar" },
  { key: "gallery", href: "/galeri" },
  { key: "contact", href: "/iletisim" }
] as const;

export function Footer() {
  const { t } = useLanguage();
  const contactInfo = [
    { label: t.contact.labels.email, value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: FiMessageCircle },
    {
      label: t.contact.labels.phone,
      value: siteConfig.phone.display,
      href: `https://wa.me/${siteConfig.phone.whatsapp}`,
      external: true,
      icon: FiPhoneCall
    },
    { label: t.contact.labels.istanbul, value: siteConfig.offices[0].address, icon: FiMapPin }
  ];

  return (
    <footer className="border-t border-ink/10 bg-[#fbfbf9]">
      <div className="section-shell py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-full border border-brand-orange/20 bg-white shadow-sm">
                <Image src="/brand/rafik-al-haram-logo.jpeg" alt="" fill sizes="48px" className="object-cover object-top" />
              </span>
              <span>
                <span className="block text-base font-bold text-ink">Rafik Al Haram</span>
                <span className="block text-sm text-muted">{t.footer.subtitle}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">{t.footer.description}</p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:-translate-y-0.5 hover:border-brand-orange hover:text-brand-orange"
                    aria-label={social.label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-ink">{t.footer.quickLinks}</h2>
            <ul className="mt-5 grid gap-3 text-sm text-muted">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-brand-orange">
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-ink">{t.footer.contact}</h2>
            <ul className="mt-5 grid gap-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex gap-3 text-sm text-muted">
                    <Icon className="mt-1 h-4 w-4 text-brand-orange" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-ink">{item.label}</span>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="transition hover:text-brand-orange"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-ink/10 pt-6 text-center text-sm text-muted sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:text-left">
          <p>{t.footer.rights}</p>
          <a
            href="https://missoft.com.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring relative mx-auto block h-12 w-36 transition hover:opacity-80 sm:h-14 sm:w-44"
            aria-label="MIS Soft web sitesini aç"
          >
            <Image src="/brand/missoft-logo.svg" alt="MIS Soft" fill sizes="176px" className="object-contain" />
          </a>
          <p className="sm:text-right">{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
