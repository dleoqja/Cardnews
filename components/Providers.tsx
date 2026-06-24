"use client";

import { useEffect } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { InteractionProvider } from "@/lib/store";

function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.error("SW registration failed:", err));
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InteractionProvider>
        {children}
        <ServiceWorkerRegister />
      </InteractionProvider>
    </ThemeProvider>
  );
}
