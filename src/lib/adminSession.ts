import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export type AdminSessionUser = {
  id?: number;
  firmaId?: number;
  grupId?: number;
  kullaniciTipi?: number;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
};

const runtimeSecret = randomBytes(32).toString("base64url");

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || runtimeSecret;
}

export function signAdminSession(user: AdminSessionUser) {
  const secret = getSecret();
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(value?: string) {
  if (!value) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const secret = getSecret();
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSessionUser;
  } catch {
    return null;
  }
}
