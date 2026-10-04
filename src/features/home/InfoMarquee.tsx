import { event } from "@/config/event";

const items = [event.name, "Samedi 19 décembre 2026", event.startTime ? `Dès ${event.startTime}` : null, event.city, event.theme, event.dressCode].filter(Boolean) as string[];

/** Bandeau défilant des informations clés, entre deux sections. Se met en pause au survol. */
export function InfoMarquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-[clamp(1.6rem,5vw,2.4rem)] font-black uppercase leading-none sm:px-8">{item}</span>
          <span aria-hidden className="size-3 shrink-0 rotate-45 border-2 border-brun bg-transparent" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Informations clés" className="overflow-hidden border-y-4 border-brun bg-orange py-5 text-brun">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
