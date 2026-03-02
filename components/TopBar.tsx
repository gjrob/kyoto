"use client";
import { brand } from "@/lib/brand";
import { useLang } from "./LangContext";

export default function TopBar() {
  const { t, lang, setLang } = useLang();
  return (
    <div
      className="bg-arena w-full border-b"
      style={{
        borderBottomColor: brand.colors.gridLine,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
        {/* Left: open status */}
        <span
          className="text-neon whitespace-nowrap"
          style={{ fontFamily: "var(--font-share-mono), Share Tech Mono, monospace", fontSize: "10px", letterSpacing: "0.15em" }}
        >
          {t("topbar_open")}
        </span>

        {/* Center: phone */}
        <a
          href={brand.tel}
          className="text-amber hover:text-field-white transition-colors"
          style={{ fontFamily: "var(--font-share-mono), Share Tech Mono, monospace", fontSize: "12px", letterSpacing: "0.1em" }}
        >
          {brand.phone}
        </a>

        {/* Right: address + lang toggle */}
        <div className="flex items-center gap-4">
          <span
            className="text-field-muted hidden sm:block"
            style={{ fontFamily: "var(--font-share-mono), Share Tech Mono, monospace", fontSize: "10px" }}
          >
            {t("topbar_address")}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLang("en")}
              className="transition-colors"
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: lang === "en" ? "#39ff14" : "#6b7a8d",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
              }}
            >
              EN
            </button>
            <span className="text-field-muted" style={{ fontSize: "10px" }}>|</span>
            <button
              onClick={() => setLang("es")}
              className="transition-colors"
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: lang === "es" ? "#39ff14" : "#6b7a8d",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
              }}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
