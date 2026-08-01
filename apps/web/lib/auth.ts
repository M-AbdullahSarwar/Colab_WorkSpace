import "server-only"; // first line of lib/auth.ts

import bcrypt from "bcryptjs";
import { prisma } from "@colab/db";
import { signToken } from "@colab/shared/auth";
import type {
  RegisterRequestBody,
  LoginRequestBody,
} from "@colab/shared/schema";

// --- Business-logic layer (HTTP-agnostic) -------------------------------
// These functions know nothing about Request/Response or status codes, so
// they can be reused by a socket handler / CLI / test later. They throw the
// errors below; the route maps each to an HTTP status.

export class EmailTakenError extends Error {
  constructor() {
    super("This email is already in use");
    this.name = "EmailTakenError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

export async function registerUser(input: RegisterRequestBody) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) throw new EmailTakenError();

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      salutation: input.salutation,
      firstName: input.firstName,
      middleName: input.middleName,
      lastName: input.lastName,
    },
  });

  return {
    user: {
      email: user.email,
      id: user.id,
    },
  };
}

export async function authenticateUser(input: LoginRequestBody) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (!user) throw new InvalidCredentialsError();

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordValid) throw new InvalidCredentialsError();

  const token = await signToken({ userId: user.id });
  return {
    token,
    user: {
      email: user.email,
      id: user.id,
      salutation: user.salutation,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    },
  };
}
