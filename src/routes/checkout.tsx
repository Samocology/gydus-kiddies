import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, MessageCircle, Package, ShieldCheck, Truck, Wallet } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useStore, type Address } from "@/lib/store";
import { formatNaira } from "@/lib/format";

interface CheckoutSearch {
  discount?: number;
  coupon?: string;
}

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Gydus Kiddies" }] }),
  validateSearch: (s: Record<string, unknown>): CheckoutSearch => ({
    discount: typeof s.discount === "number" ? s.discount : undefined,
    coupon: typeof s.coupon === "string" ? s.coupon : undefined,
  }),
  component: CheckoutPage,
});

const steps = ["Address", "Delivery", "Payment", "Review"] as const;
type Step = (typeof steps)[number];

const shippingOptions = [
  { id: "standard", name: "Standard delivery", desc: "2–5 business days", price: 2500 },
  { id: "express", name: "Express delivery", desc: "1–2 business days", price: 5000 },
  { id: "pickup", name: "Store pickup — VI", desc: "Free · Ready today", price: 0 },
];

const paymentOptions = [
  { id: "card", name: "Card / Paystack", desc: "Visa, Mastercard, Verve", icon: CreditCard },
  { id: "transfer", name: "Bank transfer", desc: "Direct to our GTB account", icon: Wallet },
  { id: "cod", name: "Pay on delivery", desc: "Lagos & Abuja only", icon: Package },
  { id: "whatsapp", name: "Confirm on WhatsApp", desc: "We reach out to finalize", icon: MessageCircle },
];

