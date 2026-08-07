"use client";

import { FormEvent, useRef, useState } from "react";
import { FiMapPin, FiMessageCircle, FiPhoneCall, FiSend } from "react-icons/fi";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { siteConfig } from "@/lib/siteConfig";

type FormStatus = "idle" | "success" | "error";

export function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const contactInfo = [
    { label: t.contact.labels.email, value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: FiMessageCircle },
    {
      label: t.contact.labels.phone,
      value: siteConfig.phone.display,
      href: `https://wa.me/${siteConfig.phone.whatsapp}`,
      external: true,
      icon: FiPhoneCall
    }
  ];
  const officeInfo = siteConfig.offices.map((office) => ({
    ...office,
    label: office.key === "istanbul" ? t.contact.labels.istanbul : t.contact.labels.erzurum,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const form = event.currentTarget;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      company: String(formData.get("company") || ""),
      message: ""
    };

    try {
      const response = await fetch("/api/demo-talep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || result?.ok !== true) {
        throw new Error("Demo request failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section-padding bg-[#fbfbf8]">
      <div className="section-shell">
        <Reveal>
          <SectionHeading align="left" eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={handleSubmit} className="mt-8 rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-7 lg:p-8">
            <div className="grid gap-4 lg:grid-cols-4">
              <label className="grid gap-2 text-sm font-semibold text-ink">
                {t.contact.labels.name}
                <input
                  name="name"
                  className="focus-ring rounded-2xl border border-ink/10 px-4 py-3 text-sm font-normal text-ink outline-none"
                  placeholder={t.contact.placeholders.name}
                  type="text"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-ink">
                {t.contact.labels.org}
                <input
                  name="company"
                  className="focus-ring rounded-2xl border border-ink/10 px-4 py-3 text-sm font-normal text-ink outline-none"
                  placeholder={t.contact.placeholders.org}
                  type="text"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-ink">
                {t.contact.labels.email}
                <input
                  name="email"
                  className="focus-ring rounded-2xl border border-ink/10 px-4 py-3 text-sm font-normal text-ink outline-none"
                  placeholder={t.contact.placeholders.email}
                  type="email"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-ink">
                {t.contact.labels.phone}
                <input
                  name="phone"
                  className="focus-ring rounded-2xl border border-ink/10 px-4 py-3 text-sm font-normal text-ink outline-none"
                  placeholder={t.contact.placeholders.phone}
                  type="tel"
                  required
                />
              </label>
            </div>
            {status === "success" ? (
              <p className="mt-4 rounded-2xl bg-brand-teal/10 px-4 py-3 text-sm font-semibold text-brand-teal">
                {t.contact.success}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {t.contact.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:-translate-y-0.5 hover:bg-[#c78328] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              <FiSend aria-hidden="true" />
              {isSubmitting ? t.contact.labels.sending : t.contact.labels.send}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
              <h3 className="text-sm font-semibold text-ink">{t.contact.labels.contactInfo}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex min-w-0 gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-orange/12 text-brand-orange">
                        <Icon aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{item.label}</p>
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="mt-1 inline-flex break-all text-sm text-muted transition hover:text-brand-orange"
                        >
                          {item.value}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {officeInfo.map((office) => (
                <a
                  key={office.key}
                  href={office.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group flex min-w-0 items-start gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-orange/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-orange/12 text-brand-orange">
                    <FiMapPin aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{office.label}</p>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-muted transition group-hover:text-brand-orange">{office.address}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
