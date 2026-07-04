"use client";

import * as React from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBar, type TradeFilters } from "@/components/filter-bar";
import { TradeForm } from "@/components/trade-form";
import { TradeTable } from "@/components/trade-table";
import { trades as seedTrades } from "@/lib/mock-data";
import { respectedThreeRR } from "@/lib/trade-rules";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { strategies, tradingAreas, type Trade, type TradeStrategy, type TradingArea } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const initialFilters: TradeFilters = {
  query: "",
  dateFrom: "",
  dateTo: "",
  strategy: "all",
  session: "all",
  result: "all",
  direction: "all",
};

type TradeRow = {
  id: string;
  user_id: string;
  pair: string;
  direction: Trade["direction"];
  entry: number | string;
  stop_loss: number | string;
  take_profit: number | string;
  risk_amount: number | string;
  reward_amount: number | string;
  rr: number | string;
  result: Trade["result"];
  profit_loss: number | string;
  r_multiple: number | string;
  trade_date: string;
  session: Trade["session"];
  strategy_names: string[] | null;
  area: string | null;
  strategy_points: string[] | null;
  emotion: string | null;
  mistake: string | null;
  notes: string | null;
  screenshot_url: string | null;
};

const strategySet = new Set<string>(strategies);
const areaSet = new Set<string>(tradingAreas);

function asNumber(value: number | string) {
  return Number(value) || 0;
}

function rowToTrade(row: TradeRow): Trade {
  const strategyNames = (row.strategy_names ?? []).filter((strategy): strategy is TradeStrategy => strategySet.has(strategy));
  const area = areaSet.has(row.area ?? "") ? (row.area as TradingArea) : "Backtesting";

  return {
    id: row.id,
    pair: row.pair,
    direction: row.direction,
    strategy: strategyNames.length ? strategyNames : ["KIL"],
    strategyPoints: row.strategy_points ?? [],
    area,
    session: row.session,
    entry: asNumber(row.entry),
    stopLoss: asNumber(row.stop_loss),
    takeProfit: asNumber(row.take_profit),
    riskAmount: asNumber(row.risk_amount),
    rewardAmount: asNumber(row.reward_amount),
    rr: asNumber(row.rr),
    result: row.result,
    profitLoss: asNumber(row.profit_loss),
    rMultiple: asNumber(row.r_multiple),
    date: row.trade_date,
    screenshotUrl: row.screenshot_url ?? "",
    notes: row.notes ?? "",
    mistake: row.mistake ?? "None",
    emotion: row.emotion ?? "",
  };
}

