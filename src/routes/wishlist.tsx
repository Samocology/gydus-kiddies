import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHead } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Gydus Kiddies" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <Layout>
      <PageHead eyebrow="Saved for later" title="Your wishlist" lede={items.length ? `${items.length} treasures waiting for you.` : "Tap the heart on any product to save it here."} />
      <section className="container-x mx-auto max-w-7xl pb-24">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="font-display text-2xl">Nothing saved yet</p>
            <Link to="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">Explore the shop →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
