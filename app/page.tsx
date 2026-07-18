import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Expertise } from "@/components/sections/expertise";
import { Manifesto } from "@/components/sections/manifesto";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { AnimeSpotlight } from "@/components/sections/anime";
import { CrunchyStatus } from "@/components/sections/crunchy";
import { MyPlans } from "@/components/sections/plans";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/ui/navbar";
import { Marquee } from "@/components/ui/marquee";
import { HelloLoader } from "@/components/ui/hello-loader";
import { HomeMetrics } from "@/components/ui/home-metrics";
import { GithubContributions } from "@/components/sections/github-contributions";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${absoluteUrl("/")}#person`,
        "name": "Harshit Singh",
        "alternateName": ["Harshit", "harshitkumar9030"],
        "url": absoluteUrl("/"),
        "jobTitle": "Full-Stack Developer and Software Engineer",
        "description": "Harshit Singh designs and engineers interactive web, software, and AI projects.",
        "sameAs": [
          "https://github.com/harshitkumar9030"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        "name": "Harshit Singh",
        "url": absoluteUrl("/"),
        "publisher": { "@id": `${absoluteUrl("/")}#person` }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HelloLoader />
      <HomeMetrics />
      <Navbar />
      <main className="relative w-full overflow-x-hidden bg-[#F0EDE5]">
        <Hero />
        <About />
        <MyPlans />
        <GithubContributions />
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
