import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, ShoppingBag, Sparkles, User } from "lucide-react";
import { useStore } from "@/lib/store";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Sparkles },
  { to: "/wishlist", label: "Saved", icon: Heart, badge: "wishlist" as const },
  { to: "/cart", label: "Cart", icon: ShoppingBag, badge: "cart" as const },
  { to: "/account", label: "Me", icon: User },
];

export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.to === "/" ? path === "/" : path.startsWith(it.to);
          const Icon = it.icon;
          const badgeCount =
            it.badge === "cart" ? cartCount : it.badge === "wishlist" ? wishlist.length : 0;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition ${
                  active ? "text-primary" : "text-foreground/60"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-2xl transition ${
                    active ? "bg-primary/10" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  {badgeCount > 0 && (
                    <span className="absolute right-2 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground">
                      {badgeCount}
                    </span>
                  )}
                </span>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
