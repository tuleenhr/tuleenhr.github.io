import { ArrowUpRight, Mail } from "lucide-react";
import { contact } from "@/content";
import { CopyEmail } from "./CopyEmail";
import {
  DisplayHeading,
  Eyebrow,
  GitHubIcon,
  LinkedInIcon,
  Reveal,
  Section,
} from "../ui";

const linkIcons = {
  mail: Mail,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

export function Contact() {
  return (
    <Section
      id="contact"
      theme="cream"
      labelledBy="contact-title"
      className="pb-12 md:pb-16"
    >
      {/* Heading and links side by side from 1024px, stacked below */}
      <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end lg:gap-16">
        <div>
          <Eyebrow theme="cream">{contact.eyebrow}</Eyebrow>
          <DisplayHeading id="contact-title" className="mt-4 max-w-3xl">
            {contact.heading}
          </DisplayHeading>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-text/85">
            {contact.body}
          </p>
        </div>

        <ul className="max-w-xl divide-y-2 divide-ink-text/10 border-y-2 border-ink-text/10">
          {contact.links.map((l) => {
            const Icon = linkIcons[l.icon];
            const external = l.href.startsWith("http");
            return (
              <li key={l.label} className="flex items-center gap-3">
                <a
                  href={l.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex min-w-0 flex-1 items-center gap-4 py-4"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lilac">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-muted-cream">
                      {l.label}
                    </span>
                    <span className="block truncate font-semibold decoration-lilac decoration-[3px] underline-offset-[5px] group-hover:underline">
                      {l.value}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 transition-transform delay-[40ms] duration-[180ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  {external && (
                    <span className="sr-only">(opens in a new tab)</span>
                  )}
                </a>
                {l.icon === "mail" && <CopyEmail email={l.value} />}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
