export const strategies = ["KIL", "LQ", "IRL to ERL", "ERL to IRL", "OF", "Model #1", "SMT", "2SMT"] as const;
export const sessions = ["Asia", "London", "New York"] as const;
export const results = ["TP", "SL", "BE", "Partial", "Open"] as const;
export const directions = ["Buy", "Sell"] as const;
export const tradingAreas = ["Backtesting", "Free Trial / Demo Challenge", "Funded Challenge", "Account Challenge"] as const;

export type TradeStrategy = (typeof strategies)[number];
export type TradeDirection = (typeof directions)[number];
export type TradeResult = (typeof results)[number];
export type TradingSession = (typeof sessions)[number];
export type TradingArea = (typeof tradingAreas)[number];

export type Trade = {
  id: string;
  pair: string;
  direction: TradeDirection;
  strategy: TradeStrategy[];
  strategyPoints?: string[];
  area: TradingArea;
  session: TradingSession;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskAmount: number;
  rewardAmount: number;
  rr: number;
  result: TradeResult;
  profitLoss: number;
  rMultiple: number;
  date: string;
  screenshotUrl: string;
  notes: string;
  mistake: string;
  emotion: string;
};
