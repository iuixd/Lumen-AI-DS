import type { ReactNode } from "react";
import { Container, Stack, Card, CardHeader, CardTitle, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from "@lumen/ui";

export interface SettingsSection {
  id: string;
  label: string;
  content: ReactNode;
}

/** Enterprise pattern: tabbed settings page (Profile / Team / Billing / Security / ...).
 * Every settings-style screen should be a list of SettingsSection entries
 * rendered through this shell, so navigation and spacing stay consistent. */
export function SettingsPage({ title, sections }: { title: string; sections: SettingsSection[] }) {
  return (
    <Container size="md">
      <Stack gap={24}>
        <h1 className="text-headline-sm text-[var(--color-text-title)]">{title}</h1>
        <Tabs defaultValue={sections[0]?.id}>
          <TabsList>
            {sections.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{s.label}</CardTitle>
                </CardHeader>
                <CardContent>{s.content}</CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </Stack>
    </Container>
  );
}
