import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, Check, Database, LockKeyhole, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";
import { MonthlyPerformanceChart } from "@/components/charts/monthly-performance-chart";
import { CalendarHeatmap } from "@/components/calendar-heatmap";
import { calendarDays, equityCurve, monthlyPerformance } from "@/lib/mock-data";

const features = [
  {
    icon: BookOpenCheck,
    title: "Execution journal",
    description: "Track entries, stops, targets, R multiple, psychology, mistakes, notes, and chart screenshots.",
  },
  {
    icon: BarChart3,
    title: "Trader analytics",
    description: "See performance by pair, strategy, session, direction, emotion, and mistake category.",
  },
  {
    icon: Database,
    title: "Supabase ready",
    description: "Auth, database tables, and row-level security are prepared for a private multi-user product.",
  },
  {
    icon: LockKeyhole,
    title: "No broker passwords",
    description: "Edge Journal is a journal only. It never stores broker credentials or trading account passwords.",
  },
];

const plans = ["Unlimited manual trades", "Dashboard and analytics", "Supabase cloud sync", "Vercel free plan ready"];
const whatsappLink = "https://wa.me/252633454984?text=Salaam%2C%20waxaan%20rabaa%20Edge%20Journal%20pricing%20iyo%20setup.";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-30 border-b bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark />
            <span className="font-semibold tracking-tight">Edge Journal</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#preview" className="hover:text-foreground">Dashboard</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Launch app
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 -z-10 opacity-22"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--background) 0%, transparent 38%, var(--background) 100%), url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1800&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="market-grid absolute inset-0 -z-10 opacity-35" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="pt-8">
            <Badge variant="secondary" className="mb-5">Professional forex trade journal</Badge>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Build discipline. Protect capital. Prove your edge.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Edge Journal turns every trade into evidence. Track your setups, sessions, psychology, and mistakes,
              then use reports to see what deserves your risk and what needs to be removed from your plan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  WhatsApp pricing
                  <MessageCircle className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-lg border p-3 shadow-2xl">
            <div className="rounded-md border bg-background/80 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Live product preview</p>
                  <h2 className="text-xl font-semibold">Equity and execution cockpit</h2>
                </div>
                <Badge variant="positive">+12.8% MTD</Badge>
              </div>
              <div className="mb-4 overflow-hidden rounded-md border bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/edge-logo-wide.png" alt="Edge Journal brand" className="h-32 w-full object-cover" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Net P/L", "$9,648"],
                  ["Win rate", "62.4%"],
                  ["Profit factor", "2.18"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border bg-card/70 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <EquityCurveChart data={equityCurve} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4">Edge clarity</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything a discretionary trader expects.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="glass-panel">
                <CardHeader>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Monthly performance</CardTitle>
              <CardDescription>Compare gross wins and drawdowns without spreadsheet drift.</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyPerformanceChart data={monthlyPerformance} />
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Calendar heatmap</CardTitle>
              <CardDescription>Spot streaks, high-risk days, and consistency patterns.</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarHeatmap days={calendarDays} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <Card className="glass-panel mx-auto max-w-3xl">
          <CardHeader className="text-center">
            <Badge variant="secondary" className="mx-auto mb-3">Pricing placeholder</Badge>
            <CardTitle className="text-3xl">Get Edge Journal setup support.</CardTitle>
            <CardDescription>Contact us on WhatsApp for pricing, setup help, and trader journal onboarding.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan} className="flex items-center gap-3 rounded-md border bg-background/45 p-3">
                  <Check className="size-4 text-primary" />
                  <span className="text-sm">{plan}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild size="lg">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Contact on WhatsApp
                  <MessageCircle className="size-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
