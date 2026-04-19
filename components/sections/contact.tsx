import { SpotifyTracker } from "@/components/ui/spotify";

export function Contact() {
  return (
    <section id="contact" className="min-h-[80vh] w-full bg-[#EAE5D9] flex flex-col justify-center px-6 md:px-24 py-32 relative text-[#2A2A2A]">
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#D9ED92]/20 pointer-events-none"></div>
      
      <div className="flex flex-col gap-6 md:gap-12 relative z-10 w-full">
        <h2 className="text-[15vw] md:text-[12vw] font-black uppercase tracking-tighter leading-[0.75] text-[#2A2A2A] md:whitespace-nowrap" style={{ fontFamily: "var(--font-heading)" }}>
          <span className="block hover:translate-x-4 transition-transform duration-500 ease-out">LET&apos;S</span>
          <span className="block text-[#FF9E9E] hover:translate-x-4 transition-transform duration-500 ease-out delay-75">TALK</span>
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-12 border-t-2 border-[#2A2A2A]/10 pt-12 mt-12">
          <div className="max-w-xl">
            <p className="text-2xl md:text-3xl font-medium leading-tight opacity-70 mb-8">
              Open for freelance and collaborations web, software, or AI. If you want something fast, beautiful, and thoughtfully engineered, let’s connect.
            </p>
            <SpotifyTracker />
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="uppercase text-xs font-bold tracking-[0.2em] opacity-50">Drop a Line</span>
            <a 
              href="mailto:hey@harshitsingh.net" 
              className="text-4xl md:text-7xl font-bold tracking-tighter text-[#2A2A2A] hover:text-[#9A8CFF] transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              hey@harshitsingh.net
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
