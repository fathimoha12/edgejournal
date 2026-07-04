"use client";

import * as React from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { results, sessions, strategies, tradingAreas, type Trade, type TradeResult, type TradeStrategy, type TradingArea } from "@/lib/types";

export type TradeRow = {
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

const startingEquity = 25000;
const strategySet = new Set<string>(strategies);
const areaSet = new Set<string>(tradingAreas);

function asNumber(value: number | string) {
  return Number(value) || 0;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function groupPercent(count: number, total: number) {
  return total ? Math.round((count / total) * 100) : 0;
}

export function rowToTrade(row: TradeRow): Trade {
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

export function tradeToRow(trade: Trade, userId: string) {
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

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Supabase SQL database lama gaari karo. Hubi env variables-ka iyo schema-ga.";
}

export function useSupabaseTrades() {
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [accountEmail, setAccountEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const reload = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user;

      if (userResponse.error) throw userResponse.error;
      if (!user) throw new Error("Fadlan login samee si xogtaada SQL database looga akhriyo.");

      setAccountEmail(user.email ?? "");

      const response = await supabase.from("trades").select("*").order("trade_date", { ascending: false }).order("created_at", { ascending: false });
      if (response.error) throw response.error;

      setTrades(((response.data ?? []) as TradeRow[]).map(rowToTrade));
    } catch (loadError) {
      setTrades([]);
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  return { trades, setTrades, accountEmail, loading, error, setError, reload };
}

export function buildTradeAnalytics(trades: Trade[]) {
  const tpTrades = trades.filter((trade) => trade.result === "TP");
  const slTrades = trades.filter((trade) => trade.result === "SL");
  const closedTrades = trades.filter((trade) => trade.result !== "Open");
  const grossProfit = closedTrades.filter((trade) => trade.profitLoss > 0).reduce((sum, trade) => sum + trade.profitLoss, 0);
  const grossLoss = Math.abs(closedTrades.filter((trade) => trade.profitLoss < 0).reduce((sum, trade) => sum + trade.profitLoss, 0));
  const profits = closedTrades.filter((trade) => trade.profitLoss > 0).map((trade) => trade.profitLoss);
  const losses = closedTrades.filter((trade) => trade.profitLoss < 0).map((trade) => trade.profitLoss);

  const dashboardMetrics = {
    totalTrades: trades.length,
    totalTp: tpTrades.length,
    totalSl: slTrades.length,
    totalBe: trades.filter((trade) => trade.result === "BE").length,
    totalOpen: trades.filter((trade) => trade.result === "Open").length,
    totalProfitLoss: closedTrades.reduce((sum, trade) => sum + trade.profitLoss, 0),
    winRate: closedTrades.length ? (tpTrades.length / closedTrades.length) * 100 : 0,
    lossRate: closedTrades.length ? (slTrades.length / closedTrades.length) * 100 : 0,
    averageRr: average(trades.map((trade) => trade.rr)),
    profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit,
    averageEntry: average(trades.map((trade) => trade.entry)),
    maxSl: trades.length ? Math.max(...trades.map((trade) => trade.stopLoss)) : 0,
    minSl: trades.length ? Math.min(...trades.map((trade) => trade.stopLoss)) : 0,
    maxTp: trades.length ? Math.max(...trades.map((trade) => trade.takeProfit)) : 0,
    minTp: trades.length ? Math.min(...trades.map((trade) => trade.takeProfit)) : 0,
    biggestProfit: trades.length ? Math.max(...trades.map((trade) => trade.profitLoss)) : 0,
    biggestLoss: trades.length ? Math.min(...trades.map((trade) => trade.profitLoss)) : 0,
    averageProfit: average(profits),
    averageLoss: average(losses),
  };

  const sessionTotals = sessions.map((session) => {
    const sessionTrades = trades.filter((trade) => trade.session === session);
    const tp = sessionTrades.filter((trade) => trade.result === "TP").length;
    const sl = sessionTrades.filter((trade) => trade.result === "SL").length;
    const closed = sessionTrades.filter((trade) => trade.result !== "Open");
    return {
      session,
      trades: sessionTrades.length,
      tp,
      sl,
      winRate: closed.length ? (tp / closed.length) * 100 : 0,
      pnl: sessionTrades.reduce((sum, trade) => sum + trade.profitLoss, 0),
    };
  });

  const strategyAnalytics = strategies.map((strategy) => {
    const strategyTrades = trades.filter((trade) => trade.strategy.includes(strategy));
    const tp = strategyTrades.filter((trade) => trade.result === "TP").length;
    const sl = strategyTrades.filter((trade) => trade.result === "SL").length;
    const closed = strategyTrades.filter((trade) => trade.result !== "Open");
    return {
      strategy,
      trades: strategyTrades.length,
      tp,
      sl,
      winRate: closed.length ? (tp / closed.length) * 100 : 0,
      pnl: strategyTrades.reduce((sum, trade) => sum + trade.profitLoss, 0),
      averageRMultiple: average(strategyTrades.map((trade) => trade.rMultiple)),
    };
  });

  const equityCurve = closedTrades
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce<Array<{ date: string; equity: number }>>((points, trade) => {
      const previous = points.length ? points[points.length - 1].equity : startingEquity;
      points.push({
        date: new Date(`${trade.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        equity: previous + trade.profitLoss,
      });
      return points;
    }, []);

  const monthlyPerformance = Object.values(
    closedTrades.reduce<Record<string, { month: string; profit: number; loss: number; net: number }>>((months, trade) => {
      const month = new Date(`${trade.date}T00:00:00`).toLocaleDateString("en-US", { month: "short" });
      months[month] ??= { month, profit: 0, loss: 0, net: 0 };
      if (trade.profitLoss >= 0) months[month].profit += trade.profitLoss;
      else months[month].loss += trade.profitLoss;
      months[month].net += trade.profitLoss;
      return months;
    }, {}),
  );

  const tpVsSlData = results.map((result) => ({
    name: result,
    value: trades.filter((trade) => trade.result === result).length,
  })) satisfies Array<{ name: TradeResult; value: number }>;

  const sessionPerformance = sessionTotals.map((item) => ({ name: item.session, pnl: item.pnl, trades: item.trades }));
  const strategyPerformance = strategyAnalytics.map((item) => ({ name: item.strategy, pnl: item.pnl, trades: item.trades, winRate: item.winRate }));

  const pairPerformance = Object.values(
    trades.reduce<Record<string, { name: string; pnl: number; trades: number }>>((pairs, trade) => {
      pairs[trade.pair] ??= { name: trade.pair, pnl: 0, trades: 0 };
      pairs[trade.pair].pnl += trade.profitLoss;
      pairs[trade.pair].trades += 1;
      return pairs;
    }, {}),
  );

  const rMultipleDistribution = [
    { name: "-1R", trades: trades.filter((trade) => trade.rMultiple <= -1).length },
    { name: "0R", trades: trades.filter((trade) => trade.rMultiple === 0).length },
    { name: "0-2R", trades: trades.filter((trade) => trade.rMultiple > 0 && trade.rMultiple < 2).length },
    { name: "2-3R", trades: trades.filter((trade) => trade.rMultiple >= 2 && trade.rMultiple < 3).length },
    { name: "3R+", trades: trades.filter((trade) => trade.rMultiple >= 3).length },
  ];

  const mistakes = Object.values(
    trades.reduce<Record<string, { name: string; count: number }>>((items, trade) => {
      const key = trade.mistake || "Not logged";
      items[key] ??= { name: key, count: 0 };
      items[key].count += 1;
      return items;
    }, {}),
  ).map((item) => ({ name: item.name, value: groupPercent(item.count, trades.length) }));

  const emotions = Object.values(
    trades.reduce<Record<string, { name: string; count: number }>>((items, trade) => {
      const key = trade.emotion || "Not logged";
      items[key] ??= { name: key, count: 0 };
      items[key].count += 1;
      return items;
    }, {}),
  ).map((item) => ({ name: item.name, value: groupPercent(item.count, trades.length) }));

  const pnlByDate = closedTrades.reduce<Record<string, number>>((days, trade) => {
    days[trade.date] = (days[trade.date] ?? 0) + trade.profitLoss;
    return days;
  }, {});
  const today = new Date();
  const calendarDays = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (34 - index));
    const key = date.toISOString().slice(0, 10);
    return { day: date.getDate(), date: key, pnl: pnlByDate[key] ?? 0 };
  });

  return {
    dashboardMetrics,
    sessionTotals,
    strategyAnalytics,
    equityCurve,
    monthlyPerformance,
    tpVsSlData,
    sessionPerformance,
    strategyPerformance,
    pairPerformance,
    rMultipleDistribution,
    mistakes,
    emotions,
    calendarDays,
  };
}
