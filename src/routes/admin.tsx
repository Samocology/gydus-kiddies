import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  LayoutDashboard, Package, Percent, Settings as SettingsIcon, ShoppingCart, TrendingUp,
  Users, BarChart3, Plus, PenSquare, Trash2, LogOut, Search, X, Upload, ImagePlus,
  Eye, Truck as TruckIcon, CheckCircle2, PackageCheck, MoreHorizontal, AlertTriangle,
} from "lucide-react";
import { products as seedProducts, type Product, productImage } from "@/lib/data";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Gydus Kiddies" }] }),
  component: AdminPage,
});

const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "customers", label: "Customers", icon: Users },
  { key: "coupons", label: "Coupons", icon: Percent },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "payments", label: "Payments", icon: TrendingUp },
  { key: "settings", label: "Settings", icon: SettingsIcon },
] as const;
type NavKey = (typeof nav)[number]["key"];

const salesData = [
  { m: "Sep", v: 820 }, { m: "Oct", v: 1150 }, { m: "Nov", v: 980 }, { m: "Dec", v: 1620 },
  { m: "Jan", v: 1780 }, { m: "Feb", v: 1420 }, { m: "Mar", v: 2050 },
];

type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
interface AdminOrder { id: string; customer: string; email: string; total: number; status: OrderStatus; items: number; date: string; }

const seedOrders: AdminOrder[] = [
  { id: "KK-1042", customer: "Adaeze O.", email: "adaeze@example.com", total: 34500, status: "Processing", items: 3, date: "2026-07-14" },
  { id: "KK-1041", customer: "Ibrahim S.", email: "ibrahim@example.com", total: 18500, status: "Shipped",   items: 2, date: "2026-07-13" },
  { id: "KK-1040", customer: "Chiamaka N.", email: "chiamaka@example.com", total: 27200, status: "Delivered", items: 4, date: "2026-07-12" },
  { id: "KK-1039", customer: "Tunde A.", email: "tunde@example.com", total: 15900, status: "Packed", items: 1, date: "2026-07-12" },
  { id: "KK-1038", customer: "Blessing K.", email: "blessing@example.com", total: 12500, status: "Delivered", items: 2, date: "2026-07-11" },
];

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  uses: number;
  minSpend?: number;
  expiresAt?: string;
  active: boolean;
  description?: string;
}

interface StoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  currency: string;
  address: string;
  freeShippingThreshold: number;
  lagosRate: number;
  nationwideRate: number;
  cod: boolean;
  paystack: boolean;
  transfer: boolean;
  instagram: string;
  metaDescription: string;
}

const defaultSettings: StoreSettings = {
  storeName: "Gydus Kiddies",
  tagline: "Premium kids fashion",
  email: "hello@gyduskiddies.com",
  phone: "+234 800 123 4567",
  whatsapp: "2348000000000",
  currency: "NGN",
  address: "24 Bourdillon Rd, Ikoyi, Lagos",
  freeShippingThreshold: 25000,
  lagosRate: 2500,
  nationwideRate: 5000,
  cod: true,
  paystack: true,
  transfer: true,
  instagram: "@gyduskiddies",
  metaDescription: "Premium children's clothing, shoes and accessories.",
};

function useLocal<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setState(JSON.parse(raw) as T); } catch {}
    setHydrated(true);
  }, [key]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state, hydrated]);
  return [state, setState];
}

