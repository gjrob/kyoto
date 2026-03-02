"use client";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { useLang } from "./LangContext";

export default function Nav() {
  const { t } = useLang();
  return (
    <nav
      className="bg-arena-panel sticky top-0 z-40 border-b"
      style={{ borderBottomColor: brand.colors.gridLine }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-3 no-underline">
          <span
            className="text-neon neon-glow"
            style={{
              fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
              fontSize: "28px",
              lineHeight: 1,
            }}
          >
            CPP
          </span>
          <span
            className="text-field-muted hidden sm:block"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
            }}
          >
            Cell Phone Paradise
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <a
            href="#services"
            className="text-field-muted hover:text-field-white transition-colors hidden md:block"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textDecoration: "none",
            }}
          >
            {t("nav_services")}
          </a>
          <a
            href="#repairs"
            className="text-field-muted hover:text-field-white transition-colors hidden md:block"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textDecoration: "none",
            }}
          >
            {t("nav_repairs")}
          </a>
          <a
            href="#reviews"
            className="text-field-muted hover:text-field-white transition-colors hidden md:block"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textDecoration: "none",
            }}
          >
            {t("nav_reviews")}
          </a>
          <a
            href="#booking"
            className="btn-neon text-arena"
            style={{ fontSize: "12px", padding: "8px 20px" }}
          >
            {t("nav_book")}
          </a>
        </div>
      </div>
    </nav>
  );
}
