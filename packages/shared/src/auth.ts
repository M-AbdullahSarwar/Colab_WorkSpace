import { SignJWT, jwtVerify } from "jose";

export interface AuthTokenPayload {
  userId: string;
}

function secret(): Uint8Array {
  const value = process.env.JWT_SECRET;
  if (!value) {
    // Fail loudly rather than signing/verifying with an empty/garbage key.
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(value);
}

export async function signToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret());
  return { userId: payload.userId as string };
}
