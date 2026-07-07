"use client";

import * as React from "react";
import { Check, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { calculateRMultiple, respectedThreeRR } from "@/lib/trade-rules";
import type { Trade, TradeStrategy } from "@/lib/types";
import { directions, results, sessions, strategies, tradingAreas } from "@/lib/types";

const emptyTrade: Trade = {
  id: "",
  pair: "EUR/USD",
  direction: "Buy",
  strategy: ["KIL"],
  strategyPoints: ["Liquidity sweep", "Displacement", "3RR target clear"],
  area: "Backtesting",
  session: "London",
  entry: 0,
  stopLoss: 0,
  takeProfit: 0,
  riskAmount: 100,
  rewardAmount: 300,
  rr: 3,
  result: "Open",
  profitLoss: 0,
  rMultiple: 0,
  date: new Date().toISOString().slice(0, 10),
  screenshotUrl: "",
  notes: "",
  mistake: "None",
  emotion: "",
};

export function TradeForm({
  selectedTrade,
  onSave,
  onCancel,
}: {
  selectedTrade?: Trade | null;
  onSave: (trade: Trade) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [trade, setTrade] = React.useState<Trade>(selectedTrade ?? emptyTrade);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setTrade(selectedTrade ?? emptyTrade);
  }, [selectedTrade]);

  const rMultiple = calculateRMultiple(trade);
  const respectedTarget = respectedThreeRR(trade);
  const strategyPointsText = (trade.strategyPoints ?? []).join("\n");

  const update = <K extends keyof Trade>(key: K, value: Trade[K]) => {
    setTrade((current) => {
      const next = { ...current, [key]: value };

      if (key === "riskAmount" || key === "rewardAmount") {
        const risk = key === "riskAmount" ? Number(value) : next.riskAmount;
        const reward = key === "rewardAmount" ? Number(value) : next.rewardAmount;
        next.rr = risk > 0 ? Number((reward / risk).toFixed(2)) : 0;
      }

      if (key === "rr" || key === "riskAmount") {
        const risk = key === "riskAmount" ? Number(value) : next.riskAmount;
        const rr = key === "rr" ? Number(value) : next.rr;
        next.rewardAmount = Number((risk * rr).toFixed(2));
      }

      next.rMultiple = calculateRMultiple(next);
      return next;
    });
  };

  const toggleStrategy = (strategy: TradeStrategy) => {
    const current = trade.strategy;
    const next = current.includes(strategy) ? current.filter((item) => item !== strategy) : [...current, strategy];
    update("strategy", (next.length ? next : [strategy]) as Trade["strategy"]);
  };

  const updateScreenshotFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update("screenshotUrl", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>{selectedTrade ? "Edit trade" : "Add trade"}</CardTitle>
        <CardDescription>Every setup targets 3RR. The journal flags whether the trade respected that plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);

            try {
              await onSave({
                ...trade,
                id: trade.id || crypto.randomUUID(),
                rMultiple,
              });
              setTrade(emptyTrade);
            } catch {
              // Keep the form values in place so the trader can retry after a database error.
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Pair">
              <Select value={trade.pair} onChange={(event) => update("pair", event.target.value)}>
                <option>EUR/USD</option>
                <option>GBP/USD</option>
                <option>XAUUSD</option>
              </Select>
            </Field>
            <Field label="Direction">
              <Select value={trade.direction} onChange={(event) => update("direction", event.target.value as Trade["direction"])}>
                {directions.map((direction) => (
                  <option key={direction}>{direction}</option>
                ))}
              </Select>
            </Field>
            <Field label="Strategy">
              <div className="rounded-md border bg-background/50 p-2">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => update("strategy", [...strategies] as Trade["strategy"])}>
                    Select all
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => update("strategy", ["KIL"])}>
                    Clear
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {strategies.map((strategy) => {
                    const checked = trade.strategy.includes(strategy);
                    return (
                      <Button
                        key={strategy}
                        type="button"
                        variant={checked ? "default" : "outline"}
                        className="h-9 justify-start"
                        onClick={() => toggleStrategy(strategy)}
                      >
                        {checked ? <Check className="size-4" /> : <span className="size-4" />}
                        {strategy}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Field>
            <Field label="Session">
              <Select value={trade.session} onChange={(event) => update("session", event.target.value as Trade["session"])}>
                {sessions.map((session) => (
                  <option key={session}>{session}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Website section">
            <Select value={trade.area} onChange={(event) => update("area", event.target.value as Trade["area"])}>
              {tradingAreas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </Select>
          </Field>

          <Field label="Strategy qodobo / confirmations">
            <Textarea
              value={strategyPointsText}
              onChange={(event) =>
                update(
                  "strategyPoints",
                  event.target.value
                    .split("\n")
                    .map((point) => point.trim())
                    .filter(Boolean),
                )
              }
              placeholder={"Liquidity sweep\nDisplacement candle\n3RR target clear"}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NumberField label="Entry price" value={trade.entry} onChange={(value) => update("entry", value)} />
            <NumberField label="Stop Loss price" value={trade.stopLoss} onChange={(value) => update("stopLoss", value)} />
            <NumberField label="Take Profit price" value={trade.takeProfit} onChange={(value) => update("takeProfit", value)} />
            <Field label="Date">
              <Input type="date" value={trade.date} onChange={(event) => update("date", event.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <NumberField label="Risk amount" value={trade.riskAmount} onChange={(value) => update("riskAmount", value)} />
            <NumberField label="Reward amount" value={trade.rewardAmount} onChange={(value) => update("rewardAmount", value)} />
            <NumberField label="R:R" value={trade.rr} onChange={(value) => update("rr", value)} />
            <Field label="Calculated R-multiple">
              <Input value={`${rMultiple.toFixed(2)}R`} disabled />
            </Field>
            <Field label="Result">
              <Select value={trade.result} onChange={(event) => update("result", event.target.value as Trade["result"])}>
                {results.map((result) => (
                  <option key={result}>{result}</option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NumberField label="Profit/Loss" value={trade.profitLoss} onChange={(value) => update("profitLoss", value)} />
            <Field label="3RR respected">
              <Input value={respectedTarget ? "Yes - target is 3RR or higher" : "No - below 3RR target"} disabled />
            </Field>
            <Field label="Screenshot">
              <Input value={trade.screenshotUrl} onChange={(event) => update("screenshotUrl", event.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Upload screenshot">
              <Input type="file" accept="image/*" onChange={(event) => updateScreenshotFile(event.target.files?.[0])} />
            </Field>
            <Field label="Emotion">
              <Input value={trade.emotion} onChange={(event) => update("emotion", event.target.value)} placeholder="Patient" />
            </Field>
          </div>

          {trade.screenshotUrl ? (
            <div className="overflow-hidden rounded-lg border bg-background/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={trade.screenshotUrl} alt="Trade screenshot preview" className="max-h-72 w-full object-cover" />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mistake">
              <Input value={trade.mistake} onChange={(event) => update("mistake", event.target.value)} placeholder="None" />
            </Field>
            <Field label="Notes">
              <Textarea value={trade.notes} onChange={(event) => update("notes", event.target.value)} placeholder="What happened? Did the trade respect the 3RR model?" />
            </Field>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {selectedTrade ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : selectedTrade ? <Save className="size-4" /> : <Plus className="size-4" />}
              {selectedTrade ? "Save changes" : "Add trade"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
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

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [inputValue, setInputValue] = React.useState(String(value));
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!focused) setInputValue(String(value));
  }, [focused, value]);

  function handleChange(nextValue: string) {
    setInputValue(nextValue);

    if (nextValue.trim() === "") {
      onChange(0);
      return;
    }

    if (nextValue === "-" || nextValue === "." || nextValue === "-.") return;

    const parsed = Number(nextValue);
    if (Number.isFinite(parsed)) onChange(parsed);
  }

  function handleBlur() {
    setFocused(false);

    if (inputValue.trim() === "" || inputValue === "-" || inputValue === "." || inputValue === "-.") {
      setInputValue("0");
      onChange(0);
      return;
    }

    const parsed = Number(inputValue);
    if (Number.isFinite(parsed)) {
      setInputValue(String(parsed));
      onChange(parsed);
    }
  }

  return (
    <Field label={label}>
      <Input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onFocus={() => {
          setFocused(true);
          if (Number(value) === 0 && inputValue === "0") setInputValue("");
        }}
        onBlur={handleBlur}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="0"
      />
    </Field>
  );
}
