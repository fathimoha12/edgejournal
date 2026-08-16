import { AppShell } from "@/components/shell/app-shell";
import { AppearanceSettings } from "@/components/appearance-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Profile, account assumptions, currency, and risk preferences.">
      <div className="grid gap-5 xl:grid-cols-2">
        <AppearanceSettings />

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Personalize the workspace connected to Supabase auth.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="Display name">
              <Input defaultValue="Pro Trader" />
            </Field>
            <Field label="Email">
              <Input type="email" defaultValue="trader@example.com" />
            </Field>
            <Field label="Timezone">
              <Select defaultValue="Africa/Nairobi">
                <option>Africa/Nairobi</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Asia/Tokyo</option>
              </Select>
            </Field>
            <Button className="w-fit">Save profile</Button>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Trading account settings</CardTitle>
            <CardDescription>Store journal assumptions only, never broker credentials.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="Account name">
              <Input defaultValue="Funded challenge account" />
            </Field>
            <Field label="Starting balance">
              <Input type="number" defaultValue="25000" />
            </Field>
            <Field label="Currency">
              <Select defaultValue="USD">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>KES</option>
                <option>JPY</option>
              </Select>
            </Field>
            <Button className="w-fit">Save account</Button>
          </CardContent>
        </Card>

        <Card className="glass-panel xl:col-span-2">
          <CardHeader>
            <CardTitle>Risk preferences</CardTitle>
            <CardDescription>Set defaults for forms and dashboard alerts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Field label="Default risk amount">
              <Input type="number" step="1" defaultValue="100" />
            </Field>
            <Field label="Default R:R target">
              <Input type="number" step="0.1" defaultValue="3" />
            </Field>
            <Field label="Max daily risk %">
              <Input type="number" step="0.1" defaultValue="3" />
            </Field>
            <Field label="Max weekly drawdown %">
              <Input type="number" step="0.1" defaultValue="6" />
            </Field>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
