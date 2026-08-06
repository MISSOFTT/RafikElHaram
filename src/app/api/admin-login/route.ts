import { NextRequest, NextResponse } from "next/server";
import { signAdminSession } from "@/lib/adminSession";

const backendBaseUrl = (process.env.UMRE_API_BASE_URL || "http://37.148.210.227:7253/api").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await fetch(`${backendBaseUrl}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const text = await response.text();
    const nextResponse = new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" }
    });

    if (response.ok) {
      const user = JSON.parse(text) as { id?: number; firmaId?: number; grupId?: number };
      nextResponse.cookies.set("rafik_admin_session", signAdminSession(user), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 8
      });
    }

    return nextResponse;
  } catch {
    return NextResponse.json({ message: "Sunucuya ulasilamadi. Lutfen daha sonra tekrar deneyin." }, { status: 502 });
  }
}
