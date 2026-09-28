import { z } from "zod";

// Request-body validation schemas. Shared so the client form and the server
// route validate identically from one source of truth.

export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(6);
export const SalutationSchema = z.enum(["MR", "MS", "MRS", "DR"]).optional();
export const RoleSchema = z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]);

export const NameSchema = z.object({
    firstName: z.string().min(2).max(30),
    middleName: z.string().min(2).max(30).optional(),
    lastName: z.string().min(2).max(30),
});

export const RegisterRequestBodySchema = NameSchema.extend({
    email: EmailSchema,
    password: PasswordSchema,
    salutation: SalutationSchema,
});

export const LoginRequestBodySchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
});

export const CreateWorkspaceRequestBodySchema = z.object({
    name: z.string().min(2).max(30),
    member: z.object({
        userId: z.string().uuid(),
        role: RoleSchema,
    }),
});

export type RegisterRequestBody = z.infer<typeof RegisterRequestBodySchema>;
export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>;
export type CreateWorkspaceRequestBody = z.infer<
    typeof CreateWorkspaceRequestBodySchema
>;
export type Salutation = z.infer<typeof SalutationSchema>;
export type Role = z.infer<typeof RoleSchema>;
