"use client";

import * as React from "react";
export function BrandMark({ className = "size-10" }: { className?: string }) {
  const [logo, setLogo] = React.useState<string>("");

  React.useEffect(() => {
    const readLogo = () => setLogo(window.localStorage.getItem("edge-journal-logo") ?? "");
    readLogo();
    window.addEventListener("storage", readLogo);
    window.addEventListener("edge-journal-logo", readLogo);

    return () => {
      window.removeEventListener("storage", readLogo);
      window.removeEventListener("edge-journal-logo", readLogo);
    };
  }, []);

  return (
    <div className={`${className} overflow-hidden rounded-md border bg-background`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo || "/brand/edge-icon.png"} alt="Edge Journal logo" className="h-full w-full object-cover" />
    </div>
  );
}
