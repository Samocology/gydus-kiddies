import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import { MobileNav } from "./MobileNav";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="container-x mx-auto max-w-7xl pt-10 pb-6 md:pt-16 md:pb-10">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      {lede && <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{lede}</p>}
    </section>
  );
}
