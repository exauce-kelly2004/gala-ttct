import { LuPhone } from "react-icons/lu";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { event } from "@/config/event";
import { faq } from "@/config/faq";
import { formatPhone, telHref } from "@/lib/format";

/** Accordéon natif (details/summary) : accessible au clavier, une seule réponse ouverte à la fois. */
export function Faq() {
  return (
    <Section id="faq" tone="brun-soft">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow className="rise-on-view">FAQ</Eyebrow>
              <Heading className="mt-4 rise-on-view">Vos questions</Heading>
              <Lead className="mt-5 rise-on-view">Une autre question ? L’organisation vous répond.</Lead>
              <a href={telHref(event.contacts[0])} className="mt-6 inline-flex items-center gap-3 font-display text-[1.6rem] font-black leading-none text-orange hover:text-ivoire">
                <LuPhone className="size-5" aria-hidden />
                {formatPhone(event.contacts[0])}
              </a>
            </div>
          </div>

          <div className="border-t border-(--line) lg:col-span-8">
            {faq.map((item, i) => (
              <details key={item.question} name="faq" className="faq-item group border-b border-(--line)" open={i === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left">
                  <span className="font-display text-[1.45rem] font-black uppercase leading-[1.05] transition-colors group-hover:text-orange group-open:text-orange sm:text-[1.7rem]">
                    {item.question}
                  </span>
                  {/* Losange qui pivote : fermé = losange plein, ouvert = carré évidé */}
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center border border-(--line) transition-colors group-open:border-orange">
                    <span className="size-2.5 rotate-45 bg-rouille transition-[rotate,background-color] duration-500 ease-gala group-open:rotate-[225deg] group-open:bg-transparent group-open:outline-2 group-open:outline-orange" />
                  </span>
                </summary>
                <p className="max-w-prose pb-7 pr-12 text-[1.02rem] leading-relaxed text-(--fg)/85">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
