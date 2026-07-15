import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Countdown } from "@/components/Countdown";
import { products } from "@/lib/data";

export const Route = createFileRoute("/sales")({
  head: () => ({
    meta: [
      { title: "Sale — Gydus Kiddies" },
      { name: "description", content: "Up to 40% off across selected kids' pieces. Limited time only." },
    ],
  }),
  component: SalesPage,
});

function SalesPage() {
  const items = products.filter((p) => p.onSale);
  const target = new Date(Date.now() + 4 * 86400000);
  return (
    <Layout>
      <section className="container-x mx-auto max-w-7xl pt-10">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground md:grid-cols-2">
          <div className="p-10 md:p-14">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Limited time</p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
              Up to 40% off,<br />on our little favourites.
            </h1>
            <p className="mt-4 max-w-md opacity-90">
              A curated edit of best-selling pieces at their friendliest prices yet.
            </p>
          </div>
          <div className="flex items-center justify-center bg-primary-foreground/10 p-10">
            <div>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest opacity-80">Sale ends in</p>
              <Countdown target={target} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x mx-auto max-w-7xl pt-14 pb-24">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
