"use client";

import { ArrowUpRight, BadgeDollarSign, Percent, Sigma, Target, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseTrades } from "@/lib/trade-data";
import type { TradingArea } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

const playbooks: Record<TradingArea, string[]> = {
  Backtesting: ["Screenshot every model", "Tag multiple strategies", "Record invalidations", "Compare planned 3RR vs outcome"],
  "Free Trial / Demo Challenge": ["Trade demo rules only", "Keep daily risk clean", "Mark emotional errors", "Review every SL before next session"],
  "Funded Challenge": ["Protect drawdown", "Only A+ confirmations", "No broker credentials stored", "Journal before scaling risk"],
  "Account Challenge": ["Track account phase", "Respect 3RR target", "Avoid revenge trades", "Upload chart proof for each trade"],
};

export function TradingAreaPage({ area, title, subtitle }: { area: TradingArea; title: string; subtitle: string }) {
  const { trades, accountEmail, loading, error } = useSupabaseTrades();
  const areaTrades = trades.filter((trade) => trade.area === area);
  const closedTrades = areaTrades.filter((trade) => trade.result !== "Open");
  const tp = areaTrades.filter((trade) => trade.result === "TP").length;
  const sl = areaTrades.filter((trade) => trade.result === "SL").length;
  const pnl = areaTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const winRate = closedTrades.length ? (tp / closedTrades.length) * 100 : 0;
  const averageR = areaTrades.length ? areaTrades.reduce((sum, trade) => sum + trade.rMultiple, 0) / areaTrades.length : 0;

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

        <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
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
            <CardHeader>
              <CardTitle>{title} trades</CardTitle>
              <CardDescription>Trades assigned to this website section.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trade</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Strategies</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">R</TableHead>
                    <TableHead className="text-right">P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <div className="font-medium">{trade.id}</div>
                        <div className="text-xs text-muted-foreground">{trade.date}</div>
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
