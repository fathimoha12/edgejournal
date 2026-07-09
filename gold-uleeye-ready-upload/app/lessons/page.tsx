import { AlertTriangle, BookOpenCheck, CandlestickChart, CheckCircle2, Clock3, Layers3, Repeat2, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const lessonSteps = [
  {
    number: "01",
    title: "Daily waxaa laga fiiriyaa laba scenario",
    icon: BookOpenCheck,
    summary: "Marka hore daily bias-ka ha caddaado. Labada waddo ee muhiimka ah waa Daily IRL -> ERL + 1H TSQ ama Daily ERL -> IRL + 1H TSQ.",
    example: "Haddii price-ku daily IRL ka tago oo ERL u socda, 1H TSQ waa inuu kuu caddeeyaa halka entry-ga laga raadinayo.",
  },
  {
    number: "02",
    title: "SMT goorma ayuu valid noqdaa?",
    icon: ShieldCheck,
    summary: "SMT wuxuu noqdaa valid marka uu la socdo Model #1. SMT keliya ma aha signal ku filan.",
    example: "Haddii EUR/USD lower low sameeyo laakiin GBP/USD uusan sameyn, sug in Model #1 uu ku xirmo ka hor go'aanka.",
  },
  {
    number: "03",
    title: "Silver SMT waa inuu la socdaa Model #1",
    icon: Layers3,
    summary: "Silver SMT haddii uu dhaco, waxaa la raadiyaa in Model #1 laga helo isla silver-ka ama setup-ka la xiriira.",
    example: "Silver SMT oo keliya ha gelin. Haddii Model #1 uusan raacin, setup-ka wuxuu noqon karaa weak.",
  },
  {
    number: "04",
    title: "Waqtiga ugu caansan 1H displacement",
    icon: Clock3,
    summary: "1H displacement inta badan wuxuu fiican yahay marka major liquidity, DOL, ama HTF key level la qaado.",
    example: "Marka high/low muhiim ah la sweep gareeyo, eeg haddii candle xoog leh uu direction cusub bilaabayo.",
  },
  {
    number: "05",
    title: "PDL/H + SMT + 1H Model #1",
    icon: TrendingUp,
    summary: "Haddii PDL ama PDH la qaado, SMT yimaado, kadib 1H Model #1 TSQ sameeyo, waxaa dhici kara jiho badalasho.",
    example: "PDH sweep kadib SMT bearish ah iyo 1H displacement hoos u socda waxay bixin kartaa reversal model.",
  },
  {
    number: "06",
    title: "1H TSQ goorma ayuu dhammaadaa?",
    icon: Target,
    summary: "1H TSQ wuxuu dhammaadaa marka major liquidity la qaado. Halkaas ayaa review iyo exit logic laga fiiriyaa.",
    example: "Haddii target-ku yahay external liquidity, TSQ ha sii socdo ilaa liquidity-gaas la taabto ama structure-ku jabo.",
  },
  {
    number: "07",
    title: "Daily SMT sax ma yahay?",
    icon: CheckCircle2,
    summary: "Daily SMT waxaa lagu xaqiijiyaa in pair-ka SMT sameeyay uu haddana Model #1 sameeyo si SMT valid u noqdo.",
    example: "SMT-ka ha ku xirin pair kale oo keliya. Pair-ka setup-ka bixinaya waa inuu model-ka dhammaystiraa.",
  },
  {
    number: "08",
    title: "Pullback trade goorma la qaataa?",
    icon: Repeat2,
    summary: "Pullback trade waxaa la raadiyaa marka major liquidity la qaado kadibna 1H TSQ la sameeyo.",
    example: "Liquidity sweep kadib displacement yimaado, pullback-ka ku laabo fair price ama structure zone si risk-ku u yaraado.",
  },
  {
    number: "09",
    title: "9AM inside bar CRT",
    icon: CandlestickChart,
    summary: "9AM inside bar CRT inta badan waa in la ilaaliyaa ilaa uu si dhab ah inside bar u noqdo.",
    example: "Ha degdegin. Sug high iyo low-ga inside bar-ka, kadib eeg dhinaca liquidity-ga la qaadayo.",
  },
  {
    number: "10",
    title: "Model #1 gudaha inside bar",
    icon: AlertTriangle,
    summary: "Haddii Model #1 lagu sameeyo 1H inside bar, sug in inside bar high ama low la qaado.",
    example: "Inside bar-ka ha noqdo xadka go'aanka. High/low sweep kadib ayaa entry confirmation la raadinayaa.",
  },
];

const playbookExamples = [
  {
    title: "Example A: Daily IRL -> ERL + 1H TSQ",
    bias: "Daily wuxuu ka dhaqaaqayaa internal liquidity una socda external liquidity.",
    steps: ["Daily draw-on-liquidity caddee", "Sug 1H displacement", "Geli pullback ka dib", "Target garee external liquidity"],
    result: "Setup-ku waa valid haddii 1H TSQ uu weli u socdo target-ka major liquidity.",
  },
  {
    title: "Example B: PDH sweep + SMT + Model #1",
    bias: "Price-ku wuxuu qaaday previous day high kadibna SMT ayaa muujiyay weakness.",
    steps: ["PDH sweep calaamadee", "SMT bearish xaqiiji", "Sug 1H Model #1", "Entry ka raadi pullback"],
    result: "Jiho badalasho waa la tixgelin karaa marka displacement-ku cad yahay.",
  },
  {
    title: "Example C: 9AM inside bar",
    bias: "Market-ku wuxuu ku jiraa compression, high/low yar ayaa go'aanka xiga bixinaya.",
    steps: ["Calaamadee 9AM candle", "Sug inside bar dhab ah", "Ha gelin ka hor sweep", "Model #1 ku xaqiiji entry-ga"],
    result: "Trade-ka waxaa la qaataa kadib inside bar high ama low la qaado.",
  },
];

export default function LessonsPage() {
  return (
    <AppShell title="Lessons" subtitle="ABDIGUREY playbook with candle examples, SMT validation, TSQ, and backtesting notes.">
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-2xl">
          <div className="market-grid absolute inset-0 opacity-25" />
          <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">ABDIGUREY lesson</Badge>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">SMT, Model #1, TSQ, liquidity, and inside bar playbook.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Casharkan wuxuu kuu kala saaraya marka SMT valid yahay, goorta 1H TSQ la raaco, sida major liquidity loo isticmaalo,
                iyo goorta pullback ama inside bar trade la sugo. U isticmaal backtesting iyo journal review, ma aha signal degdeg ah.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Daily IRL -> ERL", "Daily ERL -> IRL", "1H TSQ", "SMT + Model #1", "PDL/H", "9AM CRT"].map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            <CandleScenario title="1H TSQ candle map" mode="bullish" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {lessonSteps.map((step) => (
            <Card key={step.number} className="glass-panel">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <step.icon className="size-5" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">{step.number}</Badge>
                    <CardTitle className="leading-6">{step.title}</CardTitle>
                    <CardDescription className="mt-2 leading-6">{step.summary}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-background/45 p-3 text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Tusaale: </span>
                  {step.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {playbookExamples.map((example, index) => (
            <Card key={example.title} className="glass-panel overflow-hidden">
              <CardHeader>
                <Badge variant={index === 1 ? "negative" : "positive"} className="mb-2">Candle example</Badge>
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.bias}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <CandleScenario title={index === 1 ? "Sweep then reversal" : index === 2 ? "Inside bar trigger" : "Expansion to liquidity"} mode={index === 1 ? "bearish" : "bullish"} compact />
                <div className="grid gap-2">
                  {example.steps.map((step, stepIndex) => (
                    <div key={step} className="flex items-center gap-2 text-sm">
                      <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">{stepIndex + 1}</span>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="rounded-md border bg-background/50 p-3 text-sm leading-6 text-muted-foreground">{example.result}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Backtesting checklist</CardTitle>
            <CardDescription>Casharkan ku tijaabi chart replay ama historical screenshots ka hor intaadan live risk gelin.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              "Daily scenario ma cad yahay: IRL -> ERL ama ERL -> IRL?",
              "Major liquidity, DOL, PDL/H, ama HTF KL ma la qaaday?",
              "SMT ma la socdaa Model #1 mise waa SMT keliya?",
              "1H TSQ ma socdaa mise major liquidity ayuu dhammeeyay?",
              "Pullback ma yimid kadib displacement, mise entry degdeg ah baa la galay?",
              "Inside bar high/low ma la qaaday ka hor entry confirmation?",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-md border bg-background/45 p-3 text-sm leading-6">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-lg border bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
          Educational note: casharkani waa waxbarasho iyo backtesting framework. Ma aha financial advice ama signal live trade ah.
        </div>
      </div>
    </AppShell>
  );
}

function CandleScenario({ title, mode, compact = false }: { title: string; mode: "bullish" | "bearish"; compact?: boolean }) {
  const bullish = mode === "bullish";
  const candles = bullish
    ? [
        { h: 44, top: 58, color: "bg-red-500" },
        { h: 82, top: 38, color: "bg-white" },
        { h: 54, top: 56, color: "bg-red-500" },
        { h: 96, top: 26, color: "bg-primary" },
        { h: 72, top: 42, color: "bg-white" },
        { h: 102, top: 22, color: "bg-primary" },
      ]
    : [
        { h: 94, top: 24, color: "bg-white" },
        { h: 64, top: 46, color: "bg-primary" },
        { h: 102, top: 20, color: "bg-primary" },
        { h: 76, top: 42, color: "bg-white" },
        { h: 118, top: 12, color: "bg-primary" },
        { h: 70, top: 48, color: "bg-primary" },
      ];

  return (
    <div className="overflow-hidden rounded-lg border bg-black p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <Badge variant={bullish ? "positive" : "negative"}>{bullish ? "Liquidity run" : "Sweep reversal"}</Badge>
      </div>
      <div className={compact ? "relative h-36" : "relative h-56"}>
        <div className="absolute inset-x-0 top-6 h-px bg-white/15" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <div className="absolute inset-x-0 bottom-8 h-px bg-white/15" />
        <div className="absolute left-4 right-4 top-8 border-t border-dashed border-primary/70" />
        <div className="absolute bottom-3 left-4 right-4 rounded-md border border-primary/40 bg-primary/15 px-3 py-2 text-xs text-white">
          {bullish ? "Pullback zone after displacement" : "PDH/PDL sweep, wait for model confirmation"}
        </div>
        <div className="absolute left-8 right-8 top-8 flex h-32 items-start justify-between">
          {candles.map((candle, index) => (
            <div key={`${candle.h}-${index}`} className="relative h-36 w-8">
              <div className="absolute left-1/2 top-0 h-32 w-px -translate-x-1/2 bg-white/70" />
              <div className={`absolute left-1/2 w-6 -translate-x-1/2 rounded-sm ${candle.color}`} style={{ height: candle.h, top: candle.top }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
