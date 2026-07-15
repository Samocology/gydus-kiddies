import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Package, PackageCheck, Truck, Home } from "lucide-react";
import { Layout, PageHead } from "@/components/Layout";
import { orderStages } from "@/lib/data";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track your order — Gydus Kiddies" },
      { name: "description", content: "Enter your order number to see the current status." },
    ],
  }),
  component: TrackPage,
});

const stageIcons = [Package, PackageCheck, Truck, Home];

function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<{ id: string; stage: number } | null>(null);

  const track = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    // deterministic mock: hash → stage
    const stage = Math.abs(orderId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 4;
    setResult({ id: orderId.trim().toUpperCase(), stage });
  };

  return (
    <Layout>
      <PageHead eyebrow="Order tracking" title="Where's my order?" lede="Enter the order number from your confirmation email or WhatsApp message." />
      <section className="container-x mx-auto max-w-3xl pb-24">
        <form onSubmit={track} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. KK-1042"
            className="flex-1 rounded-full border border-border bg-background px-5 py-3.5 text-sm focus:border-primary focus:outline-none"
          />
          <button className="rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background hover:opacity-90">
            Track order
          </button>
        </form>

        {result && (
          <div className="mt-10 rounded-[2rem] bg-card p-6 shadow-soft md:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order</p>
                <p className="font-display text-2xl font-semibold">{result.id}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {orderStages[result.stage]}
              </span>
            </div>

            <ol className="mt-10 grid gap-6 md:grid-cols-4">
              {orderStages.map((stage, i) => {
                const Icon = stageIcons[i];
                const done = i <= result.stage;
                return (
                  <li key={stage} className="relative">
                    <div className={`grid h-12 w-12 place-items-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <p className="mt-3 text-sm font-medium">{stage}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {done ? "Complete" : "Pending"}
                    </p>
                    {i < orderStages.length - 1 && (
                      <div className={`absolute left-12 top-6 hidden h-0.5 w-full -translate-y-1/2 md:block ${done ? "bg-primary" : "bg-border"}`} />
                    )}
                  </li>
                );
              })}
            </ol>

            <p className="mt-10 text-sm text-muted-foreground">
              Need help? WhatsApp us at <a href="https://wa.me/2348000000000" className="text-primary underline">+234 800 000 0000</a>.
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
}
