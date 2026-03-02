"use client";
import Image from "next/image";
import { images } from "@/lib/images";
import { useLang } from "./LangContext";

export default function AboutSection() {
  const { t } = useLang();
  return (
    <section
      id="about"
      className="py-20 px-6 lg:px-10"
      style={{ background: "#0f1419" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: image with neon frame */}
        <div className="relative neon-frame" style={{ border: "1px solid #39ff14" }}>
          {/* Extra corner brackets */}
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 24,
              height: 24,
              borderTop: "3px solid #39ff14",
              borderRight: "3px solid #39ff14",
              zIndex: 10,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: -3,
              left: -3,
              width: 24,
              height: 24,
              borderBottom: "3px solid #39ff14",
              borderLeft: "3px solid #39ff14",
              zIndex: 10,
            }}
          />
          <Image
            src={images.shop}
            alt="Cell Phone Paradise shop"
            width={600}
            height={450}
            className="block w-full"
            style={{ objectFit: "cover", height: "420px", display: "block" }}
          />
        </div>

        {/* Right: content */}
        <div>
          <p
            className="text-cyan uppercase mb-4"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.25em",
            }}
          >
            {t("about_eyebrow")}
          </p>
          <h2
            className="text-field-white mb-6"
            style={{
              fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
              fontSize: "clamp(42px, 6vw, 72px)",
              lineHeight: 0.95,
            }}
          >
            {t("about_headline")}
          </h2>
          <p
            className="text-field-muted mb-8 leading-relaxed"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            {t("about_body")}
          </p>

          {/* Stat badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-8" style={{ background: "rgba(57,255,20,0.08)" }}>
            {[
              t("about_stat1"),
              t("about_stat2"),
              t("about_stat3"),
            ].map((stat) => (
              <div
                key={stat}
                className="py-4 px-5 text-center"
                style={{ background: "#1a2332" }}
              >
                <p
                  className="text-neon"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {stat}
                </p>
              </div>
            ))}
          </div>

          <a href="#booking" className="btn-ghost" style={{ fontSize: "11px" }}>
            {t("about_cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
