"use client";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { useLang } from "./LangContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer
      className="py-16 px-6 lg:px-10 border-t"
      style={{ background: "#0f1419", borderTopColor: brand.colors.gridLine }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-baseline gap-3 mb-4">
            <span
              className="text-neon neon-glow"
              style={{
                fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                fontSize: "32px",
                lineHeight: 1,
              }}
            >
              CPP
            </span>
          </div>
          <p
            className="text-field-muted mb-1"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            {brand.address}
          </p>
          <a
            href={brand.tel}
            className="text-amber hover:text-field-white transition-colors block mt-2"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            {brand.phone}
          </a>
          <p
            className="text-field-muted mt-4"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "11px",
              lineHeight: 1.7,
            }}
          >
            {t("footer_copy")}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p
            className="text-neon uppercase mb-5"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
            }}
          >
            {t("footer_links")}
          </p>
          <ul className="flex flex-col gap-3">
            {[
              { label: "Services", href: "#services" },
              { label: "Book Drop-Off", href: "#booking" },
              { label: "Reviews", href: "#reviews" },
              { label: "About", href: "#about" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-field-muted hover:text-field-white transition-colors"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <p
            className="text-neon uppercase mb-5"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
            }}
          >
            {t("footer_hours")}
          </p>
          <p
            className="text-field-muted mb-2"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "13px",
              lineHeight: 1.7,
            }}
          >
            {t("footer_hours_note")}
          </p>
          <a
            href={brand.tel}
            className="btn-neon mt-4 inline-block"
            style={{ fontSize: "12px", padding: "10px 20px" }}
          >
            CALL {brand.phone}
          </a>
        </div>
      </div>

      <div
        className="pt-6 flex flex-col sm:flex-row justify-between gap-3 border-t"
        style={{ borderTopColor: "rgba(57,255,20,0.06)" }}
      >
        <p
          className="text-field-muted"
          style={{
            fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
            fontSize: "11px",
          }}
        >
          &copy; {new Date().getFullYear()} Cell Phone Paradise &middot; 1929 Oleander Dr &middot; Wilmington, NC
        </p>
        <p
          className="text-field-muted"
          style={{
            fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
            fontSize: "10px",
            letterSpacing: "0.1em",
            opacity: 0.4,
          }}
        >
          WILMINGTON&apos;S PHONE CHAMPION
        </p>
      </div>
    </footer>
  );
}
