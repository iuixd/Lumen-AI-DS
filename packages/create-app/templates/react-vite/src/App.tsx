import { useState } from "react";
import { Badge, Button, Card, CardHeader, CardTitle, Container, Input, Stack } from "@lumen/ui";

export function App() {
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-[var(--color-background-default)] py-16">
      <Container size="md">
        <Card>
          <CardHeader>
            <CardTitle>Build your AI SaaS product</CardTitle>
            <Badge tone="brand">AI Workspace</Badge>
          </CardHeader>
          <Stack gap={16}>
            <p className="text-body-md text-[var(--color-text-muted)]">
              This starter is wired to the local Lumen AI Design System via pnpm workspace
              dependencies — edit any package under <code>packages/</code> and see it update here.
            </p>
            <Stack direction="row" gap={8} align="center">
              <Input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask the AI to draft a customer onboarding flow…"
                aria-label="AI prompt"
              />
              <Button variant="primary" onClick={() => setPrompt("")}>
                Generate
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </main>
  );
}
