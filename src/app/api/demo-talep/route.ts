import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/siteConfig";

type DemoRequest = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

const requiredFields: Array<keyof Pick<DemoRequest, "name" | "email" | "phone">> = ["name", "email", "phone"];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DemoRequest;
    const data = {
      name: clean(body.name),
      email: clean(body.email),
      phone: clean(body.phone),
      company: clean(body.company),
      message: clean(body.message)
    };

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Lütfen zorunlu alanları doldurun." }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: "Mail ayarları eksik. Lütfen SMTP bilgilerini kontrol edin." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const recipient = MAIL_TO || siteConfig.email;
    const from = MAIL_FROM || SMTP_USER;
    const text = [
      "Yeni demo talebi geldi.",
      "",
      `Ad Soyad: ${data.name}`,
      `E-posta: ${data.email}`,
      `Telefon: ${data.phone}`,
      `Firma: ${data.company || "-"}`,
      `Mesaj: ${data.message || "-"}`
    ].join("\n");

    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: data.email,
      subject: "Yeni Demo Talebi",
      text
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Demo talebi mail hatası:", error);
    return NextResponse.json({ error: "Demo talebi gönderilirken bir hata oluştu." }, { status: 500 });
  }
}
