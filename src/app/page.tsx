import { Footer } from "@/components/Footer";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Journey } from "@/components/home/Journey";
import { Projects } from "@/components/home/Projects";
import { Startup } from "@/components/home/Startup";
import { Nav } from "@/components/Nav";
import { SkipLink } from "@/components/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Nav home />
      <main id="top" tabIndex={-1} className="outline-none">
        <Hero />
        <Startup />
        <Projects />
        <About />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
