import Image from "next/image";
import Link from "next/link";
import { MDXRemoteProps } from "next-mdx-remote/rsc";
import { Quote, ArrowRightIcon, Grip } from "lucide-react";
import { AudioPlayer } from "@/components/ui/audio-player";
import { CodeBlockShell } from "@/components/ui/code-block-shell";
import { WebsiteEmbed } from "@/components/ui/website-embed";
import { ExpandableImage } from "@/components/ui/expandable-image";
import { PullQuote } from "@/components/ui/pull-quote";
import { CrunchyStatus } from "@/components/sections/crunchy";
import { CrunchyLists } from "@/components/sections/crunchy-lists";
import { CrunchyEpisode } from "@/components/sections/crunchy-episode";
import { CrunchySeason } from "@/components/sections/crunchy-season";

function CustomLink(props: any) {
  const href = props.href;
  const classes = "text-[#111111] font-bold px-1 py-0.5 mix-blend-luminosity hover:bg-[#111111] hover:text-[#FDFBF7] transition-all duration-300 underline decoration-[#111111]/30 hover:decoration-transparent underline-offset-4";
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props} className={classes}>
        {props.children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return <a {...props} className={classes} />;
  }
  return <a target="_blank" rel="noopener noreferrer" {...props} className={classes} />;
}

export const mdxComponents: MDXRemoteProps["components"] = {
  AudioPlayer,
  CodeBlockShell,
  WebsiteEmbed,
  CrunchyStatus,
  CrunchyLists,
  CrunchyEpisode,
  CrunchySeason,
  PullQuote,
  h1: (props) => (
    <h1
      className="text-6xl md:text-8xl font-black mt-24 mb-10 tracking-tighter uppercase leading-[0.9] text-transparent"
      style={{ fontFamily: 'var(--font-heading)', WebkitTextStroke: '1px #111111' }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-4xl md:text-5xl font-bold mt-16 mb-8 tracking-tighter uppercase flex items-center gap-4 text-[#111111]"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      <Grip className="w-8 h-8 text-[#111111] opacity-30" />
      {props.children}
    </h2>
  ),
  h3: (props) => (
    <h3
      className="text-3xl font-bold mt-12 mb-6 tracking-tight text-[#111111]/80 uppercase"
      style={{ fontFamily: 'var(--font-heading)' }}
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-8 leading-[1.8] text-xl text-[#111111]/70 font-medium tracking-wide max-w-[65ch]"
      {...props}
    />
  ),
  a: CustomLink,
  ul: (props) => (
    <ul className="my-10 ml-2 list-none flex flex-col gap-4 text-xl text-[#111111]/70" {...props} />
  ),
  ol: (props) => (
    <ol className="my-10 ml-8 list-decimal space-y-4 text-xl text-[#111111]/70" {...props} />
  ),
  li: (props) => (
    <li className="relative pl-8 flex items-start group">
      <ArrowRightIcon className="absolute left-0 top-1 w-5 h-5 text-[#111111] opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      <span>{props.children}</span>
    </li>
  ),
  blockquote: (props) => (
    <blockquote className="my-12 relative bg-[#EAE5D9] rounded-[2.5rem] p-8 md:p-12 text-2xl md:text-3xl font-medium italic text-[#111111]/90 leading-snug shadow-sm">
      <Quote className="absolute top-8 left-8 w-12 h-12 text-[#111111] opacity-10 -rotate-6" />
      <div className="relative z-10" {...props} />
    </blockquote>
  ),
  strong: (props) => (
    <strong className="font-extrabold text-[#FDFBF7] uppercase tracking-wider text-sm bg-[#111111] px-2 py-1 mx-1 rounded-sm" {...props} />
  ),
  hr: (props) => (
    <div className="my-20 w-full flex justify-center items-center gap-4 opacity-30 cursor-default">
      <div className="h-0.5 w-12 bg-[#111111]/20" />
      <Grip className="w-4 h-4 text-[#111111]/40" />
      <div className="h-0.5 w-12 bg-[#111111]/20" />
    </div>
  ),
  figure: (props: any) => {
    // rehype-pretty-code wraps code blocks in <figure>
    if (props["data-rehype-pretty-code-figure"] !== undefined) {
      return (
        <CodeBlockShell>{props.children}</CodeBlockShell>
      );
    }
    return <figure {...props} />;
  },
  pre: (props: any) => (
    <pre {...props} className={`font-mono text-sm overflow-x-auto m-0 p-0 bg-transparent! w-full ${props.className || ''}`} />
  ),
  code: (props: any) => {
    // If it's a code block from rehype-pretty-code, just render text
    if (props["data-language"]) {
      return <code className={`grid font-mono text-sm ${props.className || ''}`} {...props} />;
    }
    // Inline code
    return (
      <code
        className="font-mono text-[#111111] bg-[#111]/5 px-2 py-1 text-[0.85em] rounded-md border border-[#111]/10"
        {...props}
      />
    );
  },
  img: (props: any) => <ExpandableImage src={props.src} alt={props.alt} />,
};
