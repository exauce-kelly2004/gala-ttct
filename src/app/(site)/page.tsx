import { Faq } from "@/features/home/Faq";
import { FinalCta } from "@/features/home/FinalCta";
import { Hero } from "@/features/home/Hero";
import { Infos } from "@/features/home/Infos";
import { Intro } from "@/features/home/Intro";
import { Passes } from "@/features/home/Passes";
import { Programme } from "@/features/home/Programme";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Programme />
      <Passes />
      <Infos />
      <Faq />
      <FinalCta />
    </>
  );
}
