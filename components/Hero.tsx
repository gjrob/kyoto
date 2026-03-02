"use client";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { images } from "@/lib/images";
import { useLang } from "./LangContext";

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="relative min-h-screen bg-arena overflow-hidden scanlines flex flex-col">
      {/* Ticker strip */}
      <div
        className="w-full overflow-hidden py-2 border-b shrink-0"
        style={{ background: "#0a0e14", borderBottomColor: brand.colors.amber }}
      >
        <div className="ticker-track flex">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="inline-block mr-16"
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: brand.colors.amber,
              }}
            >
              {t("hero_ticker")}
            </span>
          ))}
        </div>
      </div>

      {/* Stat bar */}
      <div
        className="w-full border-b shrink-0"
        style={{ background: "#0d1218", borderBottomColor: brand.colors.gridLine }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-4">
          {[
            { num: "4.8★", label: t("stat_rating_label") },
            { num: t("stat_time_num"), label: t("stat_time_label") },
            { num: "ALL", label: t("stat_brands_label") },
            { num: "15+", label: t("stat_services_label") },
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-bar-item py-5 px-6 flex flex-col items-center gap-1"
            >
              <span
                className="text-neon neon-glow"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "clamp(24px, 4vw, 48px)",
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </span>
              <span
                className="text-field-muted uppercase"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative flex-1 flex items-center z-10">
        {/* Left content */}
        <div className="max-w-7xl mx-auto w-full px-8 lg:px-16 py-16 lg:py-24">
          <div className="max-w-[600px]">
            {/* Eyebrow */}
            <p
              className="text-cyan cyan-glow mb-6 uppercase"
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "11px",
                letterSpacing: "0.25em",
              }}
            >
              {t("hero_eyebrow")}
            </p>

            {/* Headline */}
            <h1
              className="text-field-white leading-none mb-2"
              style={{
                fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                fontSize: "clamp(72px, 13vw, 160px)",
                lineHeight: 0.88,
              }}
            >
              {t("hero_line1")}
              <br />
              {t("hero_line2")}
              <br />
              <span className="text-neon neon-glow">{t("hero_line3")}</span>
            </h1>

            {/* Sub */}
            <p
              className="text-field-muted mt-8 mb-10 leading-relaxed"
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "14px",
              }}
            >
              {t("hero_sub")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a href="#booking" className="btn-neon" style={{ fontSize: "14px" }}>
                {t("cta_book")}
              </a>
              <a href="#services" className="btn-ghost" style={{ fontSize: "11px" }}>
                {t("cta_services")}
              </a>
              <a
                href={brand.tel}
                className="hover:text-field-white transition-colors self-center"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "12px",
                  color: brand.colors.amber,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                }}
              >
                {t("cta_call")}
              </a>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block"
          style={{ width: "42%", maxWidth: "600px" }}
        >
          <div className="neon-frame" style={{ border: "1px solid #39ff14" }}>
            <Image
              src={images.hero}
              alt="Phone repair technician"
              width={600}
              height={700}
              className="block w-full"
              style={{ objectFit: "cover", height: "500px", display: "block" }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
