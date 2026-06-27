import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Racepace" },
      {
        name: "description",
        content:
          "Get in touch with Racepace about your order, a custom request, or wholesale.",
      },
      { property: "og:title", content: "Contact — Racepace" },
      {
        property: "og:description",
        content: "Get in touch with Racepace.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Racepace — message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:hello@racepace.lovable.app?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…");
  };

  return (
    <main className="mx-auto max-w-3xl px-6 lg:px-10 py-20 lg:py-28">
      <p className="eyebrow">Contact</p>
      <h1 className="font-serif text-5xl md:text-6xl mt-6 leading-[1.02]">
        Say hello.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">
        Questions about an order, a custom request, or wholesale — we usually reply within
        a business day. Or email us directly at{" "}
        <a className="text-primary underline" href="mailto:hello@racepace.lovable.app">
          hello@racepace.lovable.app
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} className="mt-14 space-y-6 max-w-xl">
        <div>
          <Label htmlFor="name" className="eyebrow">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-3 h-12 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="email" className="eyebrow">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-3 h-12 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="message" className="eyebrow">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            className="mt-3 rounded-none"
          />
        </div>
        <Button type="submit" className="h-12 px-8 rounded-none text-sm tracking-widest uppercase">
          Send message
        </Button>
      </form>
    </main>
  );
}
