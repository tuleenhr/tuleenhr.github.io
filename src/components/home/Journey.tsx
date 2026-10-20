import { journey } from "@/content";
import { Timeline } from "../Timeline";
import { DisplayHeading, Eyebrow, Note, Reveal, Section } from "../ui";

export function Journey() {
  return (
    <Section id="journey" theme="dark" labelledBy="journey-title">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow theme="dark">{journey.eyebrow}</Eyebrow>
          <DisplayHeading id="journey-title" className="mt-4">
            {journey.heading}
          </DisplayHeading>
        </div>
        <Note theme="dark" rotate={-6} className="md:mb-3">
          {journey.note}
        </Note>
      </Reveal>
      <div className="mx-auto max-w-4xl">
        <Timeline />
      </div>
    </Section>
  );
}
