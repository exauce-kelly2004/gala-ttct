import Link from "next/link";
import type { ReactNode } from "react";
import { LuPhone } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { MotifBand } from "@/components/motifs/Motif";
import { event } from "@/config/event";
import { formatPhone, telHref } from "@/lib/format";
import { navLinks } from "./nav";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/conditions-generales-de-vente", label: "Conditions générales de vente" },
  { href: "/confidentialite", label: "Confidentialité" },
];

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-orange">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer data-tone="dark" className="bg-brun bg-grain text-(--fg) print:hidden">
      <MotifBand id="footer-band" />
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo variant="full" width={260} className="w-52 sm:w-[260px]" />
            <p className="mt-6 max-w-sm text-[0.95rem] text-sable">
              {event.name} · {event.theme}. {event.dateLabel}, {event.city}. Une soirée au profit {event.cause}.
            </p>
          </div>

          <div className="lg:col-span-3">
            <Column title="Le gala">
              <ul className="space-y-2.5">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a href={`/${l.href}`} className="link-zigzag text-[0.95rem] text-(--fg)/85 hover:text-orange">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Column>
          </div>

          <div className="lg:col-span-4">
            <Column title="Contact">
              <ul className="space-y-2">
                {event.contacts.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className="inline-flex items-center gap-3 font-display text-[1.6rem] font-black leading-none hover:text-orange">
                      <LuPhone className="size-4 text-orange" aria-hidden />
                      {formatPhone(phone)}
                    </a>
                  </li>
                ))}
              </ul>
            </Column>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-(--line) pt-6 text-[0.8rem] text-sable sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {event.organizer}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-zigzag hover:text-ivoire">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
