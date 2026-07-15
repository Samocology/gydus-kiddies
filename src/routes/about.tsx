import { createFileRoute } from "@tanstack/react-router";
import { Heart, Leaf, Sparkles, Truck } from "lucide-react";
import { Layout, PageHead } from "@/components/Layout";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Gydus Kiddies" },
      { name: "description", content: "Our story, our mission, and why parents across Nigeria trust us with their kids' wardrobes." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <PageHead
        eyebrow="Our story"
        title="Little clothes, made with a lot of love."
        lede="Started in Lagos in 2021 by two mums who couldn't find kids' clothing as considered as their own. Today we ship to families across Nigeria and beyond."
      />

      <section className="container-x mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center">
        <img src={heroImg} alt="Two children" loading="lazy" className="rounded-[2rem] object-cover" />
        <div className="grid gap-5">
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Our mission</p>
            <h3 className="mt-2 font-display text-2xl">Make dressing little humans a joy.</h3>
            <p className="mt-2 text-sm text-foreground/70">
              We work directly with small ateliers and family-run factories to bring you kids' clothing that's soft, sturdy and quietly beautiful.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Our vision</p>
            <h3 className="mt-2 font-display text-2xl">A wardrobe your child will remember.</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Pieces that get handed down, patched up, and photographed again and again.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x mx-auto max-w-7xl pt-16 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why parents choose us</p>
        <h2 className="mt-2 font-display text-2xl md:text-3xl">Details that matter</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { icon: Heart, title: "Skin-friendly", body: "Certified soft, breathable and safe." },
            { icon: Leaf, title: "Made to last", body: "Reinforced seams, honest making." },
            { icon: Truck, title: "Fast delivery", body: "1–2 days Lagos, 2–5 nationwide." },
            { icon: Sparkles, title: "Small-batch", body: "Each collection is limited & considered." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl bg-card p-5 shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-peach/60">
                <f.icon className="h-4 w-4" />
              </div>
              <h4 className="mt-3 font-display text-base font-semibold">{f.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
