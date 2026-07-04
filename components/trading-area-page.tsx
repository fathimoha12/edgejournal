"use client";

import * as React from "react";
import { ArrowUpRight, BadgeDollarSign, Download, Eye, Percent, Printer, Sigma, Target, TrendingDown, X } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseTrades } from "@/lib/trade-data";
import { directions, results, sessions, type Trade, type TradingArea } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

const playbooks: Record<TradingArea, string[]> = {
  Backtesting: ["Screenshot every model", "Tag multiple strategies", "Record invalidations", "Compare planned 3RR vs outcome"],
  "Free Trial / Demo Challenge": ["Trade demo rules only", "Keep daily risk clean", "Mark emotional errors", "Review every SL before next session"],
  "Funded Challenge": ["Protect drawdown", "Only A+ confirmations", "No broker credentials stored", "Journal before scaling risk"],
  "Account Challenge": ["Track account phase", "Respect 3RR target", "Avoid revenge trades", "Upload chart proof for each trade"],
};

const emptyFilters = {
  query: "",
  dateFrom: "",
  dateTo: "",
  session: "all",
  result: "all",
  direction: "all",
};

export function TradingAreaPage({ area, title, subtitle }: { area: TradingArea; title: string; subtitle: string }) {
  const { trades, accountEmail, loading, error } = useSupabaseTrades();
  const [filters, setFilters] = React.useState(emptyFilters);
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);
  const areaTrades = trades.filter((trade) => trade.area === area);
  const closedTrades = areaTrades.filter((trade) => trade.result !== "Open");
  const tp = areaTrades.filter((trade) => trade.result === "TP").length;
  const sl = areaTrades.filter((trade) => trade.result === "SL").length;
  const pnl = areaTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const winRate = closedTrades.length ? (tp / closedTrades.length) * 100 : 0;
  const averageR = areaTrades.length ? areaTrades.reduce((sum, trade) => sum + trade.rMultiple, 0) / areaTrades.length : 0;

  const filteredTrades = areaTrades.filter((trade) => {
    const query = filters.query.toLowerCase();
    const searchable = [trade.pair, trade.strategy.join(" "), trade.session, trade.result, trade.direction, trade.notes, trade.mistake, trade.emotion]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!filters.dateFrom || trade.date >= filters.dateFrom) &&
      (!filters.dateTo || trade.date <= filters.dateTo) &&
      (filters.session === "all" || trade.session === filters.session) &&
      (filters.result === "all" || trade.result === filters.result) &&
      (filters.direction === "all" || trade.direction === filters.direction)
    );
  });

  const sessionStats = sessions.map((session) => {
    const sessionTrades = areaTrades.filter((trade) => trade.session === session);
    const sessionClosed = sessionTrades.filter((trade) => trade.result !== "Open");
    const sessionTp = sessionTrades.filter((trade) => trade.result === "TP").length;
    const sessionSl = sessionTrades.filter((trade) => trade.result === "SL").length;
    return {
      session,
      trades: sessionTrades.length,
      tp: sessionTp,
      sl: sessionSl,
      winRate: sessionClosed.length ? (sessionTp / sessionClosed.length) * 100 : 0,
    };
  });

  function exportCsv() {
    const rows = [
      ["Date", "Pair", "Direction", "Session", "Strategies", "Result", "R Multiple", "P/L", "Mistake", "Emotion"],
      ...filteredTrades.map((trade) => [
        trade.date,
        trade.pair,
        trade.direction,
        trade.session,
        trade.strategy.join(" + "),
        trade.result,
        `${trade.rMultiple.toFixed(2)}R`,
        String(trade.profitLoss),
        trade.mistake,
        trade.emotion,
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="grid gap-5">
        <Card className="glass-panel">
          <CardContent className="py-4 text-sm text-muted-foreground">
            {loading
              ? "Loading Supabase SQL section data..."
              : error || `${title} wuxuu akhrinayaa Supabase SQL data${accountEmail ? `: ${accountEmail}` : ""}.`}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total trades" value={`${areaTrades.length}`} change={area} icon={Sigma} />
          <StatCard label="Total TP" value={`${tp}`} change="Target profits" icon={Target} tone="positive" />
          <StatCard label="Total SL" value={`${sl}`} change="Stopped trades" icon={TrendingDown} tone="negative" />
          <StatCard label="Win rate" value={formatPercent(winRate)} change="TP / closed trades" icon={Percent} tone="positive" />
          <StatCard label="Total P/L" value={formatCurrency(pnl)} change={`${averageR.toFixed(2)}R avg`} icon={BadgeDollarSign} tone={pnl >= 0 ? "positive" : "negative"} />
        </div>

        <section className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Session totals</h2>
            <p className="mt-1 text-sm text-muted-foreground">Asia, London, and New York results inside {title}.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sessionStats.flatMap((item) => [
              <StatCard key={`${item.session}-trades`} label={`Total ${item.session} Trades`} value={`${item.trades}`} change={title} icon={Sigma} />,
              <StatCard key={`${item.session}-tp`} label={`Total ${item.session} TP`} value={`${item.tp}`} change="Target profits" icon={Target} tone="positive" />,
              <StatCard key={`${item.session}-sl`} label={`Total ${item.session} SL`} value={`${item.sl}`} change="Stopped trades" icon={TrendingDown} tone="negative" />,
              <StatCard key={`${item.session}-wr`} label={`${item.session} Win Rate`} value={formatPercent(item.winRate)} change="TP / closed" icon={Percent} tone="positive" />,
            ])}
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Rules checklist</CardTitle>
              <CardDescription>Operating standard for this section.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {playbooks[area].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border bg-background/45 p-3 text-sm">
                  <ArrowUpRight className="size-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel min-w-0">
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{title} report</CardTitle>
                <CardDescription>Search, filter, print, and export trades assigned to this section.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="size-4" />
                  Print
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
                  <Download className="size-4" />
                  CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ReportFilters filters={filters} onChange={setFilters} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Strategies</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">R</TableHead>
                    <TableHead className="text-right">P/L</TableHead>
                    <TableHead className="w-16 text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <div className="font-medium">{trade.id}</div>
                        <div className="text-xs text-muted-foreground">{trade.date}</div>
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell>{trade.session}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {trade.strategy.map((strategy) => (
                            <Badge key={strategy} variant="secondary">
                              {strategy}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.result === "TP" ? "positive" : trade.result === "SL" ? "negative" : "secondary"}>{trade.result}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{trade.rMultiple.toFixed(2)}R</TableCell>
                      <TableCell className={trade.profitLoss >= 0 ? "text-right font-medium text-emerald-500" : "text-right font-medium text-red-500"}>
                        {formatCurrency(trade.profitLoss)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button type="button" variant="ghost" size="icon" onClick={() => setSelectedTrade(trade)} aria-label="View trade detail">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!filteredTrades.length ? <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">Report-kan wali trade kuma jiro.</p> : null}
            </CardContent>
          </Card>
        </div>

        {selectedTrade ? <TradeDetailModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} /> : null}
      </div>
    </AppShell>
  );
}

function ReportFilters({ filters, onChange }: { filters: typeof emptyFilters; onChange: (filters: typeof emptyFilters) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(5,1fr)]">
      <Input placeholder="Search pair, strategy, mistake..." value={filters.query} onChange={(event) => onChange({ ...filters, query: event.target.value })} />
      <Input type="date" value={filters.dateFrom} onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })} />
      <Input type="date" value={filters.dateTo} onChange={(event) => onChange({ ...filters, dateTo: event.target.value })} />
      <Select value={filters.session} onChange={(event) => onChange({ ...filters, session: event.target.value })}>
        <option value="all">All sessions</option>
        {sessions.map((session) => (
          <option key={session}>{session}</option>
        ))}
      </Select>
      <Select value={filters.result} onChange={(event) => onChange({ ...filters, result: event.target.value })}>
        <option value="all">All results</option>
        {results.map((result) => (
          <option key={result}>{result}</option>
        ))}
      </Select>
      <Select value={filters.direction} onChange={(event) => onChange({ ...filters, direction: event.target.value })}>
        <option value="all">Buy/Sell</option>
        {directions.map((direction) => (
          <option key={direction}>{direction}</option>
        ))}
      </Select>
    </div>
  );
}