function tradeToRow(trade: Trade, userId: string) {
  return {
    id: trade.id,
    user_id: userId,
    pair: trade.pair,
    direction: trade.direction,
    entry: trade.entry,
    stop_loss: trade.stopLoss,
    take_profit: trade.takeProfit,
    risk_amount: trade.riskAmount,
    reward_amount: trade.rewardAmount,
    rr: trade.rr,
    result: trade.result,
    profit_loss: trade.profitLoss,
    r_multiple: trade.rMultiple,
    trade_date: trade.date,
    session: trade.session,
    strategy_names: trade.strategy,
    area: trade.area,
    strategy_points: trade.strategyPoints ?? [],
    emotion: trade.emotion || null,
    mistake: trade.mistake || "None",
    notes: trade.notes || null,
    screenshot_url: trade.screenshotUrl || null,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Private account storage is not reachable. Check the app setup and deploy again.";
}

export function JournalWorkspace() {
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);
  const [overviewTrade, setOverviewTrade] = React.useState<Trade | null>(null);
  const [filters, setFilters] = React.useState(initialFilters);
  const [loaded, setLoaded] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [accountEmail, setAccountEmail] = React.useState("");
  const [databaseMessage, setDatabaseMessage] = React.useState("");

  const loadTrades = React.useCallback(async () => {
    setLoaded(false);
    setDatabaseMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user;

      if (userResponse.error) throw userResponse.error;
      if (!user) throw new Error("Please sign in to load your private journal data.");

      setAccountEmail(user.email ?? "");

      const response = await supabase.from("trades").select("*").order("trade_date", { ascending: false }).order("created_at", { ascending: false });
      if (response.error) throw response.error;

      setTrades(((response.data ?? []) as TradeRow[]).map(rowToTrade));
    } catch (error) {
      setTrades([]);
      setDatabaseMessage(getErrorMessage(error));
    } finally {
      setLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    void loadTrades();
  }, [loadTrades]);

  async function getUserForWrite() {
    const supabase = getSupabaseBrowserClient();
    const userResponse = await supabase.auth.getUser();
    const user = userResponse.data.user;

    if (userResponse.error) throw userResponse.error;
    if (!user) throw new Error("Fadlan login samee ka hor intaadan trade kaydin.");

    return { supabase, user };
  }

  async function saveTradeToSql(trade: Trade) {
    setBusy(true);
    setDatabaseMessage("");

    try {
      const { supabase, user } = await getUserForWrite();
      const exists = trades.some((item) => item.id === trade.id);
      const payload = tradeToRow(trade, user.id);

      const response = exists
        ? await supabase.from("trades").update(payload).eq("id", trade.id).select("*").single()
        : await supabase.from("trades").insert(payload).select("*").single();

      if (response.error) throw response.error;

      const savedTrade = rowToTrade(response.data as TradeRow);
      setTrades((current) => (exists ? current.map((item) => (item.id === savedTrade.id ? savedTrade : item)) : [savedTrade, ...current]));
      setSelectedTrade(null);
    } catch (error) {
      setDatabaseMessage(getErrorMessage(error));
      throw error;
    } finally {
      setBusy(false);
    }
  }

  async function deleteTradeFromSql(id: string) {
    setBusy(true);
    setDatabaseMessage("");

    try {
      const { supabase } = await getUserForWrite();
      const response = await supabase.from("trades").delete().eq("id", id);
      if (response.error) throw response.error;

      setTrades((current) => current.filter((trade) => trade.id !== id));
      if (overviewTrade?.id === id) setOverviewTrade(null);
      if (selectedTrade?.id === id) setSelectedTrade(null);
    } catch (error) {
      setDatabaseMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function loadSampleDataToSql() {
    setBusy(true);
    setDatabaseMessage("");

    try {
      const { supabase, user } = await getUserForWrite();
      const payload = seedTrades.map((trade) => tradeToRow({ ...trade, id: crypto.randomUUID() }, user.id));
      const response = await supabase.from("trades").insert(payload).select("*");
      if (response.error) throw response.error;

      const insertedTrades = ((response.data ?? []) as TradeRow[]).map(rowToTrade);
      setTrades((current) => [...insertedTrades, ...current]);
    } catch (error) {
      setDatabaseMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function clearAllTradesFromSql() {
    setBusy(true);
    setDatabaseMessage("");

    try {
      const { supabase, user } = await getUserForWrite();
      const response = await supabase.from("trades").delete().eq("user_id", user.id);
      if (response.error) throw response.error;

      setTrades([]);
      setSelectedTrade(null);
      setOverviewTrade(null);
    } catch (error) {
      setDatabaseMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const filteredTrades = trades.filter((trade) => {
    const query = filters.query.toLowerCase();
    const searchable = [
      trade.pair,
      trade.strategy.join(" "),
      trade.area,
      trade.notes,
      trade.emotion,
      trade.mistake,
      ...(trade.strategyPoints ?? []),
      trade.date,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!filters.dateFrom || trade.date >= filters.dateFrom) &&
      (!filters.dateTo || trade.date <= filters.dateTo) &&
      (filters.strategy === "all" || trade.strategy.includes(filters.strategy as Trade["strategy"][number])) &&
      (filters.session === "all" || trade.session === filters.session) &&
      (filters.result === "all" || trade.result === filters.result) &&
      (filters.direction === "all" || trade.direction === filters.direction)
    );
  });

  return (
    <div className="grid gap-5">
      <TradeForm selectedTrade={selectedTrade} onCancel={() => setSelectedTrade(null)} onSave={saveTradeToSql} />

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Trade list</CardTitle>
          <CardDescription>
            This journal is saved to your private account workspace{accountEmail ? `: ${accountEmail}` : ""}. Browser storage is not used for trades.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {databaseMessage ? (
            <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{databaseMessage}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={loadSampleDataToSql}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Load sample data
            </Button>
            <Button type="button" variant="destructive" size="sm" disabled={busy} onClick={clearAllTradesFromSql}>
              Clear all trades
            </Button>
          </div>
          <FilterBar filters={filters} onChange={setFilters} />
          {!loaded ? (
            <div className="grid rounded-lg border border-dashed bg-background/35 p-8 text-center text-sm text-muted-foreground">
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Loading trades...
              </span>
            </div>
          ) : filteredTrades.length ? (
            <TradeTable trades={filteredTrades} onView={setOverviewTrade} onEdit={setSelectedTrade} onDelete={deleteTradeFromSql} />
          ) : (
            <div className="rounded-lg border border-dashed bg-background/35 p-8 text-center">
              <p className="font-medium">Wali trade lama gelin.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add a new trade with the form above, or use Load sample data if you want a quick example.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {overviewTrade ? <TradeOverview trade={overviewTrade} onClose={() => setOverviewTrade(null)} /> : null}
    </div>
  );
}

function TradeOverview({ trade, onClose }: { trade: Trade; onClose: () => void }) {
  const qualityScore =
    (trade.result === "TP" ? 35 : trade.result === "Partial" ? 22 : trade.result === "BE" ? 14 : trade.result === "Open" ? 10 : 0) +
    (respectedThreeRR(trade) ? 25 : 0) +
    (trade.strategyPoints?.length ? Math.min(20, trade.strategyPoints.length * 5) : 0) +
    (trade.mistake.toLowerCase() === "none" ? 20 : 8);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="glass-panel max-h-[88vh] w-full max-w-4xl overflow-auto">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex flex-wrap items-center gap-2">
              {trade.pair} overview
              <Badge variant={trade.result === "TP" ? "positive" : trade.result === "SL" ? "negative" : "secondary"}>{trade.result}</Badge>
              <Badge variant={respectedThreeRR(trade) ? "positive" : "negative"}>{respectedThreeRR(trade) ? "3RR respected" : "Below 3RR"}</Badge>
            </CardTitle>
            <CardDescription>
              {trade.date} - {trade.area} - {trade.session} - {trade.strategy.join(", ")} - {trade.direction}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close overview">
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <OverviewMetric label="P/L" value={formatCurrency(trade.profitLoss)} tone={trade.profitLoss >= 0 ? "positive" : "negative"} />
              <OverviewMetric label="R multiple" value={`${trade.rMultiple.toFixed(2)}R`} />
              <OverviewMetric label="Quality score" value={`${Math.min(100, qualityScore)}/100`} tone={qualityScore >= 70 ? "positive" : qualityScore < 45 ? "negative" : "neutral"} />
              <OverviewMetric label="Entry" value={String(trade.entry)} />
              <OverviewMetric label="Stop Loss" value={String(trade.stopLoss)} />
              <OverviewMetric label="Take Profit" value={String(trade.takeProfit)} />
              <OverviewMetric label="Risk" value={formatCurrency(trade.riskAmount)} />
              <OverviewMetric label="Reward" value={formatCurrency(trade.rewardAmount)} />
              <OverviewMetric label="R:R" value={trade.rr.toFixed(2)} />
            </div>

            <div className="rounded-lg border bg-background/45 p-4">
              <h3 className="mb-3 text-sm font-semibold">Strategy qodobo</h3>
              {trade.strategyPoints?.length ? (
                <ul className="grid gap-2">
                  {trade.strategyPoints.map((point) => (
                    <li key={point} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Qodobo strategy ah lama gelin.</p>
              )}
            </div>

            <div className="rounded-lg border bg-background/45 p-4">
              <h3 className="mb-2 text-sm font-semibold">Notes, mistake, emotion</h3>
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
              <div className="grid min-h-72 place-items-center p-6 text-center text-sm text-muted-foreground">
                Screenshot wali lama gelin.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OverviewMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-lg border bg-background/45 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={tone === "positive" ? "mt-1 font-semibold text-emerald-500" : tone === "negative" ? "mt-1 font-semibold text-red-500" : "mt-1 font-semibold"}>
        {value}
      </p>
    </div>
  );
}
