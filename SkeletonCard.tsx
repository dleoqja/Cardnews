export function SkeletonCard() {
  return (
    <section className="relative flex h-[100svh] w-full snap-start flex-col justify-end overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-dark via-ink/80 to-ink" />
      <Shimmer className="absolute inset-0" />

      <div className="relative z-10 space-y-3 px-5 pb-32">
        <div className="h-5 w-24 rounded-full bg-white/10" />
        <div className="h-7 w-[85%] rounded-lg bg-white/10" />
        <div className="h-7 w-[60%] rounded-lg bg-white/10" />
        <div className="mt-4 h-4 w-[90%] rounded bg-white/[0.07]" />
        <div className="h-4 w-[75%] rounded bg-white/[0.07]" />
        <div className="mt-6 h-12 w-full rounded-2xl bg-white/[0.06]" />
      </div>
    </section>
  );
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}
