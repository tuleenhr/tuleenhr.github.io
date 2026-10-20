import QRCode from "qrcode";

/**
 * QR code rendered at build time (server component in a static export), so the
 * qrcode package never ships to the browser. Hidden under 768px, where the
 * "Try it live" button does the job.
 */
export async function QrCode({ url, caption, className = "" }: { url: string; caption: string; className?: string }) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#141414", light: "#00000000" },
  });
  return (
    <figure className={`hidden w-[112px] flex-col items-center gap-2 md:flex ${className}`}>
      <div
        className="size-24 rounded-xl border border-ink-text/15 bg-cream p-2 [&_svg]:size-full"
        role="img"
        aria-label={`QR code for ${url.replace(/^https:\/\//, "")}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="text-center font-mono text-xs leading-snug text-muted-cream">{caption}</figcaption>
    </figure>
  );
}
