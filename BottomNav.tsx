"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, HomeIcon } from "./icons";

const TABS = [
  { href: "/", label: "피드", icon: HomeIcon },
  { href: "/liked", label: "좋아요", icon: HeartIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:bg-ink/80">
      <div className="mx-auto flex max-w-md items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 active:scale-95"
            >
              <Icon
                filled={active}
                className={`h-6 w-6 ${active ? "text-accent" : "text-white/55"}`}
              />
              <span
                className={`text-[11px] font-bold ${
                  active ? "text-white" : "text-white/55"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
