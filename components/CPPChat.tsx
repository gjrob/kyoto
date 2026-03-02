"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "./LangContext";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function CPPChat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: t("chat_greeting") },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Sorry — please call us at (910) 772-5599." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Call us at (910) 772-5599." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col"
          style={{
            width: "340px",
            maxWidth: "calc(100vw - 2rem)",
            height: "460px",
            background: "#0f1419",
            border: "1px solid rgba(57,255,20,0.25)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{
              background: "#080b0f",
              borderBottomColor: "rgba(57,255,20,0.15)",
            }}
          >
            <div>
              <p
                className="text-neon neon-glow"
                style={{
                  fontFamily: "var(--font-black-han), Black Han Sans, sans-serif",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >
                CPP
              </p>
              <p
                className="text-field-muted mt-0.5"
                style={{
                  fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Ask about repairs
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-field-muted hover:text-field-white transition-colors"
              aria-label="Close chat"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] px-4 py-2.5 leading-relaxed"
                  style={{
                    fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    background: msg.role === "user" ? "#39ff14" : "rgba(255,255,255,0.05)",
                    color: msg.role === "user" ? "#080b0f" : "rgba(240,244,248,0.9)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px 16px" }}>
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: "6px",
                          height: "6px",
                          background: "#39ff14",
                          display: "inline-block",
                          animation: "bounce 0.8s infinite",
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="border-t flex"
            style={{ background: "#080b0f", borderTopColor: "rgba(57,255,20,0.15)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t("chat_placeholder")}
              className="flex-1 bg-transparent px-4 py-3.5 focus:outline-none"
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "12px",
                color: "#f0f4f8",
                border: "none",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                fontFamily: "var(--font-share-mono), Share Tech Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "#39ff14",
                background: "none",
                border: "none",
                padding: "0 16px",
                cursor: "pointer",
                opacity: loading || !input.trim() ? 0.3 : 1,
              }}
            >
              {t("chat_send")}
            </button>
          </div>
        </div>
      )}

      {/* Trigger button — neon circle with wrench icon */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center transition-colors"
        aria-label="Open chat"
        style={{
          background: "#39ff14",
          border: "none",
          cursor: "pointer",
        }}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#080b0f" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Wrench icon */
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#080b0f" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
        )}
      </button>
    </>
  );
}
