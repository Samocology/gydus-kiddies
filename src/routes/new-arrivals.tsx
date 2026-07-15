import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHead } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Gydus Kiddies" },
      { name: "description", content: "The freshest kids' pieces, added weekly." },
    ],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  const items = products
    .filter((p) => p.isNew)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return (
    <Layout>
      <PageHead eyebrow="Just landed" title="New arrivals" lede="The freshest pieces, updated weekly." />
      <section className="container-x mx-auto max-w-7xl pb-24">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
