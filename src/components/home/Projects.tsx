import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projectCodeLabel, projects, type Project } from "@/content";
import { ButtonLink } from "../ButtonLink";
import { BrowserPair } from "../BrowserWindows";
import { RespawnDemo, SidekickBody } from "./ProjectDemos";
import { DisplayHeading, Eyebrow, Note, Pill, Reveal, RoleTag, Section, StackLine } from "../ui";

export function Projects() {
  const f = projects.featured;
  return (
    <Section id="projects" theme="dark" labelledBy="projects-title">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow theme="dark">{projects.eyebrow}</Eyebrow>
          <DisplayHeading id="projects-title" className="mt-4">
            {projects.heading}
          </DisplayHeading>
        </div>
        <Note theme="dark" rotate={-6} className="md:mb-3 md:max-w-[12rem] md:text-right">
          {projects.note}
        </Note>
      </Reveal>

      <Reveal className="mt-12">
        <article className="theme-cream grid gap-10 rounded-[32px] border-2 border-cream p-4 pb-8 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:p-10">
          {/* Desktop web app, so browser windows (never a phone frame): studio view behind, client view in front */}
          <BrowserPair back={f.windows.studio} front={f.windows.client} width={600} />

          <div className="px-1 lg:px-0">
            <p>
              <RoleTag>{f.label}</RoleTag>
            </p>
            <h3 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.01em]">{f.title}</h3>
            <ul aria-label="At a glance" className="mt-4 flex flex-wrap gap-2">
              {f.pills.map((p) => (
                <Pill key={p} theme="cream">
                  {p}
                </Pill>
              ))}
            </ul>
            <p className="mt-5 text-lg leading-relaxed text-ink-text/85">{f.description}</p>
            <div className="mt-6 border-l-4 border-lilac pl-4">
              <p className="font-mono text-xs tracking-[0.18em] text-muted-cream uppercase">{f.outcomeLabel}</p>
              <p className="mt-1.5 font-semibold leading-snug">{f.outcome}</p>
            </div>
            <div className="mt-6">
              <StackLine theme="cream" items={f.stack} />
            </div>
            <div className="mt-8">
              <ButtonLink href={f.cta.href} variant="ink">
                {f.cta.label} <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </article>
      </Reveal>

      {/* 1 column on phones; 2 at tablet; from 1024px a 6-column grid: first two span 3, the rest span 2 */}
      <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        {projects.grid.map((p, i) => (
          <Reveal as="li" key={p.title} delay={(i % 2) * 60} className={`${i < 2 ? "lg:col-span-3" : "lg:col-span-2"} ${
              i === projects.grid.length - 1 && projects.grid.length % 2 ? "md:col-span-2" : ""
            }`}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/** Plain card (not clickable). A small "Code ↗" link appears only when the project has an href. */
function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="flex h-full flex-col rounded-[24px] border border-line-dark bg-[#161618] p-6 sm:p-7">
      <p className="font-mono text-xs tracking-[0.12em] text-muted-dark uppercase">{p.label}</p>
      <h3 className="mt-4 font-display text-2xl leading-tight sm:text-[1.7rem]">{p.title}</h3>
      {p.demo === "sidekick" ? (
        <SidekickBody description={p.description} />
      ) : (
        <p className="mt-3 leading-relaxed text-muted-dark">{p.description}</p>
      )}
      {p.demo === "respawn" && <RespawnDemo />}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <StackLine theme="dark" items={p.stack} />
        {p.href && (
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-lilac underline-offset-4 hover:underline"
          >
            {projectCodeLabel} <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">for {p.title} on GitHub (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
