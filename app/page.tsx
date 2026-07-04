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
    title: "Joornaal nadiif ah",
    description: "Geli entry, stop loss, target, R multiple, dareen, qalad, notes, iyo screenshot si trade kasta kuu noqdo cashar.",
  },
  {
    icon: BarChart3,
    title: "Falanqayn dhab ah",
    description: "Arag waxa kuu shaqeeya: pair, strategy, session, direction, emotion, iyo mistake category.",
  },
  {
    icon: Database,
    title: "Xog SQL ah",
    description: "Trade data waxaa lagu kaydiyaa Supabase SQL, qof walbana wuxuu arkaa xogtiisa oo keliya.",
  },
  {
    icon: LockKeyhole,
    title: "Ammaan sare",
    description: "Broker password lama kaydiyo. Edge Journal waa manual journaling iyo trade analysis oo keliya.",
  },
];

const plans = ["Unlimited manual trades", "Reports la daabacan karo", "Dashboard iyo analytics", "Supabase SQL cloud sync"];
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
              "linear-gradient(90deg, var(--background) 0%, transparent 42%, var(--background) 100%), url('/brand/edge-logo-wide.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="market-grid absolute inset-0 -z-10 opacity-35" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="pt-8">
            <Badge variant="secondary" className="mb-5">Joornaalka trader-ka discipline-ka leh</Badge>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Ka dhig trading-kaaga mid la cabbiri karo, la hagaajin karo, lana guulaysan karo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Edge Journal wuxuu kaa caawinayaa inaad ka baxdo qiyaas iyo dareen. Trade kasta wuxuu noqdaa caddeyn:
              strategy, session, risk, qalad, iyo natiijo. Haddii aad rabto inaad noqoto trader nidaam leh, halkan ka bilow.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Maanta ma aha inaad trade badan gasho; waa inaad fahamtaa trade-kii saxda ahaa, sababtii uu u shaqeeyay,
              iyo qaladka kaa celinaya consistency-ga.
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
                  Qiimaha igala hadal WhatsApp
                  <MessageCircle className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-lg border p-3 shadow-2xl">
            <div className="rounded-md border bg-background/80 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">AI brand preview</p>
                  <h2 className="text-xl font-semibold">Edge Journal trader cockpit</h2>
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
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Nidaam kaa dhigaya trader is xisaabiya.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Haddii aadan qorin waxa aad sameyso, ma ogaan kartid waxa lagu hagaajinayo. Edge Journal wuxuu xogtaada u rogaa go'aan cad.
            </p>
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
              <CardDescription>Bil kasta si cad u arag faa'iidada, khasaaraha, iyo drawdown-ka.</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyPerformanceChart data={monthlyPerformance} />
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Calendar heatmap</CardTitle>
              <CardDescription>Ogow maalmaha ugu fiican, maalmaha khatarta ah, iyo pattern-ka consistency-gaaga.</CardDescription>
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
            <CardTitle className="text-3xl">Rabtaa Edge Journal kuu gaar ah?</CardTitle>
            <CardDescription>WhatsApp nagala soo xiriir si aad u hesho pricing, setup, iyo hagid ku saabsan isticmaalka journal-ka.</CardDescription>
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
                  WhatsApp igala soo xiriir
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
