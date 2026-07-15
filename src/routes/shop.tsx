import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Layout, PageHead } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products, categories, type AgeGroup } from "@/lib/data";

interface ShopSearch {
  age?: string;
  gender?: string;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "new" | "price-asc" | "price-desc" | "popular";
}

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Gydus Kiddies" },
      { name: "description", content: "Browse the full Gydus Kiddies catalogue with smart filters for age, gender, size, brand and more." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    age: typeof search.age === "string" ? search.age : undefined,
    gender: typeof search.gender === "string" ? search.gender : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    brand: typeof search.brand === "string" ? search.brand : undefined,
    color: typeof search.color === "string" ? search.color : undefined,
    size: typeof search.size === "string" ? search.size : undefined,
    minPrice: typeof search.minPrice === "number" ? search.minPrice : undefined,
    maxPrice: typeof search.maxPrice === "number" ? search.maxPrice : undefined,
    inStock: typeof search.inStock === "boolean" ? search.inStock : undefined,
    sort: (["new","price-asc","price-desc","popular"] as const).includes(search.sort as never)
      ? (search.sort as ShopSearch["sort"])
      : undefined,
  }),
  component: ShopPage,
});

const ageOptions: { value: AgeGroup; label: string }[] = [
  { value: "babies", label: "Babies" },
  { value: "toddlers", label: "Toddlers" },
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "teenagers", label: "Teenagers" },
];

const brands = Array.from(new Set(products.map((p) => p.brand)));
const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });
  const clear = () => navigate({ search: {} as ShopSearch });

  const filtered = useMemo(() => {
    let list = products.slice();
    if (search.age) list = list.filter((p) => p.ageGroups.includes(search.age as AgeGroup));
    if (search.gender) list = list.filter((p) => p.gender === search.gender);
    if (search.category) list = list.filter((p) => p.category === search.category);
    if (search.brand) list = list.filter((p) => p.brand === search.brand);
    if (search.color) list = list.filter((p) => p.colors.includes(search.color!));
    if (search.size) list = list.filter((p) => p.sizes.includes(search.size!));
    if (typeof search.minPrice === "number") list = list.filter((p) => p.price >= search.minPrice!);
    if (typeof search.maxPrice === "number") list = list.filter((p) => p.price <= search.maxPrice!);
    if (search.inStock) list = list.filter((p) => p.stock > 0);

    switch (search.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "popular": list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "new":
      default: list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return list;
  }, [search]);

  const activeCount = Object.values(search).filter((v) => v !== undefined && v !== "").length;

  const Filters = (
    <div className="space-y-8">
      <FilterGroup label="Age">
        <PillGroup
          options={ageOptions.map((a) => ({ value: a.value, label: a.label }))}
          value={search.age}
          onChange={(v) => update({ age: v })}
        />
      </FilterGroup>
      <FilterGroup label="Gender">
        <PillGroup
          options={[{ value: "girls", label: "Girls" }, { value: "boys", label: "Boys" }, { value: "unisex", label: "Unisex" }]}
          value={search.gender}
          onChange={(v) => update({ gender: v })}
        />
      </FilterGroup>
      <FilterGroup label="Category">
        <PillGroup
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          value={search.category}
          onChange={(v) => update({ category: v })}
        />
      </FilterGroup>
      <FilterGroup label="Size">
        <PillGroup
          options={allSizes.map((s) => ({ value: s, label: s }))}
          value={search.size}
          onChange={(v) => update({ size: v })}
        />
      </FilterGroup>
      <FilterGroup label="Brand">
        <PillGroup
          options={brands.map((b) => ({ value: b, label: b }))}
          value={search.brand}
          onChange={(v) => update({ brand: v })}
        />
      </FilterGroup>
      <FilterGroup label="Colour">
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              aria-label={c}
              onClick={() => update({ color: search.color === c ? undefined : c })}
              className={`h-9 w-9 rounded-full border-2 transition ${search.color === c ? "border-primary scale-110" : "border-white shadow-soft"}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Price">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₦"
            value={search.minPrice ?? ""}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max ₦"
            value={search.maxPrice ?? ""}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </FilterGroup>
      <FilterGroup label="Availability">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!search.inStock}
            onChange={(e) => update({ inStock: e.target.checked || undefined })}
            className="h-4 w-4 rounded"
          />
          In stock only
        </label>
      </FilterGroup>
    </div>
  );

  return (
    <Layout>
      <PageHead eyebrow="The Shop" title="Everything, beautifully sorted." lede="Filter by age, gender, size, brand and colour. Smooth as it should be." />

      <section className="container-x mx-auto max-w-7xl pb-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            {activeCount > 0 && (
              <button onClick={clear} className="text-sm font-medium text-primary underline underline-offset-4">
                Clear all
              </button>
            )}
          </div>
          <select
            value={search.sort ?? "new"}
            onChange={(e) => update({ sort: e.target.value as ShopSearch["sort"] })}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="new">Newest</option>
            <option value="popular">Most loved</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">{Filters}</aside>
          <div>
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-16 text-center">
                <p className="font-display text-2xl">Nothing matches those filters</p>
                <p className="mt-2 text-sm text-muted-foreground">Try clearing a few or exploring another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-background p-6 shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">Filters</h3>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {Filters}
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-8 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background"
            >
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/60">{label}</h4>
      {children}
    </div>
  );
}

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(active ? undefined : o.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground/80 hover:border-foreground/40"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
