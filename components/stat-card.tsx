import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <Card className="glass-panel min-w-0 overflow-hidden">
      <CardContent className="p-5">
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-muted-foreground">{label}</p>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-md border bg-background/55",
              tone === "positive" && "text-emerald-500",
              tone === "negative" && "text-red-500",
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
        <div className="flex min-w-0 items-end justify-between gap-3">
          <p className="min-w-0 truncate text-2xl font-semibold tracking-tight">{value}</p>
          <span
            className={cn(
              "min-w-0 text-right text-xs font-medium",
              tone === "positive" && "text-emerald-500",
              tone === "negative" && "text-red-500",
              tone === "neutral" && "text-muted-foreground",
            )}
          >
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
