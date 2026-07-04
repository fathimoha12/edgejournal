"use client";

import * as React from "react";
import { ImagePlus, Palette, RotateCcw } from "lucide-react";
import { applyAccentColor, defaultAccentColor } from "@/components/appearance-provider";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AppearanceSettings() {
  const [color, setColor] = React.useState(defaultAccentColor);
  const [logoName, setLogoName] = React.useState("");

  React.useEffect(() => {
    const saved = window.localStorage.getItem("edge-journal-accent-color");
    if (saved) setColor(saved);
  }, []);

  const setAccent = (nextColor: string) => {
    setColor(nextColor);
    window.localStorage.setItem("edge-journal-accent-color", nextColor);
    applyAccentColor(nextColor);
  };

  const uploadLogo = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      window.localStorage.setItem("edge-journal-logo", String(reader.result));
      window.dispatchEvent(new Event("edge-journal-logo"));
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="glass-panel xl:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription>Dooro color kasta oo aad rabto adigoo jiidaya picker-ka, kuna upload-garee logo profile-kaaga.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-3">
          <Label>Unlimited accent color</Label>
          <div className="grid gap-3 rounded-lg border bg-background/45 p-4 sm:grid-cols-[96px_1fr]">
            <Input
              type="color"
              value={color}
              className="h-20 w-full cursor-pointer p-1"
              onChange={(event) => setAccent(event.target.value)}
              aria-label="Choose any accent color"
            />
            <div className="grid content-center gap-2">
              <Input value={color} onChange={(event) => setAccent(event.target.value)} placeholder="#d4a72c" />
              <Button type="button" variant="outline" className="w-fit" onClick={() => setAccent(defaultAccentColor)}>
                <RotateCcw className="size-4" />
                Reset red
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <Label>Profile logo</Label>
          <div className="grid gap-3 rounded-lg border bg-background/45 p-4 sm:grid-cols-[64px_1fr]">
            <BrandMark className="size-16" />
            <div className="grid content-center gap-2">
              <Input type="file" accept="image/*" onChange={(event) => uploadLogo(event.target.files?.[0])} />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="w-fit" onClick={() => document.getElementById("logo-input-helper")?.click()}>
                  <ImagePlus className="size-4" />
                  Upload logo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit"
                  onClick={() => {
                    window.localStorage.removeItem("edge-journal-logo");
                    window.dispatchEvent(new Event("edge-journal-logo"));
                    setLogoName("");
                  }}
                >
                  Clear logo
                </Button>
              </div>
              <input id="logo-input-helper" type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
              <p className="text-xs text-muted-foreground">{logoName || "Logo-ga wuxuu ka muuqanayaa meesha Edge Journal ku qoran tahay."}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
