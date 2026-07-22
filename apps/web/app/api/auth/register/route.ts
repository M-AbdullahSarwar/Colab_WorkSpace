import { RegisterRequestBodySchema } from "@colab/shared/schema";
import { registerUser, EmailTakenError } from "@/lib/auth";

// HTTP boundary only: validate input -> call service -> map result/errors to a response.
export async function POST(req: Request) {
  const parsed = RegisterRequestBodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  try {
    const { user } = await registerUser(parsed.data);
    return Response.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof EmailTakenError) {
      return Response.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
