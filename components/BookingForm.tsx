"use client";
import { useState } from "react";
import { brand } from "@/lib/brand";
import { useLang } from "./LangContext";

const deviceOptions = [
  "iPhone",
  "Samsung Galaxy",
  "Google Pixel",
  "iPad / Tablet",
  "Android Phone",
  "Laptop / Computer",
  "Other",
];

const serviceOptions = [
  "Screen Replacement",
  "Battery Replacement",
  "Charging Port",
  "Water Damage",
  "Camera Repair",
  "Speaker / Mic",
  "Data Recovery",
  "Computer Repair",
  "SIM / Carrier Help",
  "Phone Purchase",
  "Other",
];

export default function BookingForm() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    device: "",
    service: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: lang }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", device: "", service: "", notes: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
    fontSize: "13px",
    background: "#080b0f",
    border: "1px solid rgba(57,255,20,0.15)",
    color: "#f0f4f8",
    padding: "12px 14px",
    width: "100%",
    outline: "none",
    display: "block",
  };

  return (
    <section
      id="booking"
      className="py-20 px-6 lg:px-10 border-t border-b"
      style={{
        background: "#0f1419",
        borderTopColor: brand.colors.gridLine,
        borderBottomColor: brand.colors.gridLine,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left panel */}
        <div className="flex flex-col justify-center">
          <p
            className="text-cyan uppercase mb-4"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.25em",
            }}
          >
            {t("booking_eyebrow")}
          </p>
          <h2
            className="text-field-white mb-6"
            style={{
              fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
              fontSize: "clamp(48px, 7vw, 80px)",
              lineHeight: 0.9,
            }}
          >
            {t("booking_headline")}
          </h2>
          <p
            className="text-field-muted mb-8"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            {t("booking_sub")}
          </p>
          <div
            className="flex flex-wrap gap-4"
            style={{
              fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
              fontSize: "12px",
              color: brand.colors.neon,
              letterSpacing: "0.05em",
            }}
          >
            {t("booking_stats").split("  |  ").map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        {/* Right panel: form */}
        <div>
          {status === "success" ? (
            <div
              className="flex flex-col items-start justify-center h-full gap-4"
              style={{ borderLeft: "3px solid #39ff14", paddingLeft: "24px" }}
            >
              <p
                className="text-neon"
                style={{
                  fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                  fontSize: "32px",
                  lineHeight: 1,
                }}
              >
                DROP-OFF BOOKED ✓
              </p>
              <p
                className="text-field-muted"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "13px",
                }}
              >
                We&apos;ll call you shortly. You can also reach us at{" "}
                <a href={brand.tel} className="text-amber">{brand.phone}</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                style={inputStyle}
                placeholder={t("form_name")}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
              <input
                style={inputStyle}
                placeholder={t("form_phone")}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                required
              />
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.device}
                onChange={(e) => set("device", e.target.value)}
              >
                <option value="">{t("form_device")}</option>
                {deviceOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.service}
                onChange={(e) => set("service", e.target.value)}
              >
                <option value="">{t("form_service")}</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                placeholder={t("form_notes")}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-neon w-full"
                style={{ fontSize: "13px", opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "SUBMITTING..." : t("form_submit")}
              </button>
              <p
                className="text-center"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "12px",
                  color: brand.colors.amber,
                }}
              >
                {t("form_or")}{" "}
                <a href={brand.tel} className="hover:text-field-white transition-colors">
                  {brand.phone}
                </a>
              </p>
              {status === "error" && (
                <p
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "11px",
                    color: "#ff4444",
                    textAlign: "center",
                  }}
                >
                  Something went wrong. Please call us at {brand.phone}.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
