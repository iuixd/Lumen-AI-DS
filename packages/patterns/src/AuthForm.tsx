import { Stack, Card, CardContent, FormField, Input, Button, TextLink } from "@lumen/ui";

/** Enterprise pattern: sign-in / sign-up form shell used for every auth surface. */
export function AuthForm({
  mode = "sign-in",
  onSubmit
}: {
  mode?: "sign-in" | "sign-up";
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background-subtle)] p-6">
      <Card className="w-full max-w-sm">
        <CardContent>
          <form onSubmit={onSubmit}>
            <Stack gap={20}>
              <h1 className="text-headline-sm text-[var(--color-text-title)]">
                {mode === "sign-in" ? "Sign in" : "Create your account"}
              </h1>
              <FormField label="Work email" htmlFor="email" required>
                <Input id="email" name="email" type="email" required />
              </FormField>
              <FormField label="Password" htmlFor="password" required>
                <Input id="password" name="password" type="password" required minLength={8} />
              </FormField>
              <Button type="submit" className="w-full">
                {mode === "sign-in" ? "Sign in" : "Create account"}
              </Button>
              <p className="text-center text-body-sm text-[var(--color-text-muted)]">
                {mode === "sign-in" ? (
                  <>
                    Don't have an account? <TextLink href="/sign-up">Sign up</TextLink>
                  </>
                ) : (
                  <>
                    Already have an account? <TextLink href="/sign-in">Sign in</TextLink>
                  </>
                )}
              </p>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
