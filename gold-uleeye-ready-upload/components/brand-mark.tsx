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
    <div className={`${className} overflow-hidden rounded-md border bg-white p-1 dark:bg-black`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo || "/brand/edge-icon-transparent.png"} alt="Edge Journal logo" className="h-full w-full object-contain" />
    </div>
  );
}
