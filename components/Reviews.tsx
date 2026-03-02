"use client";
import { brand } from "@/lib/brand";
import { useLang } from "./LangContext";

const reviews = [
  {
    text: "Visiting from out of town, I learned that my old cell phone could no longer support my service provider. The proprietor quickly took into account my needs... came down off the price significantly when I told him I could not afford his price. Altogether a most pleasant experience.",
    author: "Todd",
    location: "Roxboro, NC",
  },
  {
    text: "They are very friendly and don't stop until the work is resolved. My iPhone had been giving me so many problems — now it's up and running thanks to Mr. Harry.",
    author: "Janiqua",
    location: "Wilmington, NC",
  },
  {
    text: "Fast, affordable, professional. Mr. Harry knows his stuff. Brought in my Samsung with a cracked screen and it was done in under an hour. Highly recommend.",
    author: "Verified Customer",
    location: "Wilmington, NC",
  },
];

export default function Reviews() {
  const { t } = useLang();
  return (
    <section id="reviews" className="py-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-cyan uppercase mb-3"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.25em",
            }}
          >
            {t("reviews_eyebrow")}
          </p>
          <h2
            className="text-field-white"
            style={{
              fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
              fontSize: "clamp(56px, 8vw, 96px)",
              lineHeight: 0.9,
            }}
          >
            {t("reviews_headline")}
          </h2>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-grid-line mb-10">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6"
              style={{
                background: "#0f1419",
                borderTop: "3px solid #39ff14",
              }}
            >
              {/* Decorative quote mark */}
              <span
                className="text-neon select-none"
                style={{
                  fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                  fontSize: "80px",
                  lineHeight: 0.7,
                  opacity: 0.15,
                }}
              >
                "
              </span>
              <p
                className="text-field-white flex-1"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {r.text}
              </p>
              <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(57,255,20,0.08)" }}>
                <p
                  className="text-neon"
                  style={{
                    fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  {r.author}
                </p>
                <p
                  className="text-field-muted"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                  }}
                >
                  {r.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p
            className="text-field-muted"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "13px",
            }}
          >
            {t("reviews_cta_sub")}
          </p>
          <a
            href={brand.googleReview}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0"
            style={{ fontSize: "11px" }}
          >
            {t("reviews_cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
