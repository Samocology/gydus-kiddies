import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Layout, PageHead } from "@/components/Layout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Gydus Kiddies" },
      { name: "description", content: "Get in touch by WhatsApp, phone, email or come visit the store." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <Layout>
      <PageHead eyebrow="Say hi" title="We'd love to hear from you." lede="Sizing questions, uniform bulk orders, birthday styling — we're here." />

      <section className="container-x mx-auto grid max-w-7xl gap-8 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          <ContactCard icon={MessageCircle} title="WhatsApp" body="+234 800 000 0000" href="https://wa.me/2348000000000" cta="Chat now" />
          <ContactCard icon={Phone} title="Phone" body="+234 800 000 0000" href="tel:+2348000000000" cta="Call" />
          <ContactCard icon={Mail} title="Email" body="hello@gyduskiddies.com" href="mailto:hello@gyduskiddies.com" cta="Send" />
          <ContactCard icon={Instagram} title="Instagram" body="@gyduskiddies" href="#" cta="Follow" />
          <div className="rounded-3xl bg-cream/70 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" /> Store hours
            </div>
            <ul className="mt-3 space-y-1 text-sm text-foreground/80">
              <li>Mon–Fri · 10:00 – 19:00</li>
              <li>Saturday · 10:00 – 20:00</li>
              <li>Sunday · 12:00 – 17:00</li>
            </ul>
            <div className="mt-4 flex items-start gap-2 text-sm text-foreground/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              24 Adeola Odeku St, Victoria Island, Lagos
            </div>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-[2rem] shadow-soft">
            <iframe
              title="Store location"
              src="https://www.google.com/maps?q=Victoria+Island+Lagos&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent — we'll reply within 24 hours.");
              (e.target as HTMLFormElement).reset();
            }}
            className="mt-6 rounded-[2rem] bg-card p-6 shadow-soft md:p-8"
          >
            <h3 className="font-display text-2xl font-semibold">Send us a message</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Your name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Subject" name="subject" className="md:col-span-2" />
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest">Message</label>
                <textarea required rows={5} className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>
            <button className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90">
              Send message
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

function ContactCard({ icon: Icon, title, body, href, cta }: any) {
  return (
    <a href={href} className="flex items-center justify-between rounded-3xl bg-card p-5 shadow-soft transition hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-peach/60">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
          <p className="font-medium">{body}</p>
        </div>
      </div>
      <span className="text-sm text-primary">{cta} →</span>
    </a>
  );
}

function Field({ label, name, type = "text", required, className = "" }: any) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-widest">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}
