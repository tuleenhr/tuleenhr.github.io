"use client";

import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { contact } from "@/content";

/** Copies the email address and confirms for 2s (announced politely to screen readers). */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the mailto link still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink-text px-3 py-1.5 text-sm font-semibold"
    >
      {/* The "Copied ✓" text carries its own tick */}
      {!copied && <Copy className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? contact.copyEmail.done : contact.copyEmail.label}</span>
    </button>
  );
}
