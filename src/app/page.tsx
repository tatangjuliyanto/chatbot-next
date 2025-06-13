"use client";
import { useState, useEffect } from "react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize with system preference
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat: ChatMessage[] = [...chat, { sender: "user", text: message }];
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
      setChat([...newChat, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setChat([...newChat, { sender: "bot", text: "Terjadi kesalahan!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen w-full items-center transition-colors duration-200 p-4 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-white text-gray-800'
    }`}>
      {/* Header with title and theme toggle */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
          Chatbot Pendidikan, Penulisan & Kreativitas
        </h1>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`ml-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            //if dark screen using MOON
            // <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            //   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            // </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            // <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            //   <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            // </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col w-full max-w-4xl flex-1 overflow-hidden">
        {/* Chat Container */}
        <div className={`flex-1 p-4 rounded-lg shadow-md overflow-y-auto space-y-3 transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800' 
            : 'bg-gray-50'
        }`}>
          {chat.length === 0 && (
            <div className={`text-center mt-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-lg">Selamat datang! Silakan mulai percakapan.</p>
              <p className="text-sm mt-2">Saya siap membantu Anda dengan pendidikan, penulisan, dan kreativitas.</p>
            </div>
          )}
          
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg flex-shrink-0 ${
                  isDarkMode 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-blue-100 text-gray-800'
                }`}>
                  🤖
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm md:text-base transition-colors duration-200 ${
                  msg.sender === "user"
                    ? "bg-blue-600 hover:bg-blue-700 text-white rounded-br-none shadow-md"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-100 rounded-bl-none shadow-sm"
                    : "bg-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                {/* Simple text rendering instead of ReactMarkdown */}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg flex-shrink-0">
                  👨🏼
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg ${
                isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                🤖
              </div>
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{animationDelay: '0.1s'}}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>Mengetik...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex mt-4 shadow-lg">
          <input
            type="text"
            className={`flex-1 border px-8 py-6 text-base rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              isDarkMode
                ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'
            }`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
          />
          <button
            className={`text-white px-8 py-6 text-base rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading || !message.trim()
                ? isDarkMode
                  ? 'bg-blue-800 opacity-50 cursor-not-allowed'
                  : 'bg-blue-400 opacity-50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-2'}`}
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>...</span>
              </div>
            ) : (
              <span>Kirim</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}