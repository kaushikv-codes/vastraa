"use client";

// ── VastraaLogo ────────────────────────────────────────────────────────────
// Renders the uploaded logo file when `src` is provided.
// Falls back to Bodoni Moda SVG text while no file is uploaded.
//
// USAGE — drop your logo file into /public/logo.svg (or .png) then:
//   <VastraaLogo src="/logo.svg" />
// ──────────────────────────────────────────────────────────────────────────

interface VastraaLogoProps {
  /** Path to your logo file in /public — e.g. "/logo.svg" or "/logo.png" */
  src?: string;
  /** CSS height of the logo. Width scales automatically. Default: 2.4rem */
  size?: string;
  /** Alt text for accessibility */
  alt?: string;
  /**
   * CSS filter string to tint the white SVG logo.
   * Generate at: https://codepen.io/sosuke/pen/Pjoqqp
   * Example (terracotta #C84B31):
   * "brightness(0) saturate(100%) invert(35%) sepia(57%) saturate(700%) hue-rotate(340deg) brightness(95%)"
   */
  colorFilter?: string;
}

export function VastraaLogo({
  src,
  size = "2.4rem",
  alt = "Vastraa",
  colorFilter,
}: VastraaLogoProps) {
  // ── If a logo file is provided, render it ──────────────────────────────
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={colorFilter ? undefined : "logo-adaptive"}
        style={{
          height: size,
          width: "auto",
          display: "inline-block",
          verticalAlign: "middle",
          ...(colorFilter ? { filter: colorFilter } : {}),
        }}
        draggable={false}
      />
    );
  }

  // ── Fallback: Bodoni Moda SVG text ─────────────────────────────────────
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 390 108"
      height={size}
      width="auto"
      aria-label={alt}
      role="img"
      style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible" }}
    >
      <text
        x="2"
        y="100"
        fontFamily='"Bodoni Moda", serif'
        fontWeight="700"
        fontSize="100"
        fill="currentColor"
        letterSpacing="-5"
        style={{ fontVariationSettings: "'opsz' 96" } as React.CSSProperties}
      >
        VASTRAA
      </text>
    </svg>
  );
}
