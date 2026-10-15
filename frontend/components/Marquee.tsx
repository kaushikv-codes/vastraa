"use client";

const OCCASIONS = [
  "Wedding", "Sangeet", "Office", "Festival",
  "Date Night", "Casual", "Cocktail", "Beach",
  "Wedding", "Sangeet", "Office", "Festival",
  "Date Night", "Casual", "Cocktail", "Beach",
];

export function Marquee() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        padding: "1rem 0",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex" }}>
        <div className="marquee-track" style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {OCCASIONS.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span style={{
                fontSize: "0.7rem", textTransform: "uppercase",
                letterSpacing: "0.22em", padding: "0 2rem",
                color: "var(--muted)", fontFamily: "var(--font-body)",
              }}>
                {item}
              </span>
              <span style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "var(--saffron)", display: "inline-block", flexShrink: 0,
              }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
