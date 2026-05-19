import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Expertise } from "@/components/sections/expertise";
import { Manifesto } from "@/components/sections/manifesto";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { AnimeSpotlight } from "@/components/sections/anime";
import { CrunchyStatus } from "@/components/sections/crunchy";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/ui/navbar";
import { Marquee } from "@/components/ui/marquee";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative w-full overflow-x-hidden bg-[#F0EDE5]">
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <AnimeSpotlight />
        <CrunchyStatus />
        <Marquee />
        <Experience />
        <Manifesto />
        
        <div className="relative bg-[#EAE5D9]">
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
