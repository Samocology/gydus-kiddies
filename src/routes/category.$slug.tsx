import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout, PageHead } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/data";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category, items: products.filter((p) => p.category === params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — Gydus Kiddies` },
          { name: "description", content: loaderData.category.blurb },
        ]
      : [{ title: "Category — Gydus Kiddies" }],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <Layout>
      <div className="container-x mx-auto max-w-3xl py-24 text-center">
        <h1 className="font-display text-4xl">Category not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-primary underline underline-offset-4">Back to shop</Link>
      </div>
    </Layout>
  ),
});

function CategoryPage() {
  const { category, items } = Route.useLoaderData();
  return (
    <Layout>
      <PageHead eyebrow={`${category.emoji} Category`} title={category.name} lede={category.blurb} />
      <section className="container-x mx-auto max-w-7xl pb-24">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                c.slug === category.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground/40"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-16 text-center">
            <p className="font-display text-2xl">Nothing here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon — new pieces drop weekly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p: (typeof products)[number]) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