function TradeDetailModal({ trade, onClose }: { trade: Trade; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm">
      <Card className="glass-panel max-h-[88vh] w-full max-w-4xl overflow-auto">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{trade.pair} detail</CardTitle>
            <CardDescription>
              {trade.date} - {trade.area} - {trade.session} - {trade.direction}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close detail">
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Detail label="Result" value={trade.result} />
              <Detail label="P/L" value={formatCurrency(trade.profitLoss)} tone={trade.profitLoss >= 0 ? "positive" : "negative"} />
              <Detail label="R multiple" value={`${trade.rMultiple.toFixed(2)}R`} />
              <Detail label="Entry" value={String(trade.entry)} />
              <Detail label="Stop Loss" value={String(trade.stopLoss)} />
              <Detail label="Take Profit" value={String(trade.takeProfit)} />
              <Detail label="Risk" value={formatCurrency(trade.riskAmount)} />
              <Detail label="Reward" value={formatCurrency(trade.rewardAmount)} />
              <Detail label="R:R" value={trade.rr.toFixed(2)} />
            </div>
            <div className="rounded-lg border bg-background/45 p-4">
              <h3 className="mb-3 text-sm font-semibold">Strategies</h3>
              <div className="flex flex-wrap gap-2">
                {trade.strategy.map((strategy) => (
                  <Badge key={strategy} variant="secondary">
                    {strategy}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-background/45 p-4">
              <h3 className="mb-2 text-sm font-semibold">Notes</h3>
              <p className="text-sm leading-6 text-muted-foreground">{trade.notes || "No notes yet."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={trade.mistake.toLowerCase() === "none" ? "positive" : "negative"}>Mistake: {trade.mistake}</Badge>
                <Badge variant="secondary">Emotion: {trade.emotion || "Not logged"}</Badge>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border bg-background/45">
            {trade.screenshotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={trade.screenshotUrl} alt={`${trade.pair} trade screenshot`} className="h-full min-h-72 w-full object-cover" />
            ) : (
              <div className="grid min-h-72 place-items-center p-6 text-center text-sm text-muted-foreground">Screenshot wali lama gelin.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "positive" | "negative" | "neutral" }) {
  return (
    <div className="rounded-lg border bg-background/45 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={tone === "positive" ? "mt-1 font-semibold text-emerald-500" : tone === "negative" ? "mt-1 font-semibold text-red-500" : "mt-1 font-semibold"}>
        {value}
      </p>
    </div>
  );
}
