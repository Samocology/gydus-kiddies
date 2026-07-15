import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Layout, PageHead } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Gydus Kiddies" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((n, i) => n + i.price * i.quantity, 0);
  const shipping = subtotal > 25000 || subtotal === 0 ? 0 : 2500;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "KIKI15") {
      setDiscount(Math.round(subtotal * 0.15));
      toast.success("Coupon applied — 15% off");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon");
    }
  };

  const whatsappCart = () => {
    const lines = cart.map((i) => `• ${i.name} · ${i.size ?? ""} · ×${i.quantity} · ${formatNaira(i.price * i.quantity)}`).join("%0A");
    const msg = `Hi Gydus Kiddies! I'd like to place this order:%0A${lines}%0A%0ASubtotal: ${formatNaira(subtotal)}%0AShipping: ${formatNaira(shipping)}%0ATotal: ${formatNaira(total)}`;
    window.open(`https://wa.me/2348000000000?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <PageHead eyebrow="Your bag" title="Almost yours." lede={cart.length ? `${cart.length} ${cart.length === 1 ? "piece" : "pieces"} ready to check out.` : "Your cart is empty for now."} />
      <section className="container-x mx-auto max-w-7xl pb-24">
        {cart.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="font-display text-2xl">Your cart is waiting for treats</p>
            <Link to="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">Start shopping →</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-soft">
                  <div className="grid h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <img src={item.image ?? `https://picsum.photos/seed/${item.productId}/200/200`} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.size && `Size ${item.size}`}{item.color && ` · ${item.color}`}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{formatNaira(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center rounded-full border border-border">
                      <button onClick={() => updateQty(i, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-l-full hover:bg-muted"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(i, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-r-full hover:bg-muted"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => removeFromCart(i)} aria-label="Remove" className="text-xs text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive">Clear cart</button>
            </div>

            <aside className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
              <h3 className="font-display text-2xl font-semibold">Order summary</h3>
              <dl className="mt-6 space-y-3 text-sm">
                <Row label="Subtotal" value={formatNaira(subtotal)} />
                {discount > 0 && <Row label="Discount" value={`− ${formatNaira(discount)}`} highlight />}
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatNaira(shipping)} />
                <div className="border-t border-border pt-3">
                  <Row label="Total" value={formatNaira(total)} bold />
                </div>
              </dl>

              <div className="mt-6 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code (try KIKI15)"
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                <button onClick={applyCoupon} className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium">Apply</button>
              </div>

              <button
                onClick={() => navigate({ to: "/checkout", search: { discount, coupon: discount > 0 ? "KIKI15" : undefined } })}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-medium text-background hover:opacity-90"
              >
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={whatsappCart}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[oklch(0.75_0.16_155)] py-3.5 text-sm font-medium text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Send cart to WhatsApp
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">Secure checkout · Free returns for 14 days</p>
            </aside>
          </div>
        )}
      </section>
    </Layout>
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