function CheckoutPage() {
  const { cart, addresses, addAddress, addOrder, clearCart } = useStore();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("Address");
  const [addressId, setAddressId] = useState<string>(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [shippingId, setShippingId] = useState<string>("standard");
  const [paymentId, setPaymentId] = useState<string>("card");
  const [showNewAddr, setShowNewAddr] = useState(addresses.length === 0);
  const [placedOrder, setPlacedOrder] = useState<{ id: string } | null>(null);

  const shipping = shippingOptions.find((s) => s.id === shippingId)!;
  const subtotal = cart.reduce((n, i) => n + i.price * i.quantity, 0);
  const discount = search.discount ?? 0;
  const total = Math.max(0, subtotal - discount + shipping.price);
  const address = useMemo(() => addresses.find((a) => a.id === addressId), [addresses, addressId]);

  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    label: "Home", fullName: "", phone: "", line1: "", city: "", state: "Lagos", country: "Nigeria",
  });

  const goto = (s: Step) => {
    // gate
    if (s === "Delivery" && !address) return toast.error("Please choose an address");
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveNewAddress = () => {
    if (!newAddr.fullName || !newAddr.line1 || !newAddr.city || !newAddr.phone) {
      toast.error("Fill in all required fields");
      return;
    }
    addAddress({ ...newAddr, isDefault: addresses.length === 0 });
    // Optimistic: use latest by matching phone+line1 in next tick
    setTimeout(() => {
      const latest = JSON.parse(localStorage.getItem("kk_addresses") ?? "[]") as Address[];
      const created = latest.find((a) => a.line1 === newAddr.line1 && a.phone === newAddr.phone);
      if (created) setAddressId(created.id);
      setShowNewAddr(false);
    }, 50);
    toast.success("Address saved");
  };

  const placeOrder = (viaWhatsapp = false) => {
    if (!address) return;
    const order = addOrder({
      items: cart,
      subtotal,
      discount,
      shipping: shipping.price,
      total,
      address,
      paymentMethod: paymentOptions.find((p) => p.id === paymentId)?.name ?? paymentId,
    });
    clearCart();
    setPlacedOrder({ id: order.id });

    if (viaWhatsapp) {
      const lines = cart
        .map((i) => `• ${i.name} · ${i.size ?? ""} · ×${i.quantity} · ${formatNaira(i.price * i.quantity)}`)
        .join("%0A");
      const msg = `Hi Gydus Kiddies! Order ${order.id}:%0A${lines}%0A%0AShip to: ${address.fullName}, ${address.line1}, ${address.city}%0ATotal: ${formatNaira(total)}`;
      window.open(`https://wa.me/2348000000000?text=${msg}`, "_blank");
    }
  };

  // ===== Success screen =====
  if (placedOrder) {
    return (
      <Layout>
        <section className="container-x mx-auto max-w-3xl py-16 md:py-24">
          <div className="rounded-[2rem] bg-card p-8 text-center shadow-soft md:p-14">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
            <h1 className="mt-6 font-display text-3xl font-semibold md:text-4xl">Thank you!</h1>
            <p className="mt-3 text-muted-foreground">Your order <span className="font-mono font-semibold text-foreground">{placedOrder.id}</span> is confirmed.</p>
            <p className="mt-1 text-sm text-muted-foreground">A confirmation has been sent to your email. Track its journey any time from your account.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/account" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">View orders</Link>
              <Link to="/shop" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Continue shopping</Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // ===== Empty cart =====
  if (cart.length === 0) {
    return (
      <Layout>
        <section className="container-x mx-auto max-w-3xl py-16 text-center">
          <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
          <Link to="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">Start shopping →</Link>
        </section>
      </Layout>
    );
  }

  const stepIndex = steps.indexOf(step);

  return (
    <Layout>
      <section className="container-x mx-auto max-w-6xl pt-6 pb-24 md:pt-10">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">Checkout</h1>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto">
          {steps.map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${active ? "bg-foreground text-background" : done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`whitespace-nowrap text-sm ${active ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
                {i < steps.length - 1 && <div className="h-px w-6 bg-border md:w-10" />}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {/* ---- STEP: ADDRESS ---- */}
            {step === "Address" && (
              <Panel title="Delivery address" icon={MapPin}>
                {addresses.length > 0 && !showNewAddr && (
                  <div className="space-y-3">
                    {addresses.map((a) => (
                      <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${addressId === a.id ? "border-foreground bg-muted/40" : "border-border hover:bg-muted/40"}`}>
                        <input type="radio" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{a.label}</span>
                            {a.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>}
                          </div>
                          <p className="mt-1 font-medium">{a.fullName}</p>
                          <p className="text-sm text-muted-foreground">{a.line1}, {a.city}, {a.state}</p>
                          <p className="text-xs text-muted-foreground">{a.phone}</p>
                        </div>
                      </label>
                    ))}
                    <button onClick={() => setShowNewAddr(true)} className="text-sm font-medium text-primary underline underline-offset-4">+ Add a new address</button>
                  </div>
                )}

                {showNewAddr && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Full name*" value={newAddr.fullName} onChange={(v) => setNewAddr({ ...newAddr, fullName: v })} />
                    <Input placeholder="Phone*" value={newAddr.phone} onChange={(v) => setNewAddr({ ...newAddr, phone: v })} />
                    <Input placeholder="Address*" value={newAddr.line1} onChange={(v) => setNewAddr({ ...newAddr, line1: v })} className="sm:col-span-2" />
                    <Input placeholder="City*" value={newAddr.city} onChange={(v) => setNewAddr({ ...newAddr, city: v })} />
                    <Input placeholder="State" value={newAddr.state} onChange={(v) => setNewAddr({ ...newAddr, state: v })} />
                    <div className="sm:col-span-2 flex flex-wrap gap-2">
                      <button onClick={saveNewAddress} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Save address</button>
                      {addresses.length > 0 && (
                        <button onClick={() => setShowNewAddr(false)} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Cancel</button>
                      )}
                    </div>
                  </div>
                )}
              </Panel>
            )}

            {/* ---- STEP: DELIVERY ---- */}
            {step === "Delivery" && (
              <Panel title="Delivery method" icon={Truck}>
                <div className="space-y-3">
                  {shippingOptions.map((s) => (
                    <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${shippingId === s.id ? "border-foreground bg-muted/40" : "border-border hover:bg-muted/40"}`}>
                      <input type="radio" checked={shippingId === s.id} onChange={() => setShippingId(s.id)} />
                      <div className="flex-1">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                      <p className="text-sm font-semibold">{s.price === 0 ? "Free" : formatNaira(s.price)}</p>
                    </label>
                  ))}
                </div>
              </Panel>
            )}

            {/* ---- STEP: PAYMENT ---- */}
            {step === "Payment" && (
              <Panel title="Payment method" icon={CreditCard}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentOptions.map((p) => (
                    <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${paymentId === p.id ? "border-foreground bg-muted/40" : "border-border hover:bg-muted/40"}`}>
                      <input type="radio" checked={paymentId === p.id} onChange={() => setPaymentId(p.id)} />
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-peach/60"><p.icon className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Payments are secure. Cards are processed by Paystack (mock in demo).
                </p>
              </Panel>
            )}

            {/* ---- STEP: REVIEW ---- */}
            {step === "Review" && (
              <>
                <Panel title="Shipping to" icon={MapPin}>
                  {address ? (
                    <div className="text-sm">
                      <p className="font-medium">{address.fullName} · <span className="text-muted-foreground">{address.phone}</span></p>
                      <p className="mt-1 text-muted-foreground">{address.line1}, {address.city}, {address.state}, {address.country}</p>
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No address selected</p>}
                </Panel>
                <Panel title="Delivery" icon={Truck}>
                  <p className="text-sm"><span className="font-medium">{shipping.name}</span> · <span className="text-muted-foreground">{shipping.desc}</span></p>
                </Panel>
                <Panel title="Payment" icon={CreditCard}>
                  <p className="text-sm font-medium">{paymentOptions.find((p) => p.id === paymentId)?.name}</p>
                </Panel>
                <Panel title="Items">
                  <div className="space-y-3">
                    {cart.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={i.image} alt={i.name} className="h-14 w-14 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium">{i.name}</p>
                          <p className="text-xs text-muted-foreground">{i.size && `Size ${i.size} · `}×{i.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">{formatNaira(i.price * i.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {/* NAV BUTTONS */}
            <div className="flex flex-wrap gap-3">
              {stepIndex > 0 && (
                <button onClick={() => goto(steps[stepIndex - 1])} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
              {step !== "Review" ? (
                <button
                  onClick={() => goto(steps[stepIndex + 1])}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => placeOrder(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
                  >
                    Place order · {formatNaira(total)}
                  </button>
                  <button
                    onClick={() => placeOrder(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.75_0.16_155)] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> Finalize on WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="h-fit rounded-3xl bg-card p-6 shadow-soft md:sticky md:top-24 md:p-7">
            <h3 className="font-display text-xl font-semibold">Order summary</h3>
            <div className="mt-4 space-y-2 border-b border-border pb-4">
              {cart.map((i, idx) => (
                <div key={idx} className="flex justify-between gap-3 text-sm">
                  <span className="line-clamp-1 text-muted-foreground">{i.name} <span className="text-foreground/60">×{i.quantity}</span></span>
                  <span className="shrink-0">{formatNaira(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatNaira(subtotal)} />
              {discount > 0 && <Row label={`Discount${search.coupon ? ` (${search.coupon})` : ""}`} value={`− ${formatNaira(discount)}`} highlight />}
              <Row label="Shipping" value={shipping.price === 0 ? "Free" : formatNaira(shipping.price)} />
              <div className="border-t border-border pt-3">
                <Row label="Total" value={formatNaira(total)} bold />
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon?: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-soft md:p-7">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Input({ placeholder, value, onChange, className = "" }: { placeholder: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-2xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none ${className}`}
    />
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""} ${highlight ? "text-primary" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
