import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../config";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "bn", label: "বাংলা" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
];

const ChatAssistant = () => {
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState("en");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hi! Tell me what kind of doctor you need, and I'll find matches for you.",
        },
    ]);
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/ai/match-doctors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, language }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Failed");

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: data.reply,
                    doctors: data.doctors,
                    emergency: data.emergency,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Sorry, I could not help right now. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {open && (
                <div className="mb-3 flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
                    <div className="bg-primaryColor px-4 py-3 text-white">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[16px] font-semibold">Medicare Assistant</h4>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="rounded bg-white px-1 py-0.5 text-[13px] text-headingColor"
                                aria-label="Language"
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l.code} value={l.code}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="mt-1 text-[12px] opacity-90">
                            AI assistant. Not a substitute for medical advice.
                        </p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-3">
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                                <div
                                    className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-[14px] ${
                                        m.role === "user"
                                            ? "bg-primaryColor text-white"
                                            : m.emergency
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-headingColor"
                                    }`}
                                >
                                    {m.text}
                                </div>

                                {m.doctors?.length > 0 && (
                                    <div className="mt-2 space-y-2 text-left">
                                        {m.doctors.map((d) => (
                                            <Link
                                                key={d._id}
                                                to={`/doctors/${d._id}`}
                                                className="flex items-center gap-3 rounded-lg border border-solid border-[#0066ff34] p-2 hover:bg-gray-50"
                                            >
                                                <img
                                                    src={d.photo}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-[14px] font-semibold text-headingColor">
                                                        {d.name}
                                                    </p>
                                                    <p className="text-[12px] text-textColor">
                                                        {d.specialization} · ₹{d.ticketPrice} · ★{" "}
                                                        {Number(d.averageRating || 0).toFixed(1)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <p className="text-[13px] text-textColor">Thinking...</p>}
                        <div ref={endRef} />
                    </div>

                    <form onSubmit={sendMessage} className="flex gap-2 border-t p-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            maxLength={500}
                            placeholder="e.g. a skin doctor under 600"
                            className="flex-1 rounded-md border border-solid border-[#0066ff34] px-3 py-2 text-[14px] outline-none focus:border-primaryColor"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-primaryColor px-3 text-[14px] text-white disabled:opacity-60"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setOpen((o) => !o)}
                className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primaryColor text-[24px] text-white shadow-lg"
                aria-label={open ? "Close assistant" : "Open assistant"}
            >
                {open ? "×" : "💬"}
            </button>
        </div>
    );
};

export default ChatAssistant;