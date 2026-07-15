import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, Sparkles, Star, Truck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, reviews, ageImage } from "@/lib/data";
import heroImg from "@/assets/hero.jpg";
import summerImg from "@/assets/collection-summer.jpg";
import schoolImg from "@/assets/collection-school.jpg";
import partyImg from "@/assets/collection-party.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gydus Kiddies — Premium Kids' Fashion in Nigeria" },
      {
        name: "description",
        content:
          "Discover premium children's clothing, shoes and accessories at Gydus Kiddies. Summer & school collections, best sellers and delightful essentials.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const ages = [
    { label: "Babies", sub: "0–2y", tag: "babies" as const, image: ageImage("babies") },
    { label: "Toddlers", sub: "2–4y", tag: "toddlers" as const, image: ageImage("toddlers") },
    { label: "Kids", sub: "5–10y", tag: "boys" as const, image: ageImage("boys") },
    { label: "Teens", sub: "11–16y", tag: "teenagers" as const, image: ageImage("teenagers") },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="container-x mx-auto max-w-7xl pt-4 md:pt-6">
        <div className="relative grid overflow-hidden rounded-[2rem] bg-peach/50 md:grid-cols-12">
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 md:col-span-6 md:py-12 md:pl-12 md:pr-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium tracking-wide text-foreground/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Summer '26 collection
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
              Little wardrobes,<br />
              <span className="italic text-primary">big joy.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-foreground/70 md:text-base">
              Thoughtfully-made clothing for the humans you love most. Soft fabrics, playful colours, made to last past the next growth spurt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                Shop new arrivals <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-white"
              >
                Browse everything
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-foreground/60">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span>4.9 · 2,400+ happy parents</span>
              </div>
            </div>
          </div>
          <div className="relative md:col-span-6">
            <img
              src={heroImg}
              alt="Two children in premium pastel kids fashion"
              width={1600}
              height={1100}
              className="h-full w-full object-cover md:min-h-[420px]"
            />
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Collections</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Made for every kind of day</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-medium underline underline-offset-4 md:inline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { img: summerImg, title: "Summer Collection", desc: "Airy linens, sun hats, seaside softness", href: "/shop", tint: "bg-sun/50" },
            { img: schoolImg, title: "Back to School", desc: "Sharp uniforms, shoes & essentials", href: "/category/school-wear", tint: "bg-sky/50" },
            { img: partyImg, title: "Party Dresses", desc: "Twirl-worthy pieces for the big day", href: "/category/party-dresses", tint: "bg-peach/60" },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.href}
              className={`group relative overflow-hidden rounded-[2rem] ${c.tint} p-6 transition hover:-translate-y-1`}
            >
              <div className="flex h-72 items-end overflow-hidden rounded-2xl">
                <img src={c.img} alt={c.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-5">
                <h3 className="font-display text-2xl font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-foreground/70">{c.desc}</p>
                <p className="mt-3 text-sm font-medium text-primary">Shop the collection →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Loved most</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Best sellers</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-medium underline underline-offset-4 md:inline">
            See all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SHOP BY AGE */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop by age</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">The right size, every stage</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {ages.map((a) => (
            <Link
              key={a.label}
              to="/shop"
              search={{ age: a.tag }}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[2rem] transition hover:-translate-y-1 hover:shadow-lift"
            >
              <img
                src={a.image}
                alt={`${a.label} — ${a.sub}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative p-5 text-white">
                <p className="font-display text-2xl font-semibold">{a.label}</p>
                <p className="text-sm text-white/80">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SHOP BY GENDER */}
      <section className="container-x mx-auto max-w-7xl pt-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { label: "For Girls", tint: "bg-peach/50", tag: "girls", emoji: "🌸" },
            { label: "For Boys", tint: "bg-sky/50", tag: "boys", emoji: "✈️" },
            { label: "Unisex", tint: "bg-sun/50", tag: "unisex", emoji: "🌈" },
          ].map((g) => (
            <Link
              key={g.label}
              to="/shop"
              search={{ gender: g.tag }}
              className={`${g.tint} flex items-center justify-between rounded-3xl p-8 transition hover:-translate-y-0.5`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">Shop by gender</p>
                <p className="mt-1 font-display text-2xl font-semibold">{g.label}</p>
              </div>
              <span className="text-5xl">{g.emoji}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop by category</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Explore the whole world of Gydus</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-card p-6 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="text-4xl">{c.emoji}</span>
              <span className="text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Fresh in</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">New arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="text-sm font-medium underline underline-offset-4">
            All new →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {newArrivals.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div className="rounded-[2.5rem] bg-cream/70 p-8 md:p-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Kind words</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">From parents like you</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((r) => (
              <figure key={r.name} className="rounded-2xl bg-background p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mt-2 text-sm leading-relaxed text-foreground/80">"{r.text}"</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">@gyduskiddies</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Follow along on Instagram</h2>
          </div>
          <a href="#" className="hidden items-center gap-2 text-sm font-medium underline underline-offset-4 md:inline-flex">
            <Instagram className="h-4 w-4" /> Follow
          </a>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
          {products.slice(0, 6).map((p) => (
            <a
              key={p.id}
              href="#"
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-muted"
            >
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* NEWSLETTER + DELIVERY */}
      <section className="container-x mx-auto max-w-7xl pt-24">
        <div className="grid gap-5 md:grid-cols-5">
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="rounded-[2rem] bg-foreground p-10 text-background md:col-span-3"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-background/60">Newsletter</p>
            <h3 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              15% off your first order.
            </h3>
            <p className="mt-2 max-w-md text-sm text-background/70">
              Join our list for new drops, styling tips and the occasional treat for our little friends.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full rounded-full bg-background/10 px-5 py-3 text-sm text-background placeholder:text-background/50 focus:bg-background/15 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          </form>
          <div className="rounded-[2rem] bg-sky/40 p-10 md:col-span-2">
            <Truck className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-semibold">Delivery information</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
              <li>• Lagos: 1–2 business days</li>
              <li>• Nationwide: 2–5 business days</li>
              <li>• Free delivery on orders over ₦25,000</li>
              <li>• Pay on delivery available in select cities</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
