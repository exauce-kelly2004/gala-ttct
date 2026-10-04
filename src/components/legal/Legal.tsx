import type { ReactNode } from "react";
import { LuChevronDown, LuPencilLine } from "react-icons/lu";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container, Section } from "@/components/ui/Layout";
import { legal } from "@/config/legal";

/** Espace à compléter par l'organisateur : visible, impossible à confondre avec le texte définitif. */
export function ToComplete({ label }: { label: string }) {
  return (
    <mark className="inline-flex items-baseline gap-1.5 border border-dashed border-rouille bg-rouille/12 px-1.5 py-0.5 text-[0.92em] font-semibold text-brun not-italic">
      <LuPencilLine className="size-3.5 shrink-0 translate-y-0.5 text-rouille" aria-hidden />
      <span>À compléter : {label}</span>
    </mark>
  );
}

/** Affiche la valeur si elle est renseignée dans config/legal.ts, sinon l'espace à compléter. */
export function Value({ value, label }: { value: string | null | undefined; label: string }) {
  return value ? <>{value}</> : <ToComplete label={label} />;
}

export type LegalSection = { id: string; title: string; content: ReactNode };

/** Page juridique : en-tête, sommaire (collant sur desktop, repliable sur mobile), sections numérotées. */
export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: ReactNode; sections: LegalSection[] }) {
  const toc = (
    <ol className="space-y-2.5 text-[0.92rem]">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="flex gap-3 text-(--fg)/80 transition-colors hover:text-rouille">
            <span className="font-display text-[1.05rem] font-black leading-snug text-rouille tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="leading-snug">{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title}>
        <p className="text-sable">Dernière mise à jour : {legal.updatedAt}</p>
      </PageIntro>

      <Section tone="parchemin" className="py-14 sm:py-20">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <details className="group border border-(--line) bg-ivoire/40 lg:hidden">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
                    Sommaire
                    <LuChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="border-t border-(--line) px-5 py-5">{toc}</div>
                </details>
                <nav aria-label="Sommaire" className="hidden lg:block">
                  <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-(--fg-muted)">Sommaire</p>
                  {toc}
                </nav>
              </div>
            </aside>

            <article className="legal-prose lg:col-span-8">
              <div className="text-[1.05rem] leading-relaxed">{intro}</div>
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="mt-12 scroll-mt-28 border-t border-(--line) pt-10">
                  <h2 className="flex items-baseline gap-4 font-display text-[clamp(1.6rem,4.5vw,2.1rem)] font-black uppercase leading-none">
                    <span className="text-rouille tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-5">{s.content}</div>
                </section>
              ))}
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