function AdminPage() {
  const [active, setActive] = useState<NavKey>("dashboard");
  const [productList, setProductList] = useLocal<Product[]>("kk_admin_products", seedProducts);
  const [coupons, setCoupons] = useLocal<Coupon[]>("kk_admin_coupons", [
    { id: "c1", code: "GYDUS15", type: "percent", value: 15, uses: 128, active: true, description: "Welcome offer" },
    { id: "c2", code: "WELCOME5K", type: "fixed", value: 5000, uses: 42, active: true, minSpend: 20000 },
    { id: "c3", code: "SCHOOL10", type: "percent", value: 10, uses: 87, active: false, description: "Back-to-school promo" },
  ]);
  const [orders, setOrders] = useLocal<AdminOrder[]>("kk_admin_orders", seedOrders);
  const [settings, setSettings] = useLocal<StoreSettings>("kk_admin_settings", defaultSettings);

  const topProducts = useMemo(() => productList.slice(0, 5).map((p, i) => ({ name: p.name, sales: 320 - i * 45 })), [productList]);
  const lowStock = useMemo(() => productList.filter((p) => p.stock <= 5), [productList]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* TOPBAR */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:h-16 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <span className="font-display text-base font-semibold">G</span>
          </div>
          <span className="hidden font-display text-lg font-semibold sm:inline">Gydus admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search…" className="w-64 rounded-full border border-border bg-muted/40 py-2 pl-9 pr-4 text-sm focus:bg-background focus:border-primary focus:outline-none" />
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">A</div>
          <Link to="/" className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium sm:inline-flex">
            <LogOut className="h-3.5 w-3.5" /> Exit admin
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 p-4 md:p-6">
        {/* SIDEBAR */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-medium transition ${active === n.key ? "bg-foreground text-background" : "text-foreground/70 hover:bg-background hover:text-foreground"}`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MOBILE TABS */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 overflow-x-auto border-t border-border bg-background/95 backdrop-blur">
          <div className="flex min-w-max gap-1 p-2">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${active === n.key ? "bg-foreground text-background" : "text-foreground/60"}`}
              >
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <main className="flex-1 min-w-0 space-y-6 pb-24 lg:pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin · {active}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
              {active === "dashboard" ? "Store overview" : nav.find((n) => n.key === active)?.label}
            </h1>
          </div>

          {active === "dashboard" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <Stat label="Revenue (MTD)" value={formatNaira(2_050_000)} delta="+12.4%" />
                <Stat label="Orders" value={String(orders.length)} delta="+8.1%" />
                <Stat label="Visitors" value="12.4k" delta="+3.2%" />
                <Stat label="AOV" value={formatNaira(15_600)} delta="+2.1%" />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <Panel title="Sales — last 7 months" className="lg:col-span-2">
                  <div className="h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.72 0.17 32)" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="oklch(0.72 0.17 32)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                        <Tooltip />
                        <Area dataKey="v" stroke="oklch(0.72 0.17 32)" strokeWidth={2.5} fill="url(#g1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
                <Panel title="Top products">
                  <div className="h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts} layout="vertical" margin={{ left: 8 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={110} />
                        <Tooltip />
                        <Bar dataKey="sales" fill="oklch(0.72 0.17 32)" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Recent orders">
                  <OrdersTable rows={orders.slice(0, 5)} onChange={setOrders} orders={orders} compact />
                </Panel>
                <Panel title={`Low stock (${lowStock.length})`}>
                  <ul className="divide-y divide-border">
                    {lowStock.slice(0, 6).map((p) => (
                      <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="flex items-center gap-3 min-w-0">
                          <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                          <span className="truncate font-medium">{p.name}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{p.stock} left</span>
                      </li>
                    ))}
                    {lowStock.length === 0 && <li className="py-4 text-sm text-muted-foreground">All products well stocked.</li>}
                  </ul>
                </Panel>
              </div>
            </>
          )}

          {active === "products" && (
            <ProductsPanel list={productList} setList={setProductList} />
          )}

          {active === "orders" && (
            <Panel title={`All orders (${orders.length})`}>
              <OrdersTable rows={orders} orders={orders} onChange={setOrders} />
            </Panel>
          )}

          {active === "customers" && (
            <Panel title="Customers">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                    <tr><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Orders</th><th className="pb-3 text-right">LTV</th></tr>
                  </thead>
                  <tbody>
                    {["Adaeze O.","Ibrahim S.","Chiamaka N.","Tunde A.","Blessing K."].map((n, i) => (
                      <tr key={n} className="border-t border-border">
                        <td className="py-3 font-medium">{n}</td>
                        <td className="py-3 text-muted-foreground">{n.split(" ")[0].toLowerCase()}@example.com</td>
                        <td className="py-3">{5 - i}</td>
                        <td className="py-3 text-right">{formatNaira(80000 - i * 12000)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}

          {active === "coupons" && <CouponsPanel list={coupons} setList={setCoupons} />}

          {active === "analytics" && (
            <Panel title="Traffic sources">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { s: "Instagram", v: 4200 },{ s: "Direct", v: 3200 },{ s: "Google", v: 2600 },{ s: "WhatsApp", v: 1800 },{ s: "Referral", v: 900 }
                  ]}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="s" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="v" fill="oklch(0.75 0.12 220)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          )}

          {active === "payments" && (
            <Panel title="Payments — Nigeria">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { name: "Paystack", status: "Connected" },
                  { name: "Flutterwave", status: "Connected" },
                  { name: "Bank Transfer", status: "Active" },
                ].map((p) => (
                  <div key={p.name} className="rounded-2xl border border-border p-5">
                    <p className="font-medium">{p.name}</p>
                    <p className="mt-1 text-xs text-primary">{p.status}</p>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {active === "settings" && <SettingsPanel value={settings} onChange={setSettings} />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================================
   PRODUCTS
   ========================================================================= */
function ProductsPanel({ list, setList }: { list: Product[]; setList: React.Dispatch<React.SetStateAction<Product[]>> }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirming, setConfirming] = useState<Product | null>(null);
  const [q, setQ] = useState("");

  const filtered = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (p: Product) => { setEditing(p); setShowForm(true); };
  const doRemove = () => {
    if (!confirming) return;
    setList((prev) => prev.filter((x) => x.id !== confirming.id));
    toast.success("Product deleted");
    setConfirming(null);
  };

  const save = (data: Partial<Product> & { name: string; price: number }) => {
    if (editing) {
      setList((prev) => prev.map((x) => (x.id === editing.id ? { ...editing, ...data } : x)));
      toast.success("Product updated");
    } else {
      const id = `p-${Date.now()}`;
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const primary = data.image || data.images?.[0] || productImage(id, 0);
      const p: Product = {
        id, slug: `${slug}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        tileVariant: 1, emoji: "✨",
        rating: 5, reviewCount: 0,
        ageGroups: (data.ageGroups && data.ageGroups.length ? data.ageGroups : ["toddlers"]),
        gender: data.gender ?? "unisex",
        name: data.name,
        price: data.price,
        compareAt: data.compareAt,
        category: data.category ?? "baby-wear",
        categoryName: data.categoryName ?? "Baby Wear",
        brand: data.brand ?? "Little Lark",
        colors: data.colors ?? ["#F6C6B0"],
        sizes: data.sizes ?? ["3-4y", "5-6y"],
        stock: data.stock ?? 10,
        description: data.description ?? "",
        image: primary,
        images: data.images ?? [primary],
        isNew: data.isNew ?? true,
        onSale: data.onSale ?? false,
        isBestSeller: data.isBestSeller ?? false,
      };
      setList((prev) => [p, ...prev]);
      toast.success("Product added");
    }
    setShowForm(false); setEditing(null);
  };

  return (
    <>
      <Panel
        title={`Products (${list.length})`}
        action={
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-56 rounded-full border border-border bg-background py-1.5 pl-8 pr-3 text-xs focus:border-primary focus:outline-none" />
            </div>
            <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Add product
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="pb-3">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{p.categoryName}</td>
                  <td className="py-3">{formatNaira(p.price)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.stock <= 5 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{p.stock}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => openEdit(p)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label="Edit"><PenSquare className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setConfirming(p)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-destructive/10 hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No products match "{q}".</p>}
        </div>
      </Panel>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? "Edit product" : "New product"} size="xl">
        <ProductForm key={editing?.id ?? "new"} initial={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={save} />
      </Modal>

      <ConfirmDialog
        open={!!confirming}
        title="Delete product?"
        description={confirming ? `“${confirming.name}” will be permanently removed from your catalogue. This can't be undone.` : ""}
        confirmLabel="Delete product"
        onConfirm={doRemove}
        onCancel={() => setConfirming(null)}
      />
    </>
  );
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Product | null;
  onSave: (p: Partial<Product> & { name: string; price: number }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    price: initial?.price ?? 0,
    compareAt: initial?.compareAt ?? 0,
    category: initial?.category ?? "baby-wear",
    categoryName: initial?.categoryName ?? "Baby Wear",
    stock: initial?.stock ?? 10,
    brand: initial?.brand ?? "Little Lark",
    description: initial?.description ?? "",
    sizes: (initial?.sizes ?? ["3-4y","5-6y"]).join(", "),
    colors: (initial?.colors ?? ["#F6C6B0"]).join(", "),
    isNew: initial?.isNew ?? true,
    onSale: initial?.onSale ?? false,
    isBestSeller: initial?.isBestSeller ?? false,
  });

  // Multi-image gallery. Primary image is first in the list.
  const initialImages = initial?.images && initial.images.length > 0
    ? initial.images
    : (initial?.image ? [initial.image] : []);
  const [images, setImages] = useState<string[]>(initialImages);
  const [imageUrl, setImageUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setImages((p) => [...p, url]);
    setImageUrl("");
  };

  const onFilePick = async (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).slice(0, 8).map(
      (f) =>
        new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(f);
        }),
    );
    try {
      const urls = await Promise.all(readers);
      setImages((p) => [...p, ...urls]);
    } catch {
      toast.error("Couldn't read one of those files");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => setImages((p) => p.filter((_, i) => i !== idx));
  const makePrimary = (idx: number) =>
    setImages((p) => {
      if (idx === 0) return p;
      const copy = [...p];
      const [pick] = copy.splice(idx, 1);
      return [pick, ...copy];
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return toast.error("Name and price are required");
    if (images.length === 0) return toast.error("Add at least one product image");
    onSave({
      name: form.name.trim(),
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      category: form.category,
      categoryName: form.categoryName,
      stock: Number(form.stock),
      brand: form.brand,
      description: form.description,
      image: images[0],
      images,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      isNew: form.isNew, onSale: form.onSale, isBestSeller: form.isBestSeller,
    });
  };

  const input = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition";
  const label = "block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* MEDIA */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h4 className="font-display text-base font-semibold">Product images</h4>
            <p className="text-xs text-muted-foreground">Upload up to 8. The first image is used as the main product photo.</p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{images.length}/8</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src, idx) => (
            <div key={idx} className={`group relative aspect-square overflow-hidden rounded-2xl border-2 ${idx === 0 ? "border-primary" : "border-transparent"} bg-muted`}>
              <img src={src} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
              {idx === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">Main</span>
              )}
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/70 via-transparent p-2 opacity-0 transition group-hover:opacity-100">
                {idx !== 0 ? (
                  <button type="button" onClick={() => makePrimary(idx)} className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-foreground">Set main</button>
                ) : <span />}
                <button type="button" onClick={() => removeImage(idx)} className="grid h-7 w-7 place-items-center rounded-full bg-white/95 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {images.length < 8 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <div className="text-center">
                <ImagePlus className="mx-auto h-6 w-6" />
                <p className="mt-1.5 text-xs font-medium">Upload</p>
              </div>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFilePick(e.target.files)} />

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste an image URL…" className={`${input} sm:flex-1`} />
          <button type="button" onClick={addImageUrl} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-medium hover:bg-muted">
            <Plus className="h-3.5 w-3.5" /> Add URL
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-medium hover:bg-muted">
            <Upload className="h-3.5 w-3.5" /> Upload files
          </button>
        </div>
      </section>

      <hr className="border-border" />

      {/* DETAILS */}
      <section>
        <h4 className="mb-3 font-display text-base font-semibold">Product details</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Name</label>
            <input required placeholder="e.g. Peach Ruffle Sundress" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
          </div>
          <div>
            <label className={label}>Brand</label>
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={input} />
          </div>
          <div>
            <label className={label}>Category</label>
            <select value={form.category} onChange={(e) => {
              const cat = e.target.value;
              const name = cat.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");
              setForm({ ...form, category: cat, categoryName: name });
            }} className={input}>
              {["baby-wear","school-wear","shoes","sandals","socks","toys","bags","accessories","birthday-clothes","party-dresses"].map((c) => (
                <option key={c} value={c}>{c.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" ")}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Description</label>
            <textarea placeholder="What makes this piece special?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={input} />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* PRICING */}
      <section>
        <h4 className="mb-3 font-display text-base font-semibold">Pricing & inventory</h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Price (₦)</label>
            <input required type="number" min={0} value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={input} />
          </div>
          <div>
            <label className={label}>Compare-at (₦)</label>
            <input type="number" min={0} value={form.compareAt || ""} onChange={(e) => setForm({ ...form, compareAt: Number(e.target.value) })} className={input} />
          </div>
          <div>
            <label className={label}>Stock</label>
            <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className={input} />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* VARIANTS */}
      <section>
        <h4 className="mb-3 font-display text-base font-semibold">Variants</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Sizes (comma-separated)</label>
            <input placeholder="e.g. 3-4y, 5-6y, 7-8y" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={input} />
          </div>
          <div>
            <label className={label}>Colours (hex, comma-separated)</label>
            <input placeholder="#F6C6B0, #B7DCEB" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className={input} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="h-4 w-4" /> New arrival</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.onSale} onChange={(e) => setForm({ ...form, onSale: e.target.checked })} className="h-4 w-4" /> On sale</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="h-4 w-4" /> Best seller</label>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-2 border-t border-border bg-background px-6 py-4">
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
        <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">
          {initial ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   ORDERS
   ========================================================================= */
const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-amber-100 text-amber-800",
  Packed: "bg-sky-100 text-sky-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

function OrdersTable({
  rows,
  orders,
  onChange,
  compact,
}: {
  rows: AdminOrder[];
  orders: AdminOrder[];
  onChange: React.Dispatch<React.SetStateAction<AdminOrder[]>>;
  compact?: boolean;
}) {
  const [viewing, setViewing] = useState<AdminOrder | null>(null);
  const [confirming, setConfirming] = useState<AdminOrder | null>(null);

  const setStatus = (id: string, status: OrderStatus) => {
    onChange(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} → ${status}`);
  };
  const advance = (o: AdminOrder) => {
    const flow: OrderStatus[] = ["Processing", "Packed", "Shipped", "Delivered"];
    const idx = flow.indexOf(o.status);
    const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : o.status;
    setStatus(o.id, next);
  };
  const doDelete = () => {
    if (!confirming) return;
    onChange(orders.filter((o) => o.id !== confirming.id));
    toast.success(`Order ${confirming.id} deleted`);
    setConfirming(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              {!compact && <th className="pb-3">Date</th>}
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="py-3 font-medium">{o.id}</td>
                <td className="py-3">
                  <p className="font-medium">{o.customer}</p>
                  {!compact && <p className="text-xs text-muted-foreground">{o.email}</p>}
                </td>
                {!compact && <td className="py-3 text-muted-foreground">{o.date}</td>}
                <td className="py-3">{formatNaira(o.total)}</td>
                <td className="py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${statusStyles[o.status]} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    {(["Processing","Packed","Shipped","Delivered","Cancelled"] as OrderStatus[]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-right">
                  <div className="inline-flex gap-1">
                    <IconBtn label="View" onClick={() => setViewing(o)}><Eye className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn label="Advance status" onClick={() => advance(o)} disabled={o.status === "Delivered" || o.status === "Cancelled"}>
                      {o.status === "Processing" && <PackageCheck className="h-3.5 w-3.5" />}
                      {o.status === "Packed" && <TruckIcon className="h-3.5 w-3.5" />}
                      {o.status === "Shipped" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {(o.status === "Delivered" || o.status === "Cancelled") && <MoreHorizontal className="h-3.5 w-3.5" />}
                    </IconBtn>
                    <IconBtn label="Delete" danger onClick={() => setConfirming(o)}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No orders yet.</p>}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? `Order ${viewing.id}` : ""} size="md">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer" value={viewing.customer} />
              <Field label="Email" value={viewing.email} />
              <Field label="Date" value={viewing.date} />
              <Field label="Items" value={String(viewing.items)} />
              <Field label="Total" value={formatNaira(viewing.total)} />
              <Field label="Status"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[viewing.status]}`}>{viewing.status}</span></Field>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
              <button onClick={() => { advance(viewing); setViewing({ ...viewing, status: nextStatus(viewing.status) }); }} className="rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background">
                Move to next stage
              </button>
              <button onClick={() => setViewing(null)} className="rounded-full border border-border px-5 py-2 text-xs font-medium">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirming}
        title="Delete this order?"
        description={confirming ? `Order ${confirming.id} for ${confirming.customer} will be removed from your records.` : ""}
        confirmLabel="Delete order"
        onConfirm={doDelete}
        onCancel={() => setConfirming(null)}
      />
    </>
  );
}
function nextStatus(s: OrderStatus): OrderStatus {
  const flow: OrderStatus[] = ["Processing", "Packed", "Shipped", "Delivered"];
  const i = flow.indexOf(s);
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : s;
}

/* =========================================================================
   COUPONS
   ========================================================================= */
function CouponsPanel({ list, setList }: { list: Coupon[]; setList: React.Dispatch<React.SetStateAction<Coupon[]>> }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [confirming, setConfirming] = useState<Coupon | null>(null);

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setShowForm(true); };
  const doDelete = () => {
    if (!confirming) return;
    setList((prev) => prev.filter((x) => x.id !== confirming.id));
    toast.success(`Coupon ${confirming.code} deleted`);
    setConfirming(null);
  };
  const save = (data: Omit<Coupon, "id" | "uses">) => {
    if (editing) {
      setList((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...data, code: data.code.toUpperCase() } : x)));
      toast.success("Coupon updated");
    } else {
      setList((prev) => [{ id: `c-${Date.now()}`, uses: 0, ...data, code: data.code.toUpperCase() }, ...prev]);
      toast.success("Coupon created");
    }
    setShowForm(false); setEditing(null);
  };
  const toggle = (c: Coupon) => {
    setList((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  };

  return (
    <>
      <Panel
        title={`Coupons (${list.length})`}
        action={
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
            <Plus className="h-3.5 w-3.5" /> New coupon
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <div key={c.id} className={`group rounded-2xl border p-5 transition ${c.active ? "border-border bg-background" : "border-dashed border-border bg-muted/40"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-foreground px-3 py-1 font-mono text-xs font-bold tracking-widest text-background">{c.code}</span>
                    <button onClick={() => toggle(c)} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${c.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>
                      {c.active ? "Active" : "Paused"}
                    </button>
                  </div>
                  <p className="mt-2.5 font-display text-2xl font-semibold">
                    {c.type === "percent" ? `${c.value}% off` : `${formatNaira(c.value)} off`}
                  </p>
                  {c.description && <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span>{c.uses} uses</span>
                    {c.minSpend ? <span>· min {formatNaira(c.minSpend)}</span> : null}
                    {c.expiresAt ? <span>· expires {c.expiresAt}</span> : null}
                  </div>
                </div>
                <div className="flex gap-1">
                  <IconBtn label="Edit" onClick={() => openEdit(c)}><PenSquare className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Delete" danger onClick={() => setConfirming(c)}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">No coupons yet — create your first one.</p>}
        </div>
      </Panel>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? "Edit coupon" : "New coupon"} size="md">
        <CouponForm key={editing?.id ?? "new"} initial={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} />
      </Modal>

      <ConfirmDialog
        open={!!confirming}
        title="Delete this coupon?"
        description={confirming ? `Code “${confirming.code}” will stop working immediately for all customers. This can't be undone.` : ""}
        confirmLabel="Delete coupon"
        onConfirm={doDelete}
        onCancel={() => setConfirming(null)}
      />
    </>
  );
}

function CouponForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Coupon | null;
  onSave: (c: Omit<Coupon, "id" | "uses">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Coupon, "id" | "uses">>({
    code: initial?.code ?? "",
    type: initial?.type ?? "percent",
    value: initial?.value ?? 10,
    minSpend: initial?.minSpend,
    expiresAt: initial?.expiresAt,
    active: initial?.active ?? true,
    description: initial?.description ?? "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return toast.error("Give the coupon a code");
    if (!form.value) return toast.error("Set a value greater than 0");
    onSave({ ...form, code: form.code.toUpperCase().trim() });
  };

  const input = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition";
  const label = "block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className={label}>Coupon code</label>
        <input placeholder="e.g. WELCOME15" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={`${input} font-mono uppercase tracking-widest`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })} className={input}>
            <option value="percent">Percentage off</option>
            <option value="fixed">Fixed amount (₦)</option>
          </select>
        </div>
        <div>
          <label className={label}>{form.type === "percent" ? "Percent" : "Amount (₦)"}</label>
          <input type="number" min={0} value={form.value || ""} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className={input} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Min spend (₦) — optional</label>
          <input type="number" min={0} value={form.minSpend ?? ""} onChange={(e) => setForm({ ...form, minSpend: e.target.value ? Number(e.target.value) : undefined })} className={input} />
        </div>
        <div>
          <label className={label}>Expires — optional</label>
          <input type="date" value={form.expiresAt ?? ""} onChange={(e) => setForm({ ...form, expiresAt: e.target.value || undefined })} className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Description — optional</label>
        <input placeholder="Internal note, e.g. Summer promo" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={input} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4" />
        Active immediately
      </label>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
        <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">
          {initial ? "Save changes" : "Create coupon"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   SETTINGS
   ========================================================================= */
function SettingsPanel({ value, onChange }: { value: StoreSettings; onChange: React.Dispatch<React.SetStateAction<StoreSettings>> }) {
  const [draft, setDraft] = useState<StoreSettings>(value);
  useEffect(() => setDraft(value), [value]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(value);
  const input = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition";
  const label = "block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";
  const save = () => { onChange(draft); toast.success("Settings saved"); };
  const reset = () => setDraft(value);

  return (
    <div className="space-y-4">
      <Panel title="Store profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Store name</label><input className={input} value={draft.storeName} onChange={(e) => setDraft({ ...draft, storeName: e.target.value })} /></div>
          <div><label className={label}>Tagline</label><input className={input} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={label}>Meta description (SEO)</label><textarea rows={2} className={input} value={draft.metaDescription} onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })} /></div>
          <div>
            <label className={label}>Currency</label>
            <select className={input} value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })}>
              <option value="NGN">Nigerian Naira (₦)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          <div><label className={label}>Instagram handle</label><input className={input} value={draft.instagram} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} /></div>
        </div>
      </Panel>

      <Panel title="Contact & location">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Support email</label><input type="email" className={input} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
          <div><label className={label}>Phone</label><input className={input} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
          <div><label className={label}>WhatsApp number (no +)</label><input className={input} value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} /></div>
          <div><label className={label}>Store address</label><input className={input} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></div>
        </div>
      </Panel>

      <Panel title="Shipping">
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className={label}>Free shipping over (₦)</label><input type="number" className={input} value={draft.freeShippingThreshold} onChange={(e) => setDraft({ ...draft, freeShippingThreshold: Number(e.target.value) })} /></div>
          <div><label className={label}>Lagos rate (₦)</label><input type="number" className={input} value={draft.lagosRate} onChange={(e) => setDraft({ ...draft, lagosRate: Number(e.target.value) })} /></div>
          <div><label className={label}>Nationwide rate (₦)</label><input type="number" className={input} value={draft.nationwideRate} onChange={(e) => setDraft({ ...draft, nationwideRate: Number(e.target.value) })} /></div>
        </div>
      </Panel>

      <Panel title="Payment methods">
        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="Paystack" description="Cards, USSD, bank transfer" checked={draft.paystack} onChange={(v) => setDraft({ ...draft, paystack: v })} />
          <Toggle label="Bank transfer" description="Direct account transfer" checked={draft.transfer} onChange={(v) => setDraft({ ...draft, transfer: v })} />
          <Toggle label="Pay on delivery" description="Lagos & Abuja only" checked={draft.cod} onChange={(v) => setDraft({ ...draft, cod: v })} />
        </div>
      </Panel>

      <div className={`sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-foreground p-3 text-background shadow-lift transition ${dirty ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <p className="pl-3 text-sm">You have unsaved changes.</p>
        <div className="flex gap-2">
          <button onClick={reset} className="rounded-full border border-background/20 px-4 py-1.5 text-xs font-medium">Discard</button>
          <button onClick={save} className="rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground">Save changes</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
    >
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className={`relative mt-1 h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-4" : "left-0.5"}`} />
      </span>
    </button>
  );
}

/* =========================================================================
   SHARED
   ========================================================================= */
function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl bg-background p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold md:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-primary">{delta} vs last month</p>
    </div>
  );
}

function Panel({ title, children, action, className = "" }: { title: string; children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-background p-5 shadow-soft md:p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold md:text-xl">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function IconBtn({
  children, onClick, label, danger, disabled,
}: { children: React.ReactNode; onClick: () => void; label: string; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`grid h-8 w-8 place-items-center rounded-full transition ${danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted"} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-1 font-medium">{children ?? value}</div>
    </div>
  );
}

function Modal({
  open, onClose, title, children, size = "md",
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "md" | "xl" }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;
  const width = size === "xl" ? "max-w-3xl" : "max-w-lg";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${width} rounded-t-3xl bg-background shadow-lift sm:rounded-3xl`}>
        <div className="flex items-center justify-between border-b border-border p-5 md:p-6">
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  open, title, description, confirmLabel, onConfirm, onCancel,
}: { open: boolean; title: string; description: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-background p-6 shadow-lift">
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
          <button onClick={onConfirm} className="rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
