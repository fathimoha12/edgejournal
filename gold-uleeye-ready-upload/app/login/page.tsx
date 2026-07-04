"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CandlestickChart, Loader2, LockKeyhole, UserPlus } from "lucide-react";
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
  return "Supabase auth error ayaa dhacay. Hubi URL/key-ga iyo redeploy-ga.";
}

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"sign-in" | "sign-up">("sign-in");
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus("");

    try {
      const supabase = getSupabaseBrowserClient();
      const response =
        mode === "sign-in"
          ? await withTimeout(
              supabase.auth.signInWithPassword({ email: email.trim(), password }),
              "Sign in wuu waqtigiisii dhaafay. Hubi Supabase URL/key-ga Vercel, kadib redeploy samee.",
            )
          : await withTimeout(
              supabase.auth.signUp({ email: email.trim(), password }),
              "Register wuu waqtigiisii dhaafay. Hubi Supabase URL/key-ga Vercel, kadib redeploy samee.",
            );

      if (response.error) {
        setStatus(response.error.message);
      } else if (mode === "sign-up" && !response.data.session) {
        setStatus("Account waa la abuuray. Haddii email confirmation kuu shidan yahay, email-ka xaqiiji kadibna sign in samee.");
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
            <CardDescription>Sign in ama register hal meel. Trade data waxaa lagu kaydiyaa Supabase SQL database, ma aha browser storage.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 rounded-lg border bg-background/45 p-1">
              <Button type="button" variant={mode === "sign-in" ? "default" : "ghost"} onClick={() => setMode("sign-in")}>
                <LockKeyhole className="size-4" />
                Sign in
              </Button>
              <Button type="button" variant={mode === "sign-up" ? "default" : "ghost"} onClick={() => setMode("sign-up")}>
                <UserPlus className="size-4" />
                Register
              </Button>
            </div>

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
                {loading ? <Loader2 className="size-4 animate-spin" /> : mode === "sign-in" ? <LockKeyhole className="size-4" /> : <UserPlus className="size-4" />}
                {mode === "sign-in" ? "Sign in" : "Register account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "sign-in" ? "Account ma haysatid?" : "Account hore ma leedahay?"}{" "}
              <button className="font-medium text-primary" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>
                {mode === "sign-in" ? "Register" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
