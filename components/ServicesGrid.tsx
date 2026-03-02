"use client";
import { useLang } from "./LangContext";

const services = [
  { icon: "📱", name: "Screen Replacement", desc: "Cracked or shattered? Back in 1 hour.", from: 49 },
  { icon: "🔋", name: "Battery Replacement", desc: "Dying fast? Full charge restored same-day.", from: 39 },
  { icon: "⚡", name: "Charging Port Repair", desc: "Won't charge? We clean or replace it.", from: 29 },
  { icon: "💧", name: "Water Damage", desc: "Got wet? We diagnose and restore.", from: 49 },
  { icon: "🔭", name: "Camera Repair", desc: "Blurry shots? We fix front and rear.", from: 39 },
  { icon: "🔊", name: "Speaker / Mic Repair", desc: "Can't hear or be heard? Fixed fast.", from: 29 },
  { icon: "💾", name: "Data Recovery", desc: "Lost photos and contacts? We recover them.", from: 59 },
  { icon: "💻", name: "Computer Repair", desc: "Laptop, desktop, Mac — all covered.", from: 49 },
  { icon: "📡", name: "SIM & Carrier Help", desc: "All carriers, unlocking, setup assistance.", from: 19 },
  { icon: "🎮", name: "Tablet Repair", desc: "iPad, Android tablet — screens and more.", from: 49 },
  { icon: "🏪", name: "Phone Sales", desc: "Used, unlocked phones tested and ready.", from: 79 },
  { icon: "🛡️", name: "Back Glass Repair", desc: "Shattered back? We replace it clean.", from: 39 },
];

export default function ServicesGrid() {
  const { t } = useLang();
  return (
    <section id="services" className="py-20 px-6 lg:px-10">
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
            {t("services_eyebrow")}
          </p>
          <h2
            className="text-field-white"
            style={{
              fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
              fontSize: "clamp(56px, 8vw, 96px)",
              lineHeight: 0.9,
            }}
          >
            {t("services_headline")}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-grid-line">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="service-card p-6 flex flex-col gap-3"
              style={{ background: "#1a2332" }}
            >
              <span style={{ fontSize: "36px", lineHeight: 1 }}>{svc.icon}</span>
              <h3
                className="text-field-white"
                style={{
                  fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                  fontSize: "20px",
                  lineHeight: 1.1,
                }}
              >
                {svc.name}
              </h3>
              <p
                className="text-field-muted flex-1"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                {svc.desc}
              </p>
              <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid rgba(57,255,20,0.08)" }}>
                <span
                  className="text-neon"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                  }}
                >
                  FROM ${svc.from}
                </span>
                <a
                  href="#booking"
                  className="text-neon hover:text-field-white transition-colors"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                  }}
                >
                  → BOOK
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
