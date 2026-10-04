import type { ReactNode } from "react";
import { MotifBand, Rosace } from "@/components/motifs/Motif";
import { Container } from "@/components/ui/Layout";
import { Eyebrow, Heading } from "@/components/ui/Typography";

/** En-tête des pages intérieures : version courte et sobre du hero. */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section data-tone="dark" className="relative overflow-hidden bg-brun bg-grain text-(--fg)">
      <Rosace rings={6} draw className="pointer-events-none absolute -right-24 -top-16 size-80 text-terre/35 sm:size-[26rem]" />
      <Container className="relative pb-14 pt-32 sm:pb-16 sm:pt-40">
        <Eyebrow className="animate-rise">{eyebrow}</Eyebrow>
        <Heading as="h1" size="xl" className="mt-4 animate-rise [animation-delay:120ms]">
          {title}
        </Heading>
        {children && <div className="mt-6 max-w-2xl animate-rise [animation-delay:240ms]">{children}</div>}
      </Container>
      <MotifBand id="page-band" reveal={false} />
    </section>
  );
}
