import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem("kk_ann_dismissed") === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative bg-foreground text-background">
      <div className="container-x mx-auto flex h-9 max-w-7xl items-center justify-center pr-8 text-center text-[11px] font-medium tracking-wide">
        Free delivery in Lagos on orders over ₦25,000 · Pay on delivery available
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem("kk_ann_dismissed", "1");
          setDismissed(true);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-background/70 hover:bg-background/10 hover:text-background"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
