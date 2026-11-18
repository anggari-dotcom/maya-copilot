// Tanya Maya — AI Q&A (Fitur 3, R3).
// Chat UI: jawaban dari /api/ask (KB lokal bila tanpa GEMINI_API_KEY,
// Gemini bila key ada). Mode aktif ditampilkan dari field `source` respons.
// Riwayat chat tersimpan di localStorage. Semua string UI lewat t().
"use client";

import { useEffect, useRef, useState } from "react";
import { FAQ, WA_DISPLAY, waLink } from "@/lib/packages";
import { useLang } from "@/lib/i18n";

interface ChatMsg {
  role: "user" | "maya";
  text: string;
  source?: "kb" | "gemini";
}

const STORAGE_KEY = "maya-chat-history";

export default function TanyaPage() {
  const { lang, t } = useLang();
  const id = lang === "id";
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Mode aktif: dari `source` respons terakhir; default KB (mode tanpa key).
  const [mode, setMode] = useState<"kb" | "gemini">("kb");
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMsg[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          const lastMaya = [...parsed]
            .reverse()
            .find((m) => m.role === "maya" && m.source);
          if (lastMaya?.source) setMode(lastMaya.source);
        }
      }
    } catch {
      // Riwayat rusak — mulai dari kosong.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, loaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = (await res.json()) as {
        answer?: string;
        source?: "kb" | "gemini";
      };
      const source = data.source ?? "kb";
      setMode(source);
      setMessages((prev) => [
        ...prev,
        {
          role: "maya",
          text: data.answer ?? t("askError"),
          source,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "maya", text: t("askError") }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            {t("askTitle")}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">{t("askSub")}</p>
        </div>
        <span className="rounded-full bg-navy-100 px-3 py-1.5 text-xs font-bold text-navy-900">
          {loading
            ? t("askTyping")
            : mode === "gemini"
              ? t("askModeGemini")
              : t("askModeKb")}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chat */}
        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-navy-900">
              💬 {id ? "Chat dengan Maya" : "Chat with Maya"}
            </p>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-semibold text-slate-500 hover:text-red-600"
              >
                {t("askClear")}
              </button>
            )}
          </div>

          <div className="max-h-[480px] min-h-[280px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && !loading && (
              <p className="rounded-xl bg-navy-50 px-4 py-3 text-sm text-slate-600">
                {t("askEmpty")}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-navy-900 text-white"
                      : "rounded-bl-sm bg-navy-50 text-slate-800"
                  }`}
                >
                  <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide opacity-70">
                    {m.role === "user" ? t("askYou") : "Maya"}
                  </p>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-navy-50 px-4 py-2.5 text-sm text-slate-600">
                  {t("askTyping")}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(input);
            }}
            className="flex gap-2 border-t border-slate-100 px-4 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("askPlaceholder")}
              disabled={loading}
              className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-navy-900 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-500 disabled:opacity-50"
            >
              {t("askSend")}
            </button>
          </form>
        </section>

        {/* FAQ + catatan */}
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-navy-900">
              {t("askFaqTitle")}
            </p>
            <div className="mt-3 grid gap-2">
              {FAQ.map((f) => (
                <button
                  key={f.q}
                  onClick={() => void ask(f.q)}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-navy-900 hover:border-gold-400 hover:bg-gold-400/10 disabled:opacity-50"
                >
                  {f.q}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs leading-relaxed text-slate-500">
              ℹ️ {t("askNote")}
            </p>
            <a
              href={waLink(
                "Halo Angga, saya mau tanya soal Open Trip Maya.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
            >
              {t("askWa")} · {WA_DISPLAY}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
