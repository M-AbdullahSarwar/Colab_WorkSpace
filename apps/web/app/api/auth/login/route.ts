import { LoginRequestBodySchema } from "@colab/shared/schema";
import { authenticateUser, InvalidCredentialsError } from "@/lib/auth";

// HTTP boundary only: validate input -> call service -> map result/errors to a response.
export async function POST(req: Request) {
  const parsed = LoginRequestBodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  try {
    const { token, user } = await authenticateUser(parsed.data);
    return Response.json({ token, user });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return Response.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }
}
