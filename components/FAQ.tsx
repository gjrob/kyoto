"use client";
import { useState } from "react";
import { useLang } from "./LangContext";

const faqs = [
  {
    q: "How long does a repair take?",
    a: "Most repairs — screen replacements, battery swaps — are done same-day, often under an hour. Complex repairs may take longer and we'll give you an estimate upfront.",
  },
  {
    q: "Do you fix water-damaged phones?",
    a: "Yes. We diagnose water damage and do our best to restore your device. Not every phone can be saved but we'll be honest with you about the chances.",
  },
  {
    q: "What brands do you repair?",
    a: "iPhone, Samsung Galaxy, Google Pixel, Motorola, LG, OnePlus, HTC — all major brands. If you don't see yours listed, just call us.",
  },
  {
    q: "Do you sell used phones?",
    a: "Yes — we carry used, unlocked phones tested and ready to go. Call us to check current inventory at (910) 772-5599.",
  },
  {
    q: "Do you help with carrier issues?",
    a: "Absolutely. We sell SIM cards and help with all major carriers. We'll find the best fit for your budget and coverage area.",
  },
];

export default function FAQ() {
  const { t } = useLang();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-6 lg:px-10">
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
            {t("faq_eyebrow")}
          </p>
          <h2
            className="text-field-white"
            style={{
              fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
              fontSize: "clamp(56px, 8vw, 96px)",
              lineHeight: 0.9,
            }}
          >
            {t("faq_headline")}
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-px">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openIdx === i ? "open" : ""}`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-arena-panel hover:bg-arena-card transition-colors"
                style={{ border: "none", cursor: "pointer" }}
              >
                <span
                  className="text-field-white"
                  style={{
                    fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  {faq.q}
                </span>
                <span
                  className="text-neon shrink-0 ml-4"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "20px",
                    lineHeight: 1,
                    transform: openIdx === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s ease",
                    display: "inline-block",
                  }}
                >
                  +
                </span>
              </button>
              {openIdx === i && (
                <div
                  className="px-6 pb-5"
                  style={{ background: "#0f1419" }}
                >
                  <p
                    className="text-field-muted leading-relaxed"
                    style={{
                      fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                      fontSize: "13px",
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
