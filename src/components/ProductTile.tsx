import type { Product } from "@/lib/data";
import { productImage } from "@/lib/data";

export function ProductTile({
  product,
  className = "",
  variantSeed = 0,
}: {
  product: Product;
  className?: string;
  variantSeed?: number;
}) {
  const src = variantSeed === 0 ? product.image : productImage(product.id, variantSeed, product.category);
  return (
    <div className={`relative w-full aspect-[4/5] overflow-hidden bg-muted ${className}`}>
      <img
        src={src}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}