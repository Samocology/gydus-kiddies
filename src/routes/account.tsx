import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, Check, Gift, LogOut, Package, PenSquare, Plus, Sparkles, Star, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { products } from "@/lib/data";
import { formatNaira } from "@/lib/format";
import { useStore, type Address } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My account — Gydus Kiddies" }] }),
  component: AccountPage,
});

const tabs = ["Overview", "Orders", "Addresses", "Wishlist", "Rewards", "Notifications"] as const;
type Tab = (typeof tabs)[number];

function AccountPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const { recentlyViewed, wishlist, orders } = useStore();
  const recent = recentlyViewed.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 4);

  return (
    <Layout>
      <section className="container-x mx-auto max-w-7xl pt-6 md:pt-10 pb-24">
        {/* PROFILE HEADER */}
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-peach/60 via-cream/60 to-sky/40 p-5 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-foreground text-2xl font-semibold text-background md:h-20 md:w-20">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Welcome back</p>
                <h1 className="mt-0.5 truncate font-display text-2xl font-semibold md:text-3xl">Hi, Adaeze 👋</h1>
                <p className="mt-0.5 truncate text-xs text-foreground/60 md:text-sm">adaeze@example.com · Member since 2024</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
              <MiniStat label="Orders" value={orders.length.toString()} />
              <MiniStat label="Points" value="480" />
              <MiniStat label="Wishlist" value={wishlist.length.toString()} />
            </div>
          </div>
        </div>

        {/* TABS — horizontal scroll on mobile */}
        <div className="mt-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="inline-flex min-w-full gap-1 rounded-full bg-muted/60 p-1 md:min-w-0">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${tab === t ? "bg-background text-foreground shadow-soft" : "text-foreground/60"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {tab === "Overview" && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Package} label="Total orders" value={orders.length.toString()} />
                <StatCard icon={Star} label="Loyalty points" value="480" />
                <StatCard icon={Gift} label="Referral credit" value={formatNaira(5000)} />
              </div>

              <Card title="Recently viewed">
                {recent.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing yet — go browse a bit.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {recent.map((p) => (
                      <Link key={p!.id} to="/product/$id" params={{ id: p!.id }} className="group overflow-hidden rounded-2xl bg-muted">
                        <img src={p!.image} alt={p!.name} className="aspect-square w-full object-cover transition group-hover:scale-105" />
                        <p className="line-clamp-1 p-2 text-xs font-medium">{p!.name}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>

              <Card title="Birthday reminders">
                <p className="text-sm text-muted-foreground">Save your children's birthdays — get 15% off a week before.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input placeholder="Child's name" className="rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                  <input type="date" className="rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
                <button className="mt-3 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Add reminder</button>
              </Card>
            </>
          )}

          {tab === "Orders" && <OrdersPanel />}
          {tab === "Addresses" && <AddressesPanel />}
          {tab === "Wishlist" && (
            <Card title={`Wishlist (${wishlist.length})`}>
              <Link to="/wishlist" className="text-sm font-medium text-primary underline underline-offset-4">Go to full wishlist →</Link>
            </Card>
          )}
          {tab === "Rewards" && <RewardsPanel />}
          {tab === "Notifications" && <NotificationsPanel />}
        </div>

        <button className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </Layout>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 text-center backdrop-blur sm:px-4">
      <p className="font-display text-lg font-semibold leading-none">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-widest text-foreground/60">{label}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-peach/60">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-soft md:p-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-semibold md:text-2xl">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function OrdersPanel() {
  const { orders } = useStore();
  if (orders.length === 0) {
    return (
      <Card title="Order history">
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
          <Link to="/shop" className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4">Start shopping →</Link>
        </div>
      </Card>
    );
  }
  return (
    <Card title="Order history">
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{o.id}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{o.status}</span>
                <span className="font-semibold">{formatNaira(o.total)}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {o.items.slice(0, 5).map((it, i) => (
                <img key={i} src={it.image} alt={it.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AddressesPanel() {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useStore();
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const startNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <Card
      title="Saved addresses"
      action={
        !showForm && (
          <button onClick={startNew} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> Add address
          </button>
        )
      }
    >
      {showForm && (
        <AddressForm
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) {
              updateAddress(editing.id, data);
              toast.success("Address updated");
            } else {
              addAddress(data);
              toast.success("Address added");
            }
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">No addresses yet. Add one to speed up checkout.</p>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">{a.label}</p>
                  {a.isDefault && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>
                  )}
                </div>
                <p className="mt-1.5 font-medium">{a.fullName}</p>
                <p className="text-sm text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                <p className="text-sm text-muted-foreground">{a.city}, {a.state} · {a.country}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.phone}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => { setEditing(a); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <PenSquare className="h-3 w-3" /> Edit
              </button>
              {!a.isDefault && (
                <button
                  onClick={() => { setDefaultAddress(a.id); toast.success("Set as default"); }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  <Check className="h-3 w-3" /> Set default
                </button>
              )}
              <button
                onClick={() => { if (confirm("Delete this address?")) { removeAddress(a.id); toast.success("Address removed"); } }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Address | null;
  onSave: (a: Omit<Address, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>({
    label: initial?.label ?? "Home",
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "Lagos",
    country: initial?.country ?? "Nigeria",
    isDefault: initial?.isDefault ?? false,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const input = "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.fullName || !form.line1 || !form.city || !form.phone) {
          toast.error("Please fill required fields");
          return;
        }
        onSave(form);
      }}
      className="mb-6 rounded-2xl border border-border bg-muted/40 p-5"
    >
      <p className="mb-4 font-display text-lg font-semibold">{initial ? "Edit address" : "New address"}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={form.label} onChange={(e) => set("label", e.target.value)} className={input}>
          <option>Home</option><option>Office</option><option>Other</option>
        </select>
        <input placeholder="Full name*" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={input} />
        <input placeholder="Phone*" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} />
        <input placeholder="City*" value={form.city} onChange={(e) => set("city", e.target.value)} className={input} />
        <input placeholder="Address line 1*" value={form.line1} onChange={(e) => set("line1", e.target.value)} className={`${input} sm:col-span-2`} />
        <input placeholder="Address line 2" value={form.line2} onChange={(e) => set("line2", e.target.value)} className={`${input} sm:col-span-2`} />
        <input placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} className={input} />
        <input placeholder="Country" value={form.country} onChange={(e) => set("country", e.target.value)} className={input} />
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} />
        Make this my default address
      </label>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Save</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Cancel</button>
      </div>
    </form>
  );
}

function RewardsPanel() {
  return (
    <>
      <Card title="Loyalty points">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-5xl font-semibold">480</p>
            <p className="mt-1 text-sm text-muted-foreground">= ₦4,800 in rewards</p>
          </div>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-3/5 rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">320 points to Gold tier</p>
          </div>
        </div>
      </Card>
      <Card title="Referral program">
        <p className="text-sm text-muted-foreground">Share your code — you both get ₦2,500 off.</p>
        <div className="mt-4 flex items-center gap-2 rounded-full border border-dashed border-border p-1.5">
          <span className="pl-3 font-mono text-sm">ADAEZE-KK</span>
          <button className="ml-auto rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">Copy</button>
        </div>
      </Card>
    </>
  );
}

function NotificationsPanel() {
  return (
    <Card title="Notifications">
      {[
        { icon: Sparkles, text: "New arrivals just landed — 12 fresh pieces to explore.", time: "2h ago" },
        { icon: Package, text: "Order KK-1042 delivered. Enjoy!", time: "1d ago" },
        { icon: Bell, text: "Your saved item Peach Ruffle Sundress is back in stock.", time: "3d ago" },
      ].map((n, i) => (
        <div key={i} className="flex items-start gap-3 border-t border-border py-3 first:border-t-0 first:pt-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-peach/60"><n.icon className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm">{n.text}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
