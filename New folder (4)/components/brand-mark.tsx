"use client";

import * as React from "react";
import { CandlestickChart } from "lucide-react";

export function BrandMark({ className = "size-10" }: { className?: string }) {
  const [logo, setLogo] = React.useState<string>("");

  React.useEffect(() => {
    const readLogo = () => setLogo(window.localStorage.getItem("gold-uleeye-logo") ?? "");
    readLogo();
    window.addEventListener("storage", readLogo);
    window.addEventListener("gold-uleeye-logo", readLogo);

    return () => {
      window.removeEventListener("storage", readLogo);
      window.removeEventListener("gold-uleeye-logo", readLogo);
    };
  }, []);

  if (logo) {
    return (
      <div className={`${className} overflow-hidden rounded-md border bg-background`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="Gold Uleeye logo" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center rounded-md bg-primary text-primary-foreground`}>
      <CandlestickChart className="size-5" />
    </div>
  );
}
