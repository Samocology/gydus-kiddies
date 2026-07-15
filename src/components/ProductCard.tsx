import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { useStore } from "@/lib/store";
import { ProductTile } from "./ProductTile";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useStore();
  const isWished = wishlist.includes(product.id);

  return (
    <div className="group relative">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block overflow-hidden rounded-3xl bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative">
          <ProductTile product={product} />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                New
              </span>
            )}
            {product.onSale && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                Sale
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                Best Seller
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>
          <h3 className="mt-1 line-clamp-1 text-base font-medium text-foreground">{product.name}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold">{formatNaira(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-muted-foreground line-through">{formatNaira(product.compareAt)}</span>
            )}
          </div>
        </div>
      </Link>
      <button
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className={cn(
          "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-soft backdrop-blur transition hover:scale-105",
          isWished && "bg-primary text-primary-foreground",
        )}
      >
        <Heart className="h-4 w-4" fill={isWished ? "currentColor" : "none"} strokeWidth={2} />
      </button>
    </div>
  );
}
