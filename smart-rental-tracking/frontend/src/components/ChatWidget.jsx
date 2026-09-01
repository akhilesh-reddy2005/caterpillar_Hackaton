import { useState } from "react";
import axios from "axios";

const WEBHOOK_URL = import.meta.env.VITE_CHATBOT_WEBHOOK_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Ask me about equipment, bookings or anomalies." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const question = input.trim();
    if (!question) return;
    setMessages((m) => [...m, { from: "user", text: question }]);
    setInput("");

    if (!WEBHOOK_URL) {
      setMessages((m) => [...m, { from: "bot", text: "Chatbot is not configured." }]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(WEBHOOK_URL, { question });
      const reply =
        res.data?.answer || res.data?.reply || res.data?.output ||
        (typeof res.data === "string" ? res.data : JSON.stringify(res.data));
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Sorry, the chatbot could not be reached." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 bg-cat-yellow text-cat-black font-black w-14 h-14 rounded-full shadow-lg text-xl"
        aria-label="Chat"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-80 max-w-[90vw] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-cat-black text-white px-4 py-2 font-bold text-sm">
            Rental Assistant
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[85%] ${
                  m.from === "user"
                    ? "bg-cat-yellow text-cat-black ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs">Thinking…</div>}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a question…"
              className="flex-1 border rounded-lg px-2 py-1 text-sm"
            />
            <button
              onClick={send}
              className="bg-cat-black text-white text-sm font-semibold px-3 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
