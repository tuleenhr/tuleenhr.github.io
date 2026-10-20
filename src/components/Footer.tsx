import { ArrowUp, Mail } from "lucide-react";
import { contact, footer, site } from "@/content";
import { ResumeMenu } from "./ResumeMenu";
import { GitHubIcon, LinkedInIcon } from "./ui";

const linkIcons = { mail: Mail, linkedin: LinkedInIcon, github: GitHubIcon } as const;

// Static export: this runs once at build time, so it's the date the site was last built.
const buildDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

/** Site footer. Case-study pages also show the contact links (the home page has a full Contact section). */
export function Footer({ withContact = false }: { withContact?: boolean }) {
  return (
    <footer className="theme-cream px-4 pb-10 sm:px-8">
      <div className="mx-auto max-w-6xl border-t-2 border-ink-text/10 pt-6">
        {withContact && (
          <ul aria-label="Contact" className="mb-6 flex flex-wrap gap-x-8 gap-y-3">
            {contact.links.map((l) => {
              const Icon = linkIcons[l.icon];
              const external = l.href.startsWith("http");
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2 font-semibold decoration-lilac decoration-[3px] underline-offset-[5px] hover:underline"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-lilac">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{l.label}: </span>
                    {l.value}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>{footer.copyright}</p>
            <p className="mt-1 font-mono text-xs text-muted-cream">
              {footer.builtWith} · {footer.lastUpdated} {buildDate}
              {site.sourceUrl && (
                <>
                  {" · "}
                  <a href={site.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    {footer.viewSource} <span aria-hidden="true">↗</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <ResumeMenu label={footer.resumeLabel} variant="link" />
            <a href="#top" className="inline-flex items-center gap-1.5">
              {footer.backToTop} <ArrowUp className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
