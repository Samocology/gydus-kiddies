import { useEffect, useState } from "react";

export function Countdown({ target }: { target: Date }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - (now ?? target.getTime()));
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const cells = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Mins", value: mins },
    { label: "Secs", value: secs },
  ];
  return (
    <div className="flex gap-3">
      {cells.map((c) => (
        <div key={c.label} className="min-w-[68px] rounded-2xl bg-background/90 px-4 py-3 text-center shadow-soft">
          <div className="font-display text-3xl font-semibold tabular-nums">
            {String(c.value).padStart(2, "0")}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
