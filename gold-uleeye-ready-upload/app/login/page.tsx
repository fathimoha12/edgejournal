"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CandlestickChart, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const authTimeoutMs = 15000;

function withTimeout<T>(promise: Promise<T>, message: string) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), authTimeoutMs);
    }),
  ]);
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Authentication setup error. Check the app keys and deploy again.";
}

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const response = await withTimeout(
        supabase.auth.signInWithPassword({ email: email.trim(), password }),
        "Sign in timed out. Check the app keys in Vercel, then deploy again.",
      );

      if (response.error) {
        setStatus(response.error.message);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setStatus(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to landing
        </Link>

        <Card className="glass-panel">
          <CardHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CandlestickChart className="size-5" />
            </div>
            <CardTitle>Edge Journal account</CardTitle>
            <CardDescription>Sign in with an account created by the Edge Journal owner.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="trader@example.com" />
              </div>
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>

              {status ? <p className="rounded-md border bg-background/50 p-3 text-sm text-muted-foreground">{status}</p> : null}

              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
