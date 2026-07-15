import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Layout, PageHead } from "@/components/Layout";
import { faqs } from "@/lib/data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Gydus Kiddies" },
      { name: "description", content: "Answers on returns, shipping, payments, sizing and delivery." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <PageHead eyebrow="Answers" title="Frequently asked questions" lede="Everything about ordering, sizing, and getting your pieces home." />
      <section className="container-x mx-auto max-w-3xl pb-24">
        <div className="divide-y divide-border rounded-3xl border border-border bg-card">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-6 pb-5 text-sm text-foreground/70">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
