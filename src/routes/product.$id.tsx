import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, MessageCircle, Minus, Play, Plus, ShoppingBag, Star, Truck, ZoomIn } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { ProductTile } from "@/components/ProductTile";
import { findProduct, products, reviews } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Gydus Kiddies` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
        ]
      : [{ title: "Product — Gydus Kiddies" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <Layout>
      <div className="container-x mx-auto max-w-3xl py-24 text-center">
        <h1 className="font-display text-4xl font-semibold">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-primary underline underline-offset-4">Back to shop</Link>
      </div>
    </Layout>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, markViewed, recentlyViewed } = useStore();
  const [size, setSize] = useState<string>(product.sizes[Math.floor(product.sizes.length / 2)]);
  const [color, setColor] = useState<string>(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const isWished = wishlist.includes(product.id);

  useEffect(() => {
    markViewed(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recent = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.id !== product.id)
    .slice(0, 4);

  const doAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      quantity: qty,
    });
    toast.success("Added to cart", { description: `${product.name} · Size ${size}` });
  };

  const whatsappOrder = () => {
    const msg = `Hi Gydus Kiddies! I'd like to order:%0A${product.name}%0ASize: ${size}%0AColour: ${color}%0AQty: ${qty}%0ATotal: ${formatNaira(product.price * qty)}`;
    window.open(`https://wa.me/2348000000000?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <div className="container-x mx-auto max-w-7xl pt-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="container-x mx-auto grid max-w-7xl gap-10 pt-8 md:grid-cols-2 md:pt-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div
            onClick={() => setZoom((v) => !v)}
            className={`group relative cursor-zoom-in overflow-hidden rounded-[2rem] ${zoom ? "cursor-zoom-out" : ""}`}
          >
            <div className={`transition-transform duration-500 ${zoom ? "scale-150" : ""}`}>
              <ProductTile product={product} className="rounded-[2rem]" />
            </div>
            <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 shadow-soft">
              <ZoomIn className="h-4 w-4" />
            </div>
            <button className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-foreground/90 px-4 py-2 text-xs font-medium text-background backdrop-blur">
              <Play className="h-3.5 w-3.5" fill="currentColor" /> Watch video
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="overflow-hidden rounded-2xl">
                <ProductTile product={product} variantSeed={n} className="aspect-square" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              ))}
            </div>
            <span className="text-muted-foreground">{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">{formatNaira(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through">{formatNaira(product.compareAt)}</span>
            )}
            {product.compareAt && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Save {Math.round(100 - (product.price / product.compareAt) * 100)}%
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-foreground/80">{product.description}</p>

          {/* Color */}
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
              <span>Colour</span>
              <span className="text-muted-foreground">{color}</span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  className={`h-10 w-10 rounded-full border-2 transition ${color === c ? "border-foreground scale-110" : "border-white shadow-soft"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
              <span>Size</span>
              <button className="text-muted-foreground underline underline-offset-4">Size guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[52px] rounded-full border px-4 py-2 text-sm font-medium transition ${
                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:border-foreground/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock + qty */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className={product.stock <= 5 ? "font-medium text-primary" : "text-muted-foreground"}>
              {product.stock <= 5 ? `Only ${product.stock} left in stock` : `In stock (${product.stock} available)`}
            </span>
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-muted rounded-l-full">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-10 w-10 place-items-center hover:bg-muted rounded-r-full">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={doAdd}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-background px-6 py-3.5 text-sm font-medium hover:bg-muted"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button
              onClick={() => { doAdd(); }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background hover:opacity-90"
            >
              Buy now
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              onClick={whatsappOrder}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[oklch(0.75_0.16_155)] px-6 py-3.5 text-sm font-medium text-white hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-medium transition ${isWished ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
            >
              <Heart className="h-4 w-4" fill={isWished ? "currentColor" : "none"} />
              {isWished ? "Saved" : "Add to wishlist"}
            </button>
          </div>

          {/* Delivery */}
          <div className="mt-8 rounded-2xl bg-sky/30 p-5">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Delivery estimate</p>
                <p className="text-muted-foreground">Lagos: 1–2 business days · Nationwide: 2–5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-x mx-auto max-w-7xl pt-20">
        <h2 className="font-display text-3xl font-semibold">Reviews · {product.rating.toFixed(1)}★</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.name} className="rounded-3xl bg-card p-6 shadow-soft">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed">"{r.text}"</blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">{r.name} · {r.city}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Similar */}
      <section className="container-x mx-auto max-w-7xl pt-20">
        <h2 className="font-display text-3xl font-semibold">You might also love</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {similar.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="container-x mx-auto max-w-7xl pt-20">
          <h2 className="font-display text-3xl font-semibold">Recently viewed</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
