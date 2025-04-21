"use client";
import { useState } from "react";

//new dependency
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; 
import 'katex/dist/katex.min.css';



type ChatMessage = {
  sender: "user" | "bot"; // Fix tipe data sender (tipe data)
  text: string;
};

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat: ChatMessage[] = [...chat, { sender: "user", text: message }]; // Perbaikan tipe
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChat([...newChat, { sender: "bot", text: data.reply } as ChatMessage]); // Pastikan tipe ChatMessage
    } catch (error) {
      setChat([...newChat, { sender: "bot", text: "Terjadi kesalahan!" } as ChatMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full items-center bg-white p-4">
  <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
    Chatbot Pendidikan, Penulisan & Kreativitas
  </h1>

  {/* Wrapper untuk Chat dan Input */}
  <div className="flex flex-col w-full max-w-5xl flex-1 overflow-hidden">
    {/* Chat Container (scrollable) */}
    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md overflow-y-auto space-y-3">
      {chat.map((msg, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          {/* Avatar */}
          {msg.sender === "bot" && (
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-lg">
              🤖
            </div>
          )}

          {/* Chat Bubble */}
          <div
            className={`max-w-[80%] p-3 rounded-lg text-sm md:text-base ${
              msg.sender === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, className, children, ...props }) {
                  return (
                    <code className={`${className} bg-gray-100 p-1 rounded`} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>

          {/* User Avatar */}
          {msg.sender === "user" && (
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg">
              🧑
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-lg">
            🤖
          </div>
          <div className="bg-gray-200 p-3 rounded-lg text-gray-500 text-sm">Mengetik...</div>
        </div>
      )}
    </div>

    {/* Input Area (fixed di bawah container) */}
    <div className="flex mt-4">
      <input
        type="text"
        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ketik pesan..."
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg disabled:opacity-50"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "..." : "Kirim"}
      </button>
    </div>
  </div>
</div>

  );
  
}
