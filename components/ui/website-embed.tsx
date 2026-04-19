import Link from "next/link";

type WebsiteEmbedProps = {
  src: string;
  title?: string;
  height?: number;
};

export function WebsiteEmbed({ src, title = "Live Website", height = 680 }: WebsiteEmbedProps) {
  return (
    <div className="my-14 w-full max-w-[85ch] overflow-hidden rounded-[2.5rem] bg-[#EAE5D9] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/60">Embed</span>
        <Link
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#111111] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FDFBF7] transition-colors hover:bg-[#D9ED92] hover:text-[#111111]"
        >
          Open Fullscreen
        </Link>
      </div>

      <div className="overflow-hidden rounded-4xl bg-[#111111]">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="w-full border-0"
          style={{ height }}
          referrerPolicy="no-referrer"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
