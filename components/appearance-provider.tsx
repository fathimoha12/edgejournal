"use client";

import * as React from "react";

const defaultAccent = "#ef1018";

function normalizeHex(value: string | null) {
  if (!value) return defaultAccent;
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : defaultAccent;
}

function readableForeground(hex: string) {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6 ? "#11110d" : "#ffffff";
}

export function applyAccentColor(color: string | null) {
  const hex = normalizeHex(color);
  const root = document.documentElement;
  root.style.setProperty("--primary", hex);
  root.style.setProperty("--primary-foreground", readableForeground(hex));
  root.style.setProperty("--ring", hex);
  root.style.setProperty("--accent", `${hex}33`);
  root.style.setProperty("--accent-foreground", hex);
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    applyAccentColor(window.localStorage.getItem("edge-journal-accent-color"));
  }, []);

  return children;
}

export const defaultAccentColor = defaultAccent;
